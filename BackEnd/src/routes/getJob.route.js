// routes/jobRoutes.js
import express from 'express';
import { 
  getAllJobs, 
  getJobsByCategory, 
  getJobsByPrice 
} from '../controllers/getJob.controller.js';

const router = express.Router();

// GET all jobs
router.get('/', getAllJobs);

// GET jobs by category
router.get('/category/:category', getJobsByCategory);

// GET jobs sorted by price (highest to lowest)
router.get('/best-price', getJobsByPrice);

export default router;