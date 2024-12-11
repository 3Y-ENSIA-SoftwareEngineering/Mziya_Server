import express from 'express';
import JobController from '../controllers/jobController.js';
import validateJobInput from '../middleware/validatJobInput.js';

const router = express.Router();

// Route to create a new job
    router.post(
    '/addjob', 
    validateJobInput, 
    (req, res, next) => {
        console.log(`[${new Date().toISOString()}] Received POST request to /addjob with body:`, req.body);
        next();
    }, 
    JobController.addJob
    );

export default router;
