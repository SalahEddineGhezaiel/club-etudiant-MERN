const Event = require('../models/Event');
const Workshop = require('../models/Workshop');
const Review = require('../models/Review');

// GET /api/events  (member)
const getEvents = async (req, res) => {
  const events = await Event.find().sort({ date: 1 }).populate('createdBy', 'name');
  res.json(events);
};

// GET /api/events/mine  (member): the events the logged-in user joined
const getMyEvents = async (req, res) => {
  const events = await Event.find({ participants: req.user._id }).sort({ date: 1 });
  res.json(events);
};

// GET /api/events/:id  (member)
const getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate('participants', 'name email')
    .populate('createdBy', 'name');
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json(event);
};

// POST /api/events  (admin)
const createEvent = async (req, res) => {
  const { title, description, date, location } = req.body;
  const event = await Event.create({ title, description, date, location, createdBy: req.user._id });
  res.status(201).json(event);
};

// PUT /api/events/:id  (admin)
const updateEvent = async (req, res) => {
  const { title, description, date, location } = req.body;
  // Fields left undefined are ignored by Mongoose, so the client can send only what changed
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    { title, description, date, location },
    { returnDocument: 'after', runValidators: true } // return the document AFTER the update, and check the schema rules
  );
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json(event);
};

// DELETE /api/events/:id  (admin): also deletes its workshops and reviews
const deleteEvent = async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  await Workshop.deleteMany({ event: event._id });
  await Review.deleteMany({ event: event._id });
  res.json({ message: 'Event deleted' });
};

// POST /api/events/:id/join  (member)
const joinEvent = async (req, res) => {
  // $addToSet adds the id only if it is not already in the array
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { participants: req.user._id } },
    { returnDocument: 'after' }
  )
    .populate('participants', 'name email')
    .populate('createdBy', 'name'); // same shape as getEventById, so the page can replace it
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json(event);
};

// DELETE /api/events/:id/join  (member)
const leaveEvent = async (req, res) => {
  // $pull removes the id from the array
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    { $pull: { participants: req.user._id } },
    { returnDocument: 'after' }
  )
    .populate('participants', 'name email')
    .populate('createdBy', 'name');
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json(event);
};

module.exports = {
  getEvents,
  getMyEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
};
