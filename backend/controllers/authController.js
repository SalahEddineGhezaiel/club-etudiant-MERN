const jwt = require('jsonwebtoken');
const User = require('../models/User');
const MemberCard = require('../models/MemberCard');
const { generateCardNumber } = require('./cardController');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// What we send back to the client: never the password
const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

// POST /api/auth/register  (public)
const register = async (req, res) => {
  const { name, email, password } = req.body;
  // role is NOT read from req.body: anyone could register as admin otherwise
  const user = await User.create({ name, email, password });
  await MemberCard.create({ user: user._id, cardNumber: generateCardNumber() }); // every new member gets a card (1:1)
  res.status(201).json({ token: generateToken(user._id), user: userResponse(user) });
};

// POST /api/auth/login  (public)
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email }).select('+password');
  // Same message for both cases so nobody can find out which emails exist
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({ token: generateToken(user._id), user: userResponse(user) });
};

// GET /api/auth/me  (private): req.user was set by the protect middleware
const getMe = async (req, res) => {
  res.json(userResponse(req.user));
};

module.exports = { register, login, getMe };
