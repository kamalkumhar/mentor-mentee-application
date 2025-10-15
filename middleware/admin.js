const User = require('../models/User');

// Middleware to check if user is an admin or mentor
const adminOrMentorMiddleware = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Find the user
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is admin or mentor
    if (user.role !== 'mentor') {
      return res.status(403).json({ message: 'Access denied. Admins and mentors only.' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = adminOrMentorMiddleware;