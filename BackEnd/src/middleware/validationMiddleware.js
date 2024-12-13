import { body, validationResult } from 'express-validator';

// Middleware for validating request data
const validateRequest = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    // Return the first validation error encountered
    res.status(400).json({ error: errors.array()[0].msg });
  };
};

// Registration validation
const validateRegister = [
  body('first_name')
    .notEmpty()
    .withMessage('First name is required'),
  body('last_name')
    .notEmpty()
    .withMessage('Last name is required'),
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
    body('phone')
    .matches(/^(05|06|07)\d{8}$/)
    .withMessage('Phone number must start with 05, 06, or 07 and have exactly 10 digits'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[0-9]/)
    .withMessage('Password must contain a number')
    .matches(/[a-z]/)
    .withMessage('Password must contain a lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter')
    .matches(/[!@#$%^&*(),.?"\':;{}|<>-_]/)
    .withMessage('Password must contain a special character'),
  body('gender')
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  body('national_id')
    .isLength({ min: 9, max: 18 })
    .withMessage('National ID must be between 9 and 18 characters'),
  body('date_of_birth')
    .isISO8601()
    .withMessage('Valid date of birth is required'),
  body('profile_picture')
    .optional()
    .isString()
    .withMessage('Profile picture must be a valid string reference or URL'),
  body('verified')
    .optional()
    .isBoolean()
    .withMessage('Verified must be true or false')
];

// Login validation
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// OTP verification validation
const validateVerifyOTP = [
  body('otp')
    .isNumeric()
    .withMessage('OTP must be a valid number')
];

// Forgot password validation
const validateForgotPassword = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail()
];

// Reset password validation
const validateResetPassword = [
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[0-9]/)
    .withMessage('Password must contain a number')
    .matches(/[a-z]/)
    .withMessage('Password must contain a lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter')
    .matches(/[!@#$%^&*(),.?"\':;{}|<>-_]/)
    .withMessage('Password must contain a special character')
];

// Update password validation
const validateUpdatePassword = [
  body('oldPassword')
    .notEmpty()
    .withMessage('Old password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[0-9]/)
    .withMessage('Password must contain a number')
    .matches(/[a-z]/)
    .withMessage('Password must contain a lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter')
    .matches(/[!@#$%^&*(),.?"\':;{}|<>-_]/)
    .withMessage('Password must contain a special character')
];

// Update email validation
const validateUpdateEmail = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail()
];

// Edit profile validation
const validateEditProfile = [
  body('first_name')
    .notEmpty()
    .withMessage('First name is required'),
  body('last_name')
    .notEmpty()
    .withMessage('Last name is required'),
    body('phone')
    .matches(/^(05|06|07)\d{8}$/)
    .withMessage('Phone number must start with 05, 06, or 07 and have exactly 10 digits'),

];

export {
  validateRequest,
  validateRegister,
  validateLogin,
  validateVerifyOTP,
  validateForgotPassword,
  validateResetPassword,
  validateUpdatePassword,
  validateUpdateEmail,
  validateEditProfile
};
