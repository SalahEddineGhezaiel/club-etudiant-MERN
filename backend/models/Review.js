const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating must be between 1 and 5'],
    },
    comment: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

// One review per user per event
reviewSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
