const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    description: { type: String, default: '' },
    date: { type: Date, required: [true, 'Date is required'] },
    location: { type: String, default: '' },
    // Many-to-Many: an event has many users, a user joins many events.
    // A user's events are found with Event.find({ participants: userId }).
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
