import supabase from '../config/database.js';

class Job {
  // Create a new job
  static async create(jobData) {
    try {



      // Log the exact data being inserted
      console.log('Job Data for Insertion:', JSON.stringify(jobData, null, 2));
  
      const { data, error } = await supabase
        .from('job')
        .insert([{
          ...jobData,
          // Ensure all fields match your Supabase table schema exactly
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select();
  
      if (error) {
        console.error("Detailed Supabase Insertion Error:", {
          message: error.message,
          details: error.details,
          code: error.code,
          hint: error.hint,
          fullError: JSON.stringify(error, null, 2)
        });
        throw error;
      }
  
      if (!data || data.length === 0) {
        console.error("No data returned from job insertion");
        throw new Error("Job insertion failed - no data returned");
      }
      console.log('wzup');
      return data[0];
    } catch (error) {
      console.error("Complete Job Creation Error:", {
        message: error.message,
        stack: error.stack,
        fullError: JSON.stringify(error, null, 2)
      });
      throw error;
    }
  }
}

export default Job;
