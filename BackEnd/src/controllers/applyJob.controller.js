import ApplyJobService from '../services/applyJobService.js';
import logger from '../utils/logger.js';

class ApplyJobController {
  static async applyJob(req, res) {
    try {
      const { jobId } = req.body;
      const workerId = req.userId; // Extracted by middleware

      // Validate inputs
      if (!jobId || !workerId) {
        logger.error('Validation failed: Missing jobId or workerId');
        return res.status(400).json({
          message: 'Validation failed: jobId and workerId are required',
        });
      }

      // Prepare application data
      const applicationData = {
        job_id: jobId,
        worker_id: workerId,
        status: 'pending',
        application_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Call the service to insert data
      const newApplication = await ApplyJobService.create(applicationData);

      logger.info(
        `Job application created successfully for jobId: ${jobId}, workerId: ${workerId}`
      );

      return res.status(201).json({
        message: 'New job application created successfully',
        application: newApplication,
      });
    } catch (error) {
      logger.error(`Error applying for job: ${error.message}`);
      return res.status(500).json({
        message: 'Internal server error',
        error:
          process.env.NODE_ENV !== 'production'
            ? error.message
            : 'An unexpected error occurred',
      });
    }
  }
}

export default ApplyJobController;
