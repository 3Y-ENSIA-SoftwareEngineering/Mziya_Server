import express from 'express';
import {
  getUserProfile,
  getJobDeals,
  getJobOffers,
  uploadProfilePic,
  updateUserProfile,
  changePassword,
} from '../controllers/profile.controller.js';
import extractUserId from '../middleware/extractUserId.js'; // Import the existing middleware

const router = express.Router();

// Apply the authentication middleware to all profile routes that require user authentication
router.use(extractUserId);

// Get user profile details (GET /profile/user)
router.get('/user', getUserProfile);

// Get job deals (GET /profile/jobDeals)
router.get('/jobDeals', getJobDeals);

// Get job offers (GET /profile/jobOffers)
router.get('/jobOffers', getJobOffers);

// Upload profile picture (POST /profile/upload-profile-pic)
router.post('/upload-profile-pic', uploadProfilePic);

// Update user profile (PUT /profile/update)
router.put('/update', updateUserProfile);

// Change user password (PUT /profile/change-password)
router.put('/change-password', changePassword);

export default router;
