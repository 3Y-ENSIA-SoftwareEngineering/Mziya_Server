const supabase = require('../config/database');

class Job {
  // Create a new job
  static async create(jobData) {
    const {
      home_owner_id,
      description,
      location,
      job_type,
      job_category,
      budget,
      status = "pending", // Default to "pending"
      availability_type,
      start_date,
      end_date,
      age_matters,
      age_min,
      age_max,
      gender_matters,
      required_gender,
      additional_details,
      created_at = new Date(), // Set default creation date
      updated_at = new Date(), // Set default updated date
    } = jobData;

    // Ensure that start_date and end_date are valid if availability_type is 'closed'
    if (availability_type === 'closed' && (!start_date || !end_date)) {
      throw new Error('Start date and end date are required for closed availability type');
    }

    // Ensure that start_date and end_date are null if availability_type is 'open'
    if (availability_type === 'open' && (start_date || end_date)) {
      throw new Error('Start date and end date should be null for open availability type');
    }

    const { data, error } = await supabase
      .from('jobs')
      .insert([{
        home_owner_id,
        description,
        location,
        job_type,
        job_category,
        budget,
        status, // Default status if not provided
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
        updated_at,
      }])
      .select();

    if (error) {
      console.error("Error creating job:", error);
      throw error;
    }

    return data[0];
  }

  // Find a job by ID
  static async findById(id) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error finding job:", error);
      return null;
    }

    return data;
  }

  // Update a job by ID
  static async update(id, updatedFields) {
    const { data, error } = await supabase
      .from('jobs')
      .update({
        ...updatedFields,
        updated_at: new Date(), // Update the timestamp
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error("Error updating job:", error);
      throw error;
    }

    return data[0];
  }

  // Delete a job by ID
  static async delete(id) {
    const { data, error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting job:", error);
      throw error;
    }

    return data;
  }
}

module.exports = Job;
