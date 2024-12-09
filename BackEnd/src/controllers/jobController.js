const JobService = require('../services/jobService'); // Service layer for Job operations

class JobController {
  // Add Job Controller
  static async addJob(req, res) {
    try {
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

      // Ensure all required fields are present
      if (
        !home_owner_id ||
        !description ||
        !location ||
        !job_type ||
        !job_category ||
        !budget ||
        !status ||
        !availability_type ||
        !start_date ||
        !end_date ||
        age_matters === undefined || // Boolean check
        age_min === undefined ||    // Integer check
        age_max === undefined ||    // Integer check
        gender_matters === undefined || // Boolean check
        !required_gender || // Gender check
        !created_at ||
        !updated_at
      ) {
        return res.status(400).json({
          message: 'Please fill in all the required fields',
        });
      }

      // Call the JobService to create a new job
      const newJob = await JobService.create({
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
      });

      return res.status(201).json({
        message: 'New job created successfully',
        job: newJob,
      });
    } catch (error) {
      console.error('Failed to add job:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Additional methods for handling other job-related tasks can go here
}

module.exports = JobController;
