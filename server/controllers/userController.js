const User = require("../models/User");
const Trainer = require('../models/Trainer');
const Payment = require('../models/Payment');
const Class = require('../models/Class');

const NewsletterSubscriber = require('../models/NewsletterSubscriber');

// Save a new user if not already exists
exports.saveUser = async (req, res) => {
  const { name, email, photoURL, role } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and Email are required" });
  }

  const validRoles = ["admin", "member", "trainer"];
  const userRole = validRoles.includes(role) ? role : "member";

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      photoURL: photoURL || "",
      role: userRole,
    });

    await newUser.save();
    res.status(201).json({ message: "User saved successfully" });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user by email
exports.getUserByEmail = async (req, res) => {
  const email = req.params.email;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email }).select("-__v -password"); // exclude unwanted fields
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user info (used from profile page)
exports.updateUser = async (req, res) => {
  const email = req.params.email;
  const {
    name,
    photoURL,
    phone,
    address,
    gender,
    dateOfBirth,
    bio,
  } = req.body;

  if (!email || !name) {
    return res.status(400).json({ message: "Email and Name are required" });
  }

  // Validate gender if provided
  const validGenders = ["Male", "Female", "Other"];
  if (gender && !validGenders.includes(gender)) {
    return res.status(400).json({ message: "Invalid gender value" });
  }

  // Validate dateOfBirth if provided (optional)
  let dob = null;
  if (dateOfBirth) {
    dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) {
      return res.status(400).json({ message: "Invalid dateOfBirth" });
    }
  }

  try {
    const updated = await User.updateOne(
      { email },
      {
        $set: {
          name,
          photoURL,
          phone: phone || "",
          address: address || "",
          gender: gender || "Other",
          dateOfBirth: dob || null,
          bio: bio || "",
        },
      }
    );

    if (updated.modifiedCount > 0) {
      res.status(200).json({ message: "User updated successfully" });
    } else {
      res.status(200).json({ message: "No changes made" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAdminOverview = async (req, res) => {
  try {
    
    const [
      totalSubscribers,
      totalMembers,
      totalPayments,
      lastSixPayments,
      trainerStatusCounts,
      totalClasses
    ] = await Promise.all([
      NewsletterSubscriber.countDocuments(),
      User.countDocuments({ role: 'member' }),
      Payment.aggregate([
        { $group: { _id: null, total: { $sum: "$price" } } }
      ]),
      Payment.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .select('user amount createdAt'),
      Trainer.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ]),
      Class.countDocuments()
    ]);

  
    const trainerStats = {
      approved: 0,
      pending: 0,
      rejected: 0,
    };

    trainerStatusCounts.forEach(item => {
      if (item._id === 'approved') trainerStats.approved = item.count;
      else if (item._id === 'pending') trainerStats.pending = item.count;
      else if (item._id === 'rejected') trainerStats.rejected = item.count;
    });

    const totalRevenue = totalPayments[0]?.total || 0;

    res.status(200).json({
      totalSubscribers,
      totalMembers,
      totalTrainers: trainerStats.approved + trainerStats.pending + trainerStats.rejected,
      approvedTrainers: trainerStats.approved,
      pendingTrainers: trainerStats.pending,
      rejectedTrainers: trainerStats.rejected,
      totalRevenue,
      lastSixPayments,
      totalClasses, 
    });

  } catch (error) {
    console.error('Admin overview fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch overview data' });
  }
};