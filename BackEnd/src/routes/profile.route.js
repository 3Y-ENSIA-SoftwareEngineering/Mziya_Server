// src/routes/profileRoutes.js
import express from 'express';
import multer from 'multer';
import * as profileController from '../controllers/profile.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Profile routes with authentication middleware
router.get('/user',  authMiddleware, profileController.getUserProfile);
router.get('/jobDeals',authMiddleware, profileController.getJobDeals);
 router.get('/jobOffers',authMiddleware,  profileController.getJobOffers);
router.put('/changePassword',authMiddleware, profileController.changePassword);
router.put('/update', authMiddleware, profileController.updateUserProfile);
router.post('/uploadProfilePic', authMiddleware, upload.single('profilePicture'), profileController.uploadProfilePic);

// //router.post('/uploadProfilePic', authMiddleware, upload.single('file'), profileController.uploadProfilePic);

export default router;