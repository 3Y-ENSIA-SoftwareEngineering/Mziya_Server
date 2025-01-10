// app.js
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import PgSession from 'connect-pg-simple' // supabase uses postgreSQL
import routes from './routes/index.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3001' })); 
app.use(express.json());

// session middleware
app.use(
  session({
    store: new (PgSession(session))({
      conString: process.env.SUPABASE_CONNECTION_STRING, // connect to the database
    }),
    secret: process.env.SESSION_SECRET || 'supersecretkey', // to encrypt the session // ! 'supersecretkey' is not secure for production
    resave: false, // no need to resave session data if not changed
    saveUninitialized: false, // no need to create session if not initialized
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 10, // 10 days in milliseconds
      secure: process.env.NODE_ENV === 'production', // use HTTPS in production 
      httpOnly: true, // prevent client-side JS from accessing the cookie
    }
  })
)

app.use(cookieParser());

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