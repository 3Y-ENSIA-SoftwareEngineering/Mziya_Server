import JobService from '../services/jobService.js'; // Service layer for Job operations

class JobController {
  // Add Job Controller
  static async addJob(req, res) {
    try {
      console.log('Received Job Creation Request:', JSON.stringify(req.body, null, 2));

      // Validate input types and formats
      const {
        home_owner_id,
        description,
        location,
        job_type,
        job_category,
        budget,
        status,
        availability_type,
        start_date,
        end_date,
        age_matters,
        age_min,
        age_max,
        gender_matters,
        required_gender,
        additional_details,
        created_at,
        updated_at
      } = req.body;

      // Comprehensive input validation
      const validationErrors = [];

      if (!home_owner_id) validationErrors.push('home_owner_id is required');
      if (!description) validationErrors.push('description is required');
      if (!location) validationErrors.push('location is required');
      if (!job_type) validationErrors.push('job_type is required');
      if (!job_category) validationErrors.push('job_category is required');
      if (budget === undefined || budget === null) validationErrors.push('budget is required');
      if (!status) validationErrors.push('status is required');
      if (!availability_type) validationErrors.push('availability_type is required');

      // Add more specific validations as needed
      if (age_matters !== undefined && typeof age_matters !== 'boolean') {
        validationErrors.push('age_matters must be a boolean');
      }

      if (validationErrors.length > 0) {
        return res.status(400).json({
          message: 'Validation Failed',
          errors: validationErrors
        });
      }

      // Prepare data for insertion
      const jobData = {
        home_owner_id,
        description,
        location,
        job_type,
        job_category,
        budget,
        status,
        availability_type,
        start_date,
        end_date,
        age_matters,
        age_min,
        age_max,
        gender_matters,
        required_gender,
        additional_details,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Call the JobService to create a new job
      const newJob = await JobService.create(jobData);

      return res.status(201).json({
        message: 'New job created successfully',
        job: newJob,
      });
    } catch (error) {
      console.error('Complete Job Creation Error:', {
        message: error.message,
        stack: error.stack,
        fullError: JSON.stringify(error, null, 2)
      });

      res.status(500).json({ 
        message: 'Internal server error', 
        error: process.env.NODE_ENV !== 'production' ? error.message : 'An unexpected error occurred'
      });
    }
  }
}

export default JobController;
