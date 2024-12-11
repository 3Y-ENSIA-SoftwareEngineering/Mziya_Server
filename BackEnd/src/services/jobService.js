import Job from '../models/Job.js'; // Job model

class JobService {
  // Create a new job in the database
  static async create(jobData) {
    try {
      return await Job.create(jobData);
    } catch (error) {
      console.error('Error in JobService:', error.message);
      throw new Error('Failed to create job');
    }
  }

  // Additional methods for job-related operations can go here
}

export default JobService;
