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
// after successful registration, the user is automatically logged in by creating a session cookie
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

        // create and velidate a JWT token for session
        console.log("Creating session token ...");
        let sessionToken;
        try {
            sessionToken = jwt.sign({ user_id }, process.env.JWT_SECRET, { expiresIn: '10d'});
        } catch (err) {
            console.error('Error creating JWT token (session token):', err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Failed to generate session token',
            });
        }

        // set the session token to the cookie
        console.log("Setting session token cookie ...");
        res.cookie('session_token', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days in milliseconds
            sameSite: 'strict'
        });

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

        console.log('Creating session token ...');
        let token;
        try {
            token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '10d' });
        } catch (err) {
            console.error('Error while generating session token:', err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Failed to generate session token',
            });
        }

        // set the token in a cookie
        console.log("Setting session token to cookie ...")
        res.cookie('session_token', token, {
            httpOnly: true, // prevent js from accessing the cookie
            maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days in milliseconds
            sameSite: 'strict', // ensure cookie is sent only to th same site
            secure: process.env.NODE_ENV === 'production', // secure the cookie only in production
        });

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

        // Generate a new token if needed
        const realToken = jwt.sign({ user_id }, process.env.JWT_SECRET, { expiresIn: '10d' });

        // Redirect the user to the login page
        return res.redirect(`http://localhost:3001/login?verified=true`);
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            return res.redirect(`http://localhost:3001/login?verified=false&reason=expired`);
        }

        return res.redirect(`http://localhost:3001/login?verified=false&reason=error`);
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

// logout controller
const logout = (req, res) => {
    try {
        // Clear the session token cookie
        res.clearCookie("session_token", { httpOnly: true, secure: true });
        console.log("User logged out successfully.");
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Logged out successfully.",
        });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "An error occurred while logging out.",
        });
    }
};

export { register, login, verifyUserEmail, forgotPassword, resetPassword, logout };
