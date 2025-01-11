import supabase from '../config/database.js';
import bcrypt from 'bcryptjs';
import * as fs from 'fs';

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId; // Use req.userId from middleware
    if (!userId) {
      console.log('No user ID found in request');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { data, error } = await supabase
      .from('users')
      .select('first_name, last_name, email, phone, profile_picture')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!data) {
      return res.status(404).json({ message: 'User not found' });
    }

    let profilePictureBase64 = null;
    if (data.profile_picture) {
      if (Buffer.isBuffer(data.profile_picture)) {
        profilePictureBase64 = `data:image/jpeg;base64,${data.profile_picture.toString('base64')}`;
      } else if (typeof data.profile_picture === 'string') {
        profilePictureBase64 = data.profile_picture;
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

    res.json(responseData);
  } catch (error) {
    console.error('Profile controller error:', error);
    res.status(500).json({ message: error.message });
  }
};





export const uploadProfilePic = async (req, res) => {
  const userId = req.userId; // Use req.userId from middleware
  const file = req.file;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized, no user data found' });
  }

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (userError || !userData) {
      console.error('Error fetching user ID:', userError);
      return res.status(400).json({ message: 'Error fetching user data' });
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({
        profile_picture: file.buffer, // Directly using the file's buffer
      })
      .eq('id', userData.id);

    if (updateError) {
      console.error('Error updating profile picture:', updateError);
      return res.status(400).json({ message: 'Error updating profile picture' });
    }

    res.json({
      message: 'Profile picture updated successfully',
      imageData: `data:image/jpeg;base64,${file.buffer.toString('base64')}`,
    });
  } catch (error) {
    console.error('Error in uploadProfilePic:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  const { email, phoneNumber } = req.body;
  const userId = req.userId; // Use req.userId from middleware

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized, no user data found' });
  }

  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (userError || !userData) {
      console.error('Error fetching user ID:', userError);
      return res.status(400).json({ message: 'Error fetching user data' });
    }

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

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error in updateUserProfile:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getJobDeals = async (req, res) => {
  const userId = req.userId; // Use req.userId from middleware

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized, no user data found' });
  }

  try {
    console.log('Fetching user ID for:', userId);

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, user_id')
      .eq('user_id', userId)
      .single();

    console.log('User data fetched:', userData);
    if (userError || !userData) {
      console.error('Error fetching user ID:', userError);
      return res.status(400).json({ message: 'Error fetching user ID' });
    }

    const userUuid = userData.user_id;

    console.log('Fetching job deals for worker ID:', userUuid);
    const { data: jobDeals, error: jobDealsError } = await supabase
      .from('job_applications')
      .select(`*, job:job_id(description, job_category, status)`)
      .eq('worker_id', userUuid);

    //console.log('Job deals fetched:', jobDeals);
    if (jobDealsError) {
      console.error('Supabase error in jobDeals:', jobDealsError);
      throw jobDealsError;
    }

    res.json(jobDeals);
  } catch (error) {
    console.error('Error in getJobDeals:', error.message);
    res.status(400).json({ message: error.message });
  }
};

export const getJobOffers = async (req, res) => {
  const userId = req.userId; // Use req.userId from middleware

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized, no user data found' });
  }

  try {
    console.log('Fetching user ID for:', userId);

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, user_id')
      .eq('user_id', userId)
      .single();

    console.log('User data fetched:', userData);
    if (userError || !userData) {
      console.error('Error fetching user ID:', userError);
      return res.status(400).json({ message: 'Error fetching user ID' });
    }

    const userUuid = userData.user_id;

    console.log('Fetching job offers for home owner ID:', userUuid);
    const { data: jobOffers, error: jobOffersError } = await supabase
      .from('job')
      .select('id, description, job_category, status, home_owner_id')
      .eq('home_owner_id', userUuid);

    //console.log('Job offers fetched:', jobOffers);
    if (jobOffersError) {
      console.error('Error fetching job offers:', jobOffersError);
      return res.status(400).json({ message: 'Error fetching job offers' });
    }

    if (!jobOffers || jobOffers.length === 0) {
      console.log('No job offers found');
      return res.json([]);
    }

    console.log('Fetching applications for each job offer...');
    const jobOffersWithApplications = await Promise.all(
      jobOffers.map(async (offer) => {
        console.log('Fetching applications for job ID:', offer.id);

        const { data: jobApplications, error: applicationError } = await supabase
          .from('job_applications')
          .select('worker_id')
          .eq('job_id', offer.id);

        console.log('Applications for job ID:', offer.id, jobApplications);
        if (applicationError) {
          console.error('Error fetching job applications for job:', offer.id);
          throw applicationError;
        }

        const applicationsWithUserDetails = await Promise.all(
          jobApplications.map(async (application) => {
            console.log('Fetching worker details for worker ID:', application.worker_id);

            const { data: workerInfo, error: workerError } = await supabase
              .from('users')
              .select('first_name, last_name, phone')
              .eq('user_id', application.worker_id)
              .single();

            console.log('Worker details fetched:', workerInfo);
            if (workerError) {
              console.error('Error fetching worker details for worker:', application.worker_id);
              throw workerError;
            }

            return {
              workerId: application.worker_id,
              workerFirstName: workerInfo.first_name,
              workerLastName: workerInfo.last_name,
              workerPhone: workerInfo.phone,
            };
          })
        );

        return {
          ...offer,
          jobApplications: applicationsWithUserDetails,
        };
      })
    );

    console.log('Job offers with applications:', jobOffersWithApplications);
    res.json(jobOffersWithApplications);
  } catch (error) {
    console.error('Error in getJobOffers:', error);
    res.status(500).json({ message: error.message });
  }
};


export const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.userId; // Use req.userId from middleware

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized, no user data found' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: "Passwords don't match" });
  }

  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, password')
      .eq('user_id', userId)
      .single();

    if (userError || !userData) {
      console.error('Error fetching user ID:', userError);
      return res.status(400).json({ message: 'Error fetching user data' });
    }

    const isMatch = await bcrypt.compare(currentPassword, userData.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const { error: updateError } = await supabase
      .from('users')
      .update({ password: hashedNewPassword })
      .eq('id', userData.id);

    if (updateError) {
      console.error('Error updating password:', updateError);
      return res.status(400).json({ message: 'Error updating password' });
    }

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error in changePassword:', error.message);
    res.status(500).json({ message: error.message });
  }
};