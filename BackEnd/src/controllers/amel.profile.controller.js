// src/controllers/profileController.js
import supabase from '../config/database.js';
import bcrypt from 'bcryptjs';
import * as fs from 'fs';

export const getUserProfile = async (req, res) => {
  try {
    // Log the incoming request and authentication details
    console.log('Incoming request for user profile');
    console.log('Authorization header:', req.headers.authorization);
   
    // Get user from auth middleware
    const user = req.user;
    if (!user) {
      console.log('No user found in request');
      return res.status(401).json({ message: 'User not authenticated' });
    }
    console.log('User ID from request:', user.user_id); // Log user ID
    
    const { data, error } = await supabase
      .from('users')
      .select('first_name, last_name, email, phone, profile_picture')
      .eq('user_id', user.user_id)
      .single();

    if (error) {
      console.error('Supabase error while fetching user data:', error);
      throw error;
    }

    if (!data) {
      console.log('User not found in database');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User data fetched successfully:', data);

    // Convert profile_picture to Base64 if it exists
    let profilePictureBase64 = null;
    if (data.profile_picture) {
      console.log('Profile picture found, converting to base64...');
      if (Buffer.isBuffer(data.profile_picture)) {
        profilePictureBase64 = `data:image/jpeg;base64,${data.profile_picture.toString('base64')}`;
        console.log('Profile picture converted to base64 (buffer)');
      } else if (typeof data.profile_picture === 'string') {
        profilePictureBase64 = data.profile_picture;
        console.log('Profile picture found as string');
      }
    }

    const responseData = {
      firstName: data.first_name, 
      lastName: data.last_name, 
      email: data.email,
      location: data.address || '',
      phone: data.phone || '',
      profile_picture: profilePictureBase64,
    };

    console.log('Sending user profile data:', responseData);
    res.json(responseData);
  } catch (error) {
    console.error('Profile controller error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getJobDeals = async (req, res) => {
  const user = req.user;
  console.log('Incoming request for job deals');
  console.log('User in getJobDeals:', user);
  console.log('User identific ID:', user.user_id);

  if (!user || !user.user_id) {
    console.log('Unauthorized, user data not found');
    return res.status(401).json({ message: 'Unauthorized, no user data found' });
  }

  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('user_id', user.user_id)
      .single();

    if (userError || !userData) {
      console.error('Error fetching user ID:', userError); 
      return res.status(400).json({ message: 'Error fetching user ID' });
    }

    console.log('User ID found:', userData.id);

    const { data, error } = await supabase
      .from('job_contract')
      .select(`*, job:job_id(description, job_category,status)`)
      .or(`user_worker_id.eq.${userData.id},user_home_owner_id.eq.${userData.id}`);

    if (error) {
      console.error('Supabase error in fetching job deals:', error);
      throw error;
    }
    console.log('Fetched job deals:', data);
    res.json(data);
  } catch (error) {
    console.error('Error in getJobDeals:', error.message);
    res.status(400).json({ message: error.message });
  }
};

export const getJobOffers = async (req, res) => {
  const user = req.user;

  console.log('Incoming request for job offers');
  console.log('User in getJobOffers:', user);

  if (!user) {
    console.log('Unauthorized, user data not found');
    return res.status(401).json({ message: 'Unauthorized, no user data found' });
  }

  try {
    const { data: jobOffers, error: jobOffersError } = await supabase
      .from('job')
      .select(`
        id, 
        description, 
        job_category, 
        status
      `)
      .eq('home_owner_id', user.user_id);

    if (jobOffersError) {
      console.error('Error fetching job offers:', jobOffersError);
      return res.status(400).json({ message: 'Error fetching job offers' });
    }

    console.log('Fetched job offers:', jobOffers);

    if (!jobOffers || jobOffers.length === 0) {
      console.log('No job offers found for user:', user.user_id);
      return res.json([]);
    }

    // Fetch applications for each job offer
    const jobOffersWithApplications = await Promise.all(
      jobOffers.map(async (offer) => {
        console.log(`Fetching applications for job offer: ${offer.id}`);

        const { data: jobApplications, error: applicationError } = await supabase
          .from('job_applications')
          .select('worker_id')
          .eq('job_id', offer.id);

        if (applicationError) {
          console.error('Error fetching job applications for job:', offer.id, applicationError);
          throw applicationError;
        }

        // Fetch user details for each application
        const applicationsWithUserDetails = await Promise.all(
          jobApplications.map(async (application) => {
            console.log(`Fetching worker details for worker: ${application.worker_id}`);
            const { data: workerInfo, error: workerError } = await supabase
              .from('users')
              .select('first_name, last_name')
              .eq('id', application.worker_id)
              .single();

            if (workerError) {
              console.error('Error fetching worker details:', workerError);
              throw workerError;
            }

            return {
              workerId: application.worker_id,
              workerFirstName: workerInfo.first_name,
              workerLastName: workerInfo.last_name,
            };
          })
        );

        return {
          ...offer,
          jobApplications: applicationsWithUserDetails,
        };
      })
    );

    console.log('Formatted job offers with applications:', jobOffersWithApplications);
    res.json(jobOffersWithApplications);
  } catch (error) {
    console.error('Error in getJobOffers:', error);
    res.status(500).json({ message: error.message });
  }
};

export const uploadProfilePic = async (req, res) => {
  const user = req.user;
  const file = req.file; // File middleware like multer handles this

  console.log('Incoming request to upload profile picture');
  if (!user || !user.user_id) {
    console.log('Unauthorized, no user data found');
    return res.status(401).json({ message: 'Unauthorized, no user data found' });
  }

  if (!file) {
    console.log('No file uploaded');
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Retrieve the user's database ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('user_id', user.user_id)
      .single();

    if (userError || !userData) {
      console.error('Error fetching user ID:', userError);
      return res.status(400).json({ message: 'Error fetching user data' });
    }

    // Save the image buffer directly to the BYTEA column (no Base64 encoding)
    const { error: updateError } = await supabase
      .from('users')
      .update({
        profile_picture: file.buffer // directly using the file's buffer
      })
      .eq('id', userData.id);

    if (updateError) {
      console.error('Error updating profile picture:', updateError);
      return res.status(400).json({ message: 'Error updating profile picture' });
    }

    console.log("Profile picture updated successfully in the database");

    res.json({
      message: 'Profile picture updated successfully',
      imageData: `data:image/jpeg;base64,${file.buffer.toString('base64')}`, // Or use a public URL
    });

  } catch (error) {
    console.error('Error in uploadProfilePic:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  const { email, phoneNumber } = req.body;
  
  console.log('Incoming request to update user profile');
  
  try {
    const user = req.user;

    if (!user || !user.user_id) {
      console.log('Unauthorized, no user data found');
      return res.status(401).json({ message: 'Unauthorized, no user data found' });
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('user_id', user.user_id)
      .single();

    if (userError || !userData) {
      console.error('Error fetching user ID:', userError);
      return res.status(400).json({ message: 'Error fetching user data' });
    }

    // Prepare updates object
    const updates = {};
    if (email) updates.email = email;
    if (phoneNumber) updates.phone = phoneNumber;

    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userData.id);

    if (error) {
      console.error('Error updating user profile:', error);
      return res.status(400).json({ message: 'Error updating profile' });
    }

    console.log('User profile updated successfully');
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error in updateUserProfile:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  console.log('Incoming request to change password');

  try {
    const user = req.user;

    if (!user || !user.user_id) {
      console.log('Unauthorized, no user data found');
      return res.status(401).json({ message: 'Unauthorized, no user data found' });
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      console.log('Required fields are missing');
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
      console.log('Passwords do not match');
      return res.status(400).json({ message: 'New password and confirm password do not match' });
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('password')
      .eq('user_id', user.user_id)
      .single();

    if (userError || !userData) {
      console.error('Error fetching user data:', userError);
      return res.status(400).json({ message: 'Error fetching user data' });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, userData.password);
    if (!isPasswordValid) {
      console.log('Current password is incorrect');
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const { error: updateError } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('user_id', user.user_id);

    if (updateError) {
      console.error('Error updating password:', updateError);
      return res.status(400).json({ message: 'Error updating password' });
    }

    console.log('Password changed successfully');
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error in changePassword:', error.message);
    res.status(500).json({ message: error.message });
  }
};
