// models/Slot.js

const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // assuming trainers are users with role: 'Trainer'
      required: true,
    },
    slotName: {
      type: String,
      required: true,
    },
    slotTime: {
      type: String, // e.g., "7 AM – 8 AM"
      required: true,
    },
    days: {
      type: [String], // e.g., ["Sun", "Tue", "Thu"]
      enum: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      required: true,
    },
    classIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class', // class model reference
      },
    ],
    notes: {
      type: String,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Slot', slotSchema);
