// src/routes/profileRoutes.js
import express from 'express';
import multer from 'multer';
import * as profileController from '../controllers/profile.controller.js';
//import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Profile routes with authentication middleware
router.get('/user',  profileController.getUserProfile);
router.get('/jobDeals', profileController.getJobDeals);
router.get('/jobOffers',  profileController.getJobOffers);
router.post('/changePassword',profileController.changePassword);
//router.post('/uploadProfilePic', authMiddleware, upload.single('file'), profileController.uploadProfilePic);

export default router;