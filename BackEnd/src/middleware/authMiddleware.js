import jwt from 'jsonwebtoken';
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
      .select('id')
      .eq('id', payload.user_id)
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

export default authenticateUser;
