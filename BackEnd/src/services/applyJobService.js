import supabase from '../config/database.js'; 
import logger from '../utils/logger.js';

class ApplyJobService {
  static async create(applicationData) {
    logger.debug('Attempting to insert job application...');
    logger.debug(`Received application data: ${JSON.stringify(applicationData)}`);

    try {
      // Log before attempting the database insert
      logger.debug('Preparing to insert data into job_applications table...');
      
      // Insert job application into the database
      const { data, error } = await supabase
        .from('job_applications')  // Table name
        .insert([
          {
            job_id: applicationData.job_id,
            worker_id: applicationData.worker_id,
            status: applicationData.status,
            application_date: applicationData.application_date,
            created_at: applicationData.created_at,
            updated_at: applicationData.updated_at,
          },
        ])
        .single(); // Ensure only one row is returned

      // Log response data
      logger.debug(`Supabase response: ${JSON.stringify(data)}`);

      if (error) {
        logger.error(`Supabase error: ${error.message}`); // Log error if insertion fails
        throw new Error(error.message);
      }

      // Log success
      logger.info('Job application inserted into the database successfully');
      return data;  // Return the inserted row
    } catch (error) {
      // Log detailed error for debugging
      logger.error(`Error during job application insertion: ${error.message}`);
      throw new Error('Failed to insert job application');
    }
  }
}

export default ApplyJobService;
