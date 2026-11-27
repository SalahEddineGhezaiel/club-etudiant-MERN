const mongoose = require('mongoose');

// 1:1 with User: unique on "user" means a user can have only one card
const memberCardSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    cardNumber: { type: String, required: true, unique: true },
    joinDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MemberCard', memberCardSchema);
