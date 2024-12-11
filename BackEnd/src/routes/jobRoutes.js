const express = require('express');
const JobController = require('../controllers/jobController');
const validateJobInput = require('../middleware/validatJobInput');


const router = express.Router();

// Route to create a new job
router.post('/addjob', validateJobInput, (req, res, next) => {
    console.log(`[${new Date().toISOString()}] Received POST request to /addjob with body:`, req.body);
    next();
}, JobController.addJob);


module.exports = router;
