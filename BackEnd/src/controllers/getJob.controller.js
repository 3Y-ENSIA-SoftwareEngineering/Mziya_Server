// controllers/jobController.js
import supabase from '../config/database.js';
import winston from 'winston';

// Create a logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'job-controller.log' })
  ]
});

export const getAllJobs = async (req, res) => {
  try {
    logger.info('Starting getAllJobs method');

    const { data, error } = await supabase
      .from('job')
      .select('*');

    if (error) {
      logger.error(`Error fetching all jobs: ${error.message}`);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch jobs',
        error: error.message
      });
    }

    if (data.length === 0) {
      logger.info('No jobs found');
      return res.status(200).json({
        status: 'success',
        message: 'No jobs available',
        data: []
      });
    }

    logger.info(`Successfully retrieved ${data.length} jobs`);

    res.status(200).json({
      status: 'success',
      results: data.length,
      data: data
    });
  } catch (error) {
    logger.error(`Unexpected error in getAllJobs: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const getJobsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    logger.info(`Attempting to fetch jobs for category: ${category}`);

    // Validate category input
    if (!category) {
      logger.warn('No category provided');
      return res.status(400).json({
        status: 'error',
        message: 'Category is required'
      });
    }

    const { data, error } = await supabase
      .from('job')
      .select('*')
      .eq('job_category', category);

    if (error) {
      logger.error(`Error fetching jobs by category: ${error.message}`);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch jobs by category',
        error: error.message
      });
    }

    if (data.length === 0) {
      logger.info(`No jobs found in category: ${category}`);
      return res.status(200).json({
        status: 'success',
        message: `No jobs available for category: ${category}`,
        category,
        data: []
      });
    }

    logger.info(`Found ${data.length} jobs in category: ${category}`);

    res.status(200).json({
      status: 'success',
      results: data.length,
      category,
      data: data
    });
  } catch (error) {
    logger.error(`Unexpected error in getJobsByCategory: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const getJobsByPrice = async (req, res) => {
  try {
    logger.info('Fetching jobs sorted by price (highest to lowest)');

    const { data, error } = await supabase
      .from('job')
      .select('*')
      .order('budget', { ascending: false }); // Sort from highest to lowest

    if (error) {
      logger.error(`Error fetching jobs sorted by price: ${error.message}`);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch jobs sorted by price',
        error: error.message
      });
    }

    if (data.length === 0) {
      logger.info('No jobs found sorted by price');
      return res.status(200).json({
        status: 'success',
        message: 'No jobs available sorted by price',
        data: []
      });
    }

    logger.info(`Found ${data.length} jobs sorted by price`);

    res.status(200).json({
      status: 'success',
      results: data.length,
      description: 'Jobs sorted from highest to lowest price',
      data: data
    });
  } catch (error) {
    logger.error(`Unexpected error in getJobsByPrice: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};
