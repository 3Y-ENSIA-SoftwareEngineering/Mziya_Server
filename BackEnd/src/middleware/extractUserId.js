import jwt from 'jsonwebtoken';

const extractUserId = (req, res, next) => {
    console.log('================== header: ' + req.headers.authorization);
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header (Bearer token)
    console.log('================== token: ' + token);  

    if (!token) {
        return res.status(401).json({ message: 'Authorization token is missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('================ decoded:' + decoded);
        req.userId = decoded.user_id;  // Attach the userId to the request object

        next(); 
    } catch (err) {
        console.error('Error verifying token:', err);
        return res.status(401).json({ message: 'Invalid or expired token (couldnt decode)' });
    }
};

export default extractUserId;
