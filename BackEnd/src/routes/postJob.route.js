import express from 'express';
import JobController from '../controllers/postJob.controller.js';
import { validateJobInput } from '../middleware/validateInput.js';
import extractUserId from '../middleware/extractUserId.js';

const router = express.Router();

// Route to create a new job
    router.post(
    '/addjob', 
    validateJobInput, 
    extractUserId,
    (req, res, next) => {
        console.log(`[${new Date().toISOString()}] Received POST request to /addjob with body:`, req.body);
        next();
    }, 
    JobController.addJob
    );

export default router;
