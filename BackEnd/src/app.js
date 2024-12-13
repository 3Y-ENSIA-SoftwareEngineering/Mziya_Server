import express from 'express';
import cors from 'cors';
//import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3001' })); // !! the port should be changed to the frontend port
app.use(express.json());

// Routes
//app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong', 
    error: process.env.NODE_ENV === 'production' ? {} : err.message 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;