const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Checks the "Authorization: Bearer <token>" header and puts the user on req.user
const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = header.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET); // throws if the token is fake or expired
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, invalid or expired token' });
  }

  req.user = await User.findById(decoded.id);
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized, user no longer exists' });
  }
  next();
};

// Must be used AFTER protect, because it reads req.user
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied, admin only' });
  }
  next();
};

module.exports = { protect, adminOnly };
