// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';

// const authenticateUser = (req, res, next) => {
//     const token = req.cookies.session_token;

//     if (!token) {
//         return res.status(StatusCodes.UNAUTHORIZED).json({
//             success: false,
//             message: 'Authentication required',
//         });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next(); // Pass control to the next middleware or route handler
//     } catch (err) {
//         return res.status(StatusCodes.UNAUTHORIZED).json({
//             success: false,
//             message: 'Invalid or expired token',
//         });
//     }
// };

// export default authenticateUser;


/*import jwt from 'jsonwebtoken';
import supabase from '../config/database.js';
import UnauthenticatedError from '../Errors/UnauthenticatedError.js';

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication invalid');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from Supabase
    const { data: user, error } = await supabase
      .from('Users')
      .select('user_id')
      .eq('user_id', payload.user_id)
      .single();

    if (error || !user) {
      throw new UnauthenticatedError('Authentication invalid');
    }

    // Attach the user to the request object
    req.user = { id: user.user_id };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    throw new UnauthenticatedError('Authentication invalid');
  }
};

export default authenticateUser;*/
import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Authorization header:', authHeader); // Log the header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or malformed authorization header' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user info to the request
    next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default authMiddleware;
