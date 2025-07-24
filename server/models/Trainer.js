const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [3, "Full name must be at least 3 characters"],
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [16, "Minimum age is 16"],
      max: [100, "Maximum age is 100"],
    },
    profileImageUrl: {
      type: String,
      required: [true, "Profile image URL is required"],
    },
    skills: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one skill is required",
      },
    },
    availableDays: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one available day is required",
      },
    },
    availableTime: {
      type: String,
      required: [true, "Available time is required"],
      trim: true,
      maxlength: [50, "Available time cannot exceed 50 characters"],
    },
    otherInfo: {
      type: String,
      trim: true,
      maxlength: [500, "Other info cannot exceed 500 characters"],
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    feedback: {
      type: String,
      trim: true,
      maxlength: [500, "Feedback cannot exceed 500 characters"],
      default: "",
    },
    yearsOfExperience: {
      type: Number,
      required: [true, "Years of experience is required"],
      min: [0, "Experience must be 0 or greater"],
      max: [80, "Experience cannot exceed 80 years"],
    },
    classes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Trainer = mongoose.model("Trainer", trainerSchema);
module.exports = Trainer;
