const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Check if header has the correct format and extract token
    let token;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7, authHeader.length);
    } else {
      token = authHeader;
    }
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key';
    
    try {
      const decoded = jwt.verify(token, jwtSecret);
      
      // Make sure we have a valid user ID in the token
      if (!decoded.id) {
        return res.status(401).json({ message: 'Invalid token format' });
      }
      
      req.user = decoded;
      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token has expired' });
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      
      return res.status(401).json({ message: 'Token is not valid', error: jwtError.message });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server authentication error' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};

module.exports = { auth, isAdmin }; 