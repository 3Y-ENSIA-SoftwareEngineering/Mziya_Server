import express from 'express';
import { 
  sendContactMessage, 
  validateContactInput 
} from '../controllers/contact.controller.js';

const router = express.Router();

/**
 * @route   POST /api/contact
 * @desc    Send a contact form message
 * @access  Public
 */
router.post(
  '/', 
  validateContactInput,  // Middleware to validate input first
  sendContactMessage     // Controller to send the message
);

export default router;