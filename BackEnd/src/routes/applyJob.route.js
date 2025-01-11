import express from 'express';
import ApplyJobController from '../controllers/applyJob.controller.js';
import authenticateToken from '../middleware/authenticateToken.js'; // Middleware to validate token

const router = express.Router();

// Route for applying to a job
router.post('/:jobId', authenticateToken, ApplyJobController.applyJob);

export default router;
