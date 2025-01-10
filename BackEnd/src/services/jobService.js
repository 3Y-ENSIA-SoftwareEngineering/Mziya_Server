import Job from '../models/postJob.model.js'; // Job model
import supabase from '../config/database.js';

class JobService {
  // Create a new job in the database
  static async create(jobData,home_owner_id) {
    try {
      const { data: user, error: userError } = await supabase
      .from('users')
      .select('user_id')
      .eq('user_id', home_owner_id)
      .single();
    console.log("123 viva l algerie")
    if (userError || !user) {
      throw new Error('User account does not exist. Please create an account first.');
    }
      return await Job.create(jobData);
    } catch (error) {
      console.error('Error in JobService:', error.message);
      throw new Error('User account does not exist. Please create an account first');
    }
  }
}

export default JobService;
