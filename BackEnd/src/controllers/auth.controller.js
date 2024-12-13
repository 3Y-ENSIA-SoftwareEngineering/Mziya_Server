import dotenv from 'dotenv';
import twilio from 'twilio';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import sendEmail from '../utils/sendEmail.js';
import { StatusCodes } from 'http-status-codes';
import randomNumbers from '../utils/randomNumbers.js';
import supabase from '../config/database.js'; // Updated import for Supabase
import path from 'path';

dotenv.config();

// Twilio Configuration
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_API_KEY;
const client = twilio(accountSid, authToken);

// Register Controller
const register = async (req, res) => {
    try {
        console.log("Received registration request:", req.body);

        const { first_name, last_name, date_of_birth, phone, email, password, gender, national_id } = req.body;

        console.log("Checking if email already exists...");
        const { data: existingUser, error: selectError } = await supabase
            .from('users')
            .select('user_id')
            .eq('email', email)
            .single();

        if (existingUser) {
            console.log("Email already exists in database.");
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'E-mail already exists',
            });
        }

        if (selectError && selectError.code !== 'PGRST116') {
            console.error('Error checking for existing email:', selectError);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Internal Server Error',
            });
        }

        console.log("Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("Generating user ID...");
        const user_id = uuidv4();

        console.log("Attempting to insert user into database...");
        const { error: insertError } = await supabase.from('users').insert([
            {
                user_id,
                first_name,
                last_name,
                date_of_birth,
                phone,
                email,
                password: hashedPassword,
                gender,
                national_id,
                profile_picture: null,
                verified: false,
            }
        ]);

        if (insertError) {
            console.error('Error inserting user into database:', insertError);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Internal Server Error',
            });
        }

        console.log("Creating token for email verification...");
        const token = jwt.sign({ user_id }, process.env.JWT_SECRET, { expiresIn: '10m' });

        console.log("Sending email...");
        await sendEmail(email, token, 'confirmation');

        console.log("Registration successful, redirecting to check_email...");
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'User registered successfully.',
            redirect: '../check_email',
        });
    } catch (error) {
        console.error('Unexpected error during registration:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

// Login Controller
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Attempting to find user...");
        const { data: user, error: selectError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (selectError) {
            if (selectError.code === 'PGRST116') {
                console.log("No user found.");
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: 'Invalid email',
                });
            }

            console.error('Error while fetching user:', selectError);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Internal Server Error',
            });
        }

        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if (!isCorrectPassword) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: 'Invalid password',
            });
        }

        if (!user.verified) {
            const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '10m' });
            await sendEmail(email, token, 'confirmation');
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: 'Please verify your email',
            });
        }

        const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '10d' });

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Logged in successfully.",
            token,
        });
    } catch (error) {
        console.error('Unexpected error during login process:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

// Verify User Email Controller
const verifyUserEmail = async (req, res) => {
    try {
        const token = req.params.token;
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user_id = payload.user_id;

        const { error: updateError } = await supabase
            .from('users')
            .update({ verified: true })
            .eq('user_id', user_id);

        if (updateError) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Internal Server Error',
                details: updateError,
            });
        }

        const realToken = jwt.sign({ user_id }, process.env.JWT_SECRET, { expiresIn: '10d' });

        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'User verified successfully.',
            token: realToken,
        });
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: 'Token has expired',
            });
        }

        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Error verifying email',
        });
    }
};


// Forgot Password Controller
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const { data: user, error: selectError } = await supabase
            .from('users')
            .select('user_id')
            .eq('email', email)
            .single();

        if (selectError) {
            if (selectError.code === 'PGRST116') {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid email' });
            } else {
                console.error('Error fetching user for forgot password:', selectError);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        }

        const user_id = user.user_id;

        const token = jwt.sign({ user_id }, process.env.JWT_SECRET, { expiresIn: '10m' });
        await sendEmail(email, token, 'resetPassword');

        return res.status(StatusCodes.OK).json({ message: 'Reset password link sent to your email' });
    } catch (error) {
        console.error('Error during forgot password:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
};

// Reset Password Controller
const resetPassword = async (req, res) => {
    const token = req.params.token;
    const { newPassword } = req.body;

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user_id = payload.user_id;

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const { error: updateError } = await supabase
            .from('users')
            .update({ password: hashedPassword })
            .eq('user_id', user_id);

        if (updateError) {
            console.error('Error updating password:', updateError);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }

        return res.status(StatusCodes.OK).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
};

export { register, login, verifyUserEmail, forgotPassword, resetPassword };
