import JobService from '../services/jobService.js'; // Service layer for Job operations
import supabase from '../config/database.js'; // Database connection (assuming db is defined)

class JobController {
  // Add Job Controller
  static async addJob(req, res) {
    try {
      console.log('--- JobController: Received Job Creation Request ---');
      console.log('Request Headers:', JSON.stringify(req.headers, null, 2));
      console.log('Request Body:', JSON.stringify(req.body, null, 2));

      // Extract data from request
      const {
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
        required_gender,
        additional_details,
        created_at,
        updated_at
      } = req.body;

      // get home_owner_id from the middleware
      const home_owner_id = req.userId;

      console.log('--- Extracted Input Data ---');
      console.log({
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
        required_gender,
        additional_details,
      });

      // Comprehensive input validation
      const validationErrors = [];

      if (!description) validationErrors.push('description is required');
      if (!location) validationErrors.push('location is required');
      if (!job_type) validationErrors.push('job_type is required');
      if (!job_category || job_category.length === 0) validationErrors.push('job_category is required');
      if (budget === undefined || budget === null) validationErrors.push('budget is required');
      if (!status) validationErrors.push('status is required');
      if (!availability_type) validationErrors.push('availability_type is required');

      console.log('--- Validating home_owner_id ---');
      if (home_owner_id) {
        if (typeof home_owner_id !== 'string') {
          validationErrors.push('home_owner_id must be a string');
        } else {
          console.log('Checking if home_owner_id exists in the database...');

          // Supabase query to check existence
          const { data, error } = await supabase
            .from('users')
            .select('user_id')
            .eq('user_id', home_owner_id)
            .single();

          if (error) {
            console.log('Error while checking home_owner_id in the database:', error.message);
            validationErrors.push('Error verifying homeowner ID');
          } else if (!data) {
            console.log('home_owner_id does not exist in the database');
            validationErrors.push('Homeowner ID does not exist in the database');
          } else {
            console.log('home_owner_id exists in the database');
          }
        }
      }

      console.log('--- Validating other fields ---');
      if (age_matters !== undefined && typeof age_matters !== 'boolean') {
        validationErrors.push('age_matters must be a boolean');
      }

      if (validationErrors.length > 0) {
        console.log('Validation Errors:', validationErrors);
        return res.status(400).json({
          message: 'Validation Failed',
          errors: validationErrors
        });
      }
      // Prepare data for insertion
      console.log('--- Preparing job data for insertion ---');
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
        required_gender,
        additional_details,
        created_at: created_at || new Date().toISOString(),
        updated_at: updated_at || new Date().toISOString()
      };

      console.log('Job Data to Insert:', JSON.stringify(jobData, null, 2));

      // Call the JobService to create a new job
      console.log('--- Calling JobService to create a new job ---');
      const newJob = await JobService.create(jobData, home_owner_id);

      console.log('--- New Job Created Successfully ---');
      console.log('Created Job:', JSON.stringify(newJob, null, 2));

      return res.status(201).json({
        message: 'New job created successfully',
        job: newJob,
      });
    } catch (error) {
      console.error('--- Complete Job Creation Error ---');
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
      console.error('Full Error Object:', JSON.stringify(error, null, 2));

      return res.status(500).json({ 
        message: 'Internal server error', 
        error: process.env.NODE_ENV !== 'production' ? error.message : 'An unexpected error occurred'
      });
    }
  }
}

export default JobController;
