// models/Payment.js

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true,
  },
  trainerName: {
    type: String,
    required: true,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },

  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  className: {
    type: String,
  },

  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slot',
  },
  slot: {
    type: String,
    required: true, // e.g., "7 AM - 8 AM"
  },

  package: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },

  paymentIntentId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "paid",
  },

  bookingDate: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Payment', paymentSchema);
