const Review = require('../models/Review');
const Event = require('../models/Event');

// GET /api/reviews?event=<eventId>  (member)
const getReviews = async (req, res) => {
  const filter = req.query.event ? { event: req.query.event } : {};
  const reviews = await Review.find(filter).sort({ createdAt: -1 }).populate('user', 'name');
  res.json(reviews);
};

// POST /api/reviews  (member): only someone who joined the event can review it
const createReview = async (req, res) => {
  const { event, rating, comment } = req.body;
  const found = await Event.findById(event);
  if (!found) return res.status(404).json({ message: 'Event not found' });
  if (!found.participants.some((id) => id.equals(req.user._id))) {
    return res.status(403).json({ message: 'Only participants can review this event' });
  }
  // A second review for the same event breaks the unique index: the error middleware sends 400
  const review = await Review.create({ user: req.user._id, event, rating, comment });
  res.status(201).json(review);
};

// PUT /api/reviews/:id  (author only)
const updateReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: 'Review not found' });
  if (!review.user.equals(req.user._id)) {
    return res.status(403).json({ message: 'You can only edit your own review' });
  }
  const { rating, comment } = req.body;
  if (rating !== undefined) review.rating = rating;
  if (comment !== undefined) review.comment = comment;
  await review.save(); // save() runs the schema validators (rating 1 to 5)
  res.json(review);
};

// DELETE /api/reviews/:id  (author or admin)
const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: 'Review not found' });
  if (!review.user.equals(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not allowed to delete this review' });
  }
  await review.deleteOne();
  res.json({ message: 'Review deleted' });
};

module.exports = { getReviews, createReview, updateReview, deleteReview };
