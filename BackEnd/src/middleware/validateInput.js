import { body, validationResult } from 'express-validator';


// validate job input
const jobTypeOptions = ['small_task', 'large_task', 'part_time', 'full_time'];
const jobCategoryOptions = ['Babysitting', 'Child Care', 'Plumbing', 'Gardening', 'Painting', 'Electrical', 'Cleaning', 'Private Tutor'];
const jobStatusOptions = ['pending', 'in_progress', 'completed', 'cancelled']; 
const availabilityTypeOptions = ['open', 'closed'];
const requiredGenderOptions = ['any', 'male', 'female'];

const validateJobInput = [
 /* body('home_owner_id')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('Homeowner ID is required and cannot be null or empty')
  .matches(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89a-f]{1}-[0-9a-f]{12}$/i)
  .withMessage('Homeowner ID must be a valid UUID version 4'),
*/
  // *** description ***
  // according to the db, it can be null
  body('description')
    .trim() // clean and format the input
    .isLength({min: 10, max: 500}) // constraint the length. discuss this with the team members
    .withMessage('Description must be between 10 and 500 characters'),


  // *** location ***
  // according to the db, it can NOT be null
  body('location')
    .exists({checkNull: true, checkFalsy: true})
    .trim()
    .isLength({min: 2, max: 100})
    .withMessage('Location must be between 2 and 100 characters'),


  // *** job type ***
  // according to the db, it can NOT be null
  // type enum
  body('job_type')
    .exists({checkNull: true, checkFalsy: true})
    .isIn(jobTypeOptions)
    .withMessage(`Job type must be one of: ${jobTypeOptions.join(', ')}`),


  // *** job category ***
  // according to the db, it can NOT be null
  body('job_category')
    .exists({checkNull: true, checkFalsy: true})
    .isIn(jobCategoryOptions)
    .withMessage(`Job category must be one of: ${jobCategoryOptions.join(', ')}`),


  // *** budget ***
  // according to the db, it can NOT be null
  body('budget')
    .isFloat({min: 0})
    .withMessage('Budget must be a non-negative number'),


  // *** status ***
  // accorging to the db, it can be null
  body('status')
    .isIn(jobStatusOptions)
    .withMessage(`Status must be one of: ${jobStatusOptions.join(', ')}`),


  // *** availability type ***
  // accorging to the db, it can NOT be null
  body('availability_type')
    .exists({checkNull: true, checkFalsy: true})
    .isIn(availabilityTypeOptions)
    .withMessage(`Availability type must be one of: ${availabilityTypeOptions.join(', ')}`),


  // *** start date ***
  body('start_date')
    .optional({nullable: true}) // it's an optional field so it can be null
    .isISO8601() // ensure the date format is valid
    .toDate() // convert to a js Date object
    .withMessage('Start date must be a valid date'),


  // *** end date ***
  body('end_date')
    .optional({nullable: true}) // it's an optional field so it can be null
    .isISO8601() // ensure the date format is valid
    .toDate() // convert to a js Date object
    .withMessage('Start date must be a valid date')
    .custom((value, { req }) => {
      if (req.body.start_date && value){ // both start and end date are given
        // ensure the end date is after the start date
        const startDate = new Date(req.body.start_date);
        const endDate = new Date(value);
        if(endDate < startDate){
          throw new Error('End date must be later than start date');
        }
      }
      return true;
    }),


  // *** age fields validation ***
  // acording to the database, they can be null (optional)
  body('age_matters')
    .isBoolean()
    .withMessage('age_matters must be a boolean'),

    body('age_min')
    .optional({ nullable: true }) // explicitly allow null
    .if(body('age_min').exists({ checkNull: false })) // only validate if a value exists
    .isInt({ min: 18, max: 75 })
    .withMessage('Minimum age must be at least 18'),

body('age_max')
    .optional({ nullable: true }) // explicitly allow null
    .if(body('age_max').exists({ checkNull: false })) // only validate if a value exists
    .isInt({ min: 18, max: 75 })
    .withMessage('Maximum age must be at most 75')
    .custom((value, { req }) => {
      // Only run this check if both values are non-null
      if (req.body.age_min != null && value != null) {
        if (parseInt(value) <= parseInt(req.body.age_min)) {
          throw new Error('Maximum age must be greater than minimum age');
        }
      }
      return true;
    }),


  // *** gender-related validation
  // according to the db, they can NOT be null (optional)

  body('required_gender')
    .exists({checkNull: true, checkFalsy: true})
    .isIn(requiredGenderOptions)
    .withMessage(`Required gender must be one of: ${requiredGenderOptions.join(', ')}`),


  // *** additional_details: optional, max length ***
  body('additional_details')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Additional details must be less than 1000 characters'),

  

  // ******** Middleware to check validation results
  (req, res, next) => {
    console.log('kemelna validation');
    const errors = validationResult(req); // this function is provided by express-validator
    if(!errors.isEmpty()) {
      console.log('kemelna validation');
      return res.status(400).json({
        message: 'validation failed',
        errors: errors.array()
      });
    }
    next(); // pass control to the next middleware in the stack
  }

];

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
  validateEditProfile,
  validateJobInput
};
