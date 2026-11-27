const Workshop = require('../models/Workshop');
const Event = require('../models/Event');

// GET /api/workshops  or  /api/workshops?event=<eventId>  (member)
const getWorkshops = async (req, res) => {
  const filter = req.query.event ? { event: req.query.event } : {};
  const workshops = await Workshop.find(filter).populate('event', 'title date');
  res.json(workshops);
};

// GET /api/workshops/:id  (member)
const getWorkshopById = async (req, res) => {
  const workshop = await Workshop.findById(req.params.id).populate('event', 'title date');
  if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
  res.json(workshop);
};

// POST /api/workshops  (admin)
const createWorkshop = async (req, res) => {
  const { title, description, capacity, event } = req.body;
  if (!(await Event.exists({ _id: event }))) {
    return res.status(404).json({ message: 'Event not found' });
  }
  const workshop = await Workshop.create({ title, description, capacity, event });
  res.status(201).json(workshop);
};

// PUT /api/workshops/:id  (admin): the parent event cannot be changed
const updateWorkshop = async (req, res) => {
  const { title, description, capacity } = req.body;
  const workshop = await Workshop.findByIdAndUpdate(
    req.params.id,
    { title, description, capacity },
    { returnDocument: 'after', runValidators: true }
  );
  if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
  res.json(workshop);
};

// DELETE /api/workshops/:id  (admin)
const deleteWorkshop = async (req, res) => {
  const workshop = await Workshop.findByIdAndDelete(req.params.id);
  if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
  res.json({ message: 'Workshop deleted' });
};

module.exports = { getWorkshops, getWorkshopById, createWorkshop, updateWorkshop, deleteWorkshop };
