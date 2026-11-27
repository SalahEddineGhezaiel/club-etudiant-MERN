const express = require('express');
const {
  getEvents,
  getMyEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
} = require('../controllers/eventController');
const { protect, adminOnly } = require('../middlewares/auth');

const router = express.Router();

router.use(protect); // every route below needs a logged-in user

router.get('/', getEvents);
router.get('/mine', getMyEvents); // must stay before '/:id', or "mine" would be read as an id
router.get('/:id', getEventById);
router.post('/', adminOnly, createEvent);
router.put('/:id', adminOnly, updateEvent);
router.delete('/:id', adminOnly, deleteEvent);
router.post('/:id/join', joinEvent);
router.delete('/:id/join', leaveEvent);

module.exports = router;
