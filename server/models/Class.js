const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: [true, "Class name is required"],
      trim: true,
      minlength: [3, "Class name must be at least 3 characters"],
      maxlength: [100, "Class name cannot exceed 100 characters"],
    },
    image: {
      type: String,
      required: [true, "Class image URL is required"],
      trim: true,
    },
    details: {
      type: String,
      required: [true, "Class details are required"],
      maxlength: [1000, "Details cannot exceed 1000 characters"],
    },
    skill: {
      type: String,
      required: [true, "Skill category is required"],
      trim: true,
      lowercase: true,
    },
    duration: {
      type: String,
      trim: true,
      default: '',
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    location: {
      type: String,
      trim: true,
      default: 'Online',
    },
    equipmentNeeded: {
      type: [String],
      default: [],
    },
    capacity: {
      type: Number,
      default: 20,
    },
    language: {
      type: String,
      default: 'English',
    },
    trainers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trainer",
        required: true,
      },
    ],
    bookingCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Class', classSchema);
