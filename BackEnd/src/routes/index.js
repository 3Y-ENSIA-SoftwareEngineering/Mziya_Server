// src/routes/index.js
import express from 'express';
import authRoutes from './auth.route.js';
import jobRoutes from './postJob.route.js';
import profileRoutes from './profile.route.js';
import getJobRoutes from './getJob.route.js';
import contactRoutes from './contact.route.js';
import applyJobRoutes from './applyJob.route.js';



const router = express.Router();

router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes);
router.use('/profile', profileRoutes);
router.use('/contact', contactRoutes);
router.use('/getJob', getJobRoutes);
router.use('/apply', applyJobRoutes);
export default router;