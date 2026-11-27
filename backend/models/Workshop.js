const mongoose = require('mongoose');

// 1:N: one Event has many Workshops, each Workshop belongs to one Event
const workshopSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    description: { type: String, default: '' },
    capacity: { type: Number, min: [1, 'Capacity must be at least 1'], default: 20 },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Workshop', workshopSchema);
