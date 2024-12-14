import nodemailer from 'nodemailer';

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

/**
 * Send contact form message
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const sendContactMessage = async (req, res) => {
  try {
    const { name, surname, email, message } = req.body;

    // Validate input
    if (!name || !surname || !email || !message) {
      return res.status(400).json({ 
        error: 'All fields are required', 
        missingFields: {
          name: !name,
          surname: !surname,
          email: !email,
          message: !message
        }
      });
    }

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: `New Contact Form Message from ${name} ${surname}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name} ${surname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Optional: Send confirmation email to sender
    const confirmationMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Message Has Been Received',
      html: `
        <h3>Thank You for Contacting Us</h3>
        <p>Dear ${name} ${surname},</p>
        <p>We have received your message and will get back to you soon.</p>
        <p>Best regards,<br>Your Company Name</p>
      `
    };

    await transporter.sendMail(confirmationMailOptions);

    res.status(200).json({ 
      message: 'Email sent successfully', 
      details: { name, surname, email }
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      error: 'Failed to send email', 
      details: error.message 
    });
  }
};

/**
 * Validate contact form input
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const validateContactInput = (req, res, next) => {
  const { name, surname, email, message } = req.body;

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const errors = {};

  if (!name || name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  }

  if (!surname || surname.trim().length < 2) {
    errors.surname = 'Surname must be at least 2 characters long';
  }

  if (!email || !emailRegex.test(email)) {
    errors.email = 'Please provide a valid email address';
  }

  if (!message || message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters long';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      validationErrors: errors 
    });
  }

  next();
};