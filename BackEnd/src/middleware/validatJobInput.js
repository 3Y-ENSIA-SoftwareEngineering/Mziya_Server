// Middleware to validate job creation input
const { body, validationResult } = require('express-validator')

const jobTypeOptions = ['small_task', 'large_task', 'part_time', 'full_time'];
const jobCategoryOptions = ['Plumbing', 'Electrical', 'Carpentry', 'Cleaning', 'Gardening', 'Babysitting'];
const jobStatusOptions = ['pending', 'in_progress', 'completed', 'cancelled']; 
const availabilityTypeOptions = ['open', 'closed'];
const requiredGenderOptions = ['any', 'male', 'female'];

const validateJobInput = [

  // *** home_owner_id ***
  // cannot be null. in the db, i suggest set it as unique
  // has to be positive int
  // in fact, it is added automatically in an incremental way so idk if this is necessary
  body('home_owner_id')
    .exists({checkNull: true, checkFalsy: true}) // check its not null and not falsy (0, '', undefined)
    .isInt({min: 1})
    .withMessage('Home owner ID is required and must be positive integer'),


  // *** description ***
  // according to the db, it can be null
  body('description')
    .trim() // clean and format the input
    .isLength({min: 10, max: 500}) // constraint the length. discuss this with the team members
    .withMessage('Description must be between 10 and 500 characters'),


  // *** location ***
  // according to the db, it can be null
  // postgers recommends to use text instead of varchar
  body('location')
    .trim()
    .isLength({min: 2, max: 100})
    .withMessage('Location must be between 2 and 100 characters'),


  // *** job type ***
  // according to the db, it can be null
  // type enum
  body('job_type')
    .isIn(jobTypeOptions)
    .withMessage(`Job type must be one of: ${jobTypeOptions.join(', ')}`),


  // *** job category ***
  // according to the db, it can NOT be null
  body('job_category')
    .exists({checkNull: true, checkFalsy: true})
    .isIn(jobCategoryOptions)
    .withMessage(`Job category must be one of: ${jobCategoryOptions.join(', ')}`),


  // *** budget ***
  // i just got the idea of what if the home owner has no idea how a service costs
    // i mean if his budget is too hight ykelkholo and if it is too low he will get no deal
  // according to the bd, it can be null
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
    .optional({ checkFalsy: true })
    .isInt({ min: 18, max: 75 })
    .withMessage('Minimum age must be between 18 and 75'),

  body('age_max')
    .optional({ checkFalsy: true })
    .isInt({ min: 18, max: 75 })
    .withMessage('Maximum age must be between 18 and 75')
    .custom((value, { req }) => {
      if (req.body.age_min && value) { // both min and max are provided
        if (parseInt(value) <= parseInt(req.body.age_min)) { // ensure min is less then max
          throw new Error('Maximum age must be greater than minimum age');
        }
      }
      return true;
    }),


  // *** gender-related validation
  // according to the db, they can be null (optional)

  // !! it does not make sense to have a bool gender matters then having any option in gender options

  body('gender_matters')
    .isBoolean()
    .withMessage('gender_matters must be a boolean'),

  body('required_gender')
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
    const errors = validationResult(req); // this function is provided by express-validator
    if(!errors.isEmpty()) {
      return res.status(400).json({
        message: 'validation failed',
        errors: errors.array()
      });
    }
    next(); // pass control to the next middleware in the stack
  }

];

module.exports = validateJobInput;