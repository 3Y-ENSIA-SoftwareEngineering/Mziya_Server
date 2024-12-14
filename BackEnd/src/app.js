// app.js
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3001' })); 
app.use(express.json());

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong',
    error: process.env.NODE_ENV === 'production' ? {} : err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;