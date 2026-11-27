const MemberCard = require('../models/MemberCard');
const User = require('../models/User');

// shortcut: time-based number, unique index rejects the rare collision; use a counter if cards are created in bulk
const generateCardNumber = () => `CLUB-${Date.now()}`;

// GET /api/cards/me  (member)
const getMyCard = async (req, res) => {
  const card = await MemberCard.findOne({ user: req.user._id });
  if (!card) return res.status(404).json({ message: 'You have no member card yet' });
  res.json(card);
};

// GET /api/cards  (admin): every card with its owner
const getCards = async (req, res) => {
  const cards = await MemberCard.find().sort({ joinDate: -1 }).populate('user', 'name email role');
  res.json(cards);
};

// POST /api/cards  (admin): for users who have no card yet
const createCard = async (req, res) => {
  const { user } = req.body;
  if (!(await User.exists({ _id: user }))) {
    return res.status(404).json({ message: 'User not found' });
  }
  // A second card for the same user breaks the unique index: the error middleware sends 400
  const card = await MemberCard.create({ user, cardNumber: generateCardNumber() });
  res.status(201).json(card);
};

// PUT /api/cards/:id  (admin)
const updateCard = async (req, res) => {
  const { cardNumber, joinDate } = req.body;
  const card = await MemberCard.findByIdAndUpdate(
    req.params.id,
    { cardNumber, joinDate },
    { new: true, runValidators: true }
  );
  if (!card) return res.status(404).json({ message: 'Card not found' });
  res.json(card);
};

// DELETE /api/cards/:id  (admin)
const deleteCard = async (req, res) => {
  const card = await MemberCard.findByIdAndDelete(req.params.id);
  if (!card) return res.status(404).json({ message: 'Card not found' });
  res.json({ message: 'Card deleted' });
};

module.exports = { generateCardNumber, getMyCard, getCards, createCard, updateCard, deleteCard };
