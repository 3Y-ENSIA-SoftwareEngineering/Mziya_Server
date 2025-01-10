// src/controllers/profileController.js
import supabase from '../config/database.js';
import bcrypt from 'bcryptjs';
// or
import * as fs from 'fs';
// //new 
export const getUserProfile = async (req, res) => {
  try {
   
    // Log the incoming request
    // console.log('Getting user profile. Auth header:', req.headers.authorization);
    // console.log('Auth header:', req.headers.authorization);
   
    // Get user from auth middleware
    const user = req.user;
    if (!user) {
      console.log('No user found in request');
      return res.status(401).json({ message: 'User not authenticated' });
    }
    console.log('User ID from request:', user.user_id); // Log user ID
    const { data, error } = await supabase
      .from('users')
      .select('first_name, last_name, email,phone, profile_picture')
      .eq('user_id', user.user_id)
      .single();

      // Convert profile_picture to Base64 if it exists
    //  console.log("picture before ",data.profile_picture);
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!data) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Now it's safe to access profile_picture
    let profilePictureBase64 = null;
    if (data.profile_picture) {
      if (Buffer.isBuffer(data.profile_picture)) {
        profilePictureBase64 = `data:image/jpeg;base64,${data.profile_picture.toString('base64')}`;
        console.log('buffer picture');
      } else if (typeof data.profile_picture === 'string') {
        profilePictureBase64 = data.profile_picture;
        console.log('string picture');
      }
    }
    const responseData = {
      firstName: data.first_name, 
      lastName: data.last_name, 
      email: data.email,
      location: data.address || '',
      phone: data.phone || '',
      profile_picture : profilePictureBase64 ,
    };
    
    // console.log('Sending response:', responseData);
    res.json(responseData);
    
  } catch (error) {
    console.error('Profile controller error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getJobDeals = async (req, res) => {
  const user = req.user;
  // Log user data to check if it's correctly received from authMiddleware
  console.log('User in getJobDeals:', user);
  console.log('User identific ID:', user.user_id);
  if (!user || !user.user_id) {
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

    const userId = userData.id; // Get the user id from the fetched data
    console.log('User = ID:', userId);
    const { data, error } = await supabase
      .from('job_contract')
      .select(`*, job:job_id(description, job_category,status)`)
      .or(`user_worker_id.eq.${userId},user_home_owner_id.eq.${userId}`);
    

      if (error) {
        console.error('Supabase error in jobDeals:', error); // Log the error
        throw error;
      }
      console.log('Job deals fetched:', data); // Log fetched data
    res.json(data);
  } catch (error) {
    console.error('Error in getJobDeals:', error.message); // Log the error message
    res.status(400).json({ message: error.message });
  }
};
export const getJobOffers = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized, no user data found' });
  }

  try {
    // Step 1: Fetch job offers for the logged-in user
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

    if (!jobOffers || jobOffers.length === 0) {
      console.log('No job offers found for user:', user.user_id);
      return res.json([]);
    }

    // Step 2: Fetch applications for each job offer
    const jobOffersWithApplications = await Promise.all(
      jobOffers.map(async (offer) => {
        const { data: jobApplications, error: applicationError } = await supabase
          .from('job_applications')
          .select('worker_id')
          .eq('job_id', offer.id);

        if (applicationError) {
          console.error('Error fetching job applications for job:', offer.id, applicationError);
          throw applicationError;
        }

        // Step 3: Fetch user details for each application
        const applicationsWithUserDetails = await Promise.all(
          jobApplications.map(async (application) => {
            const { data: workerInfo, error: workerError } = await supabase
              .from('users')
              .select('first_name, last_name')
              .eq('id', application.worker_id)
              .single();

            if (workerError) {
              console.error('Error fetching worker details for worker:', application.worker_id, workerError);
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

    console.log('Formatted job offers:', JSON.stringify(jobOffersWithApplications, null, 2));
    res.json(jobOffersWithApplications);
  } catch (error) {
    console.error('Error in getJobOffers:', error);
    res.status(500).json({ message: error.message });
  }
};
export const uploadProfilePic = async (req, res) => {
  const user = req.user;
  const file = req.file; // File middleware like multer handles this

  if (!user || !user.user_id) {
    return res.status(401).json({ message: 'Unauthorized, no user data found' });
  }

  if (!file) {
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

   
      res.json({
        message: 'Profile picture updated successfully',
        imageData: `data:image/jpeg;base64,${file.buffer.toString('base64')}`, // Or use a public URL
      });
      
    

    console.log("Profile picture updated in the database");
  } catch (error) {
    console.error('Error in uploadProfilePic:', error);
    res.status(500).json({ message: error.message });
  }
};

// export const changePassword = async (req, res) => {
//   const { currentPassword, newPassword, confirmPassword } = req.body;
//   const token = req.cookies.access_token; // Retrieve token from cookies

//   if (!token) {
//     return res.status(401).json({ message: 'Unauthorized, token missing' });
//   }

//   if (newPassword !== confirmPassword) {
//     return res.status(400).json({ error: "Passwords don't match" });
//   }

//   try {
//     // Set the session using the token from cookies
//     const { error: sessionError } = await supabase.auth.setSession({
//       access_token: token,
//       refresh_token: req.cookies.refresh_token, // Also retrieve refresh token if available
//     });

//     if (sessionError) {
//       console.error('Error setting session:', sessionError.message);
//       return res.status(400).json({ message: 'Error setting session' });
//     }

//     // Update the user's password
//     const { data, error } = await supabase.auth.updateUser({
//       password: newPassword,
//     });

//     if (error) {
//       console.error('Error updating password:', error.message);
//       return res.status(400).json({ message: 'Error updating password' });
//     }

//     res.json({ message: 'Password updated successfully' });
//   } catch (error) {
//     console.error('Error in changePassword:', error.message);
//     res.status(500).json({ message: error.message });
//   }
// };

export const updateUserProfile = async (req, res) => {
  const { email, phoneNumber } = req.body;
  
  try {
    // Access user from auth middleware
    const user = req.user;

    if (!user || !user.user_id) {
      return res.status(401).json({ message: 'Unauthorized, no user data found' });
    }

    // Fetch user's database ID using the user_id from the token
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

    // Update user profile
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
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  try {
    // Access user from auth middleware
    const user = req.user;

    if (!user || !user.user_id) {
      return res.status(401).json({ message: 'Unauthorized, no user data found' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    // Fetch user's database ID using the user_id from the token
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, password') // Ensure the `password` field exists in your database schema
      .eq('user_id', user.user_id)
      .single();

    if (userError || !userData) {
      console.error('Error fetching user ID:', userError);
      return res.status(400).json({ message: 'Error fetching user data' });
    }

    // Verify current password using bcrypt
    const isMatch = await bcrypt.compare(currentPassword, userData.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash the new password if needed
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    // Update password in the database
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
