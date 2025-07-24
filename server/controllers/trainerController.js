const Trainer = require("../models/Trainer");
const User = require("../models/User");
const Class = require("../models/Class");

// Create a new trainer application
exports.createTrainer = async (req, res) => {
  try {
    if (req.user.email !== req.body.email) {
      return res.status(403).json({ message: "Email mismatch. Unauthorized." });
    }

    const existingTrainer = await Trainer.findOne({ email: req.body.email });
    if (existingTrainer) {
      return res.status(400).json({ message: "You have already applied as a trainer." });
    }

    const trainer = new Trainer(req.body);
    await trainer.save();

    return res.status(201).json({
      message: "Trainer application submitted successfully.",
      trainer,
    });
  } catch (error) {
    console.error("Error creating trainer:", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Get all trainer applications (optionally filtered by status) – Admin only
exports.getAllTrainers = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const trainers = await Trainer.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(trainers);
  } catch (error) {
    console.error("Error fetching trainers:", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Update a trainer's application status – Admin only
exports.updateTrainerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const trainer = await Trainer.findByIdAndUpdate(id, { status }, { new: true });
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found." });
    }

    return res.status(200).json({ message: "Status updated successfully.", trainer });
  } catch (error) {
    console.error("Error updating trainer status:", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Confirm a trainer's application: update user's role and mark application as approved
exports.confirmTrainerApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const trainerApp = await Trainer.findById(id);
    if (!trainerApp) {
      return res.status(404).json({ message: "Trainer application not found." });
    }

    const user = await User.findOne({ email: trainerApp.email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.role = "trainer";
    await user.save();

    trainerApp.status = "approved";
    trainerApp.feedback = ""; // clear any old feedback
    await trainerApp.save();

    return res.status(200).json({
      message: "Trainer confirmed and user role updated.",
      trainer: trainerApp,
    });
  } catch (error) {
    console.error("Error confirming trainer:", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Reject a trainer application (update status and feedback)
exports.rejectTrainerApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;

    const trainerApp = await Trainer.findById(id);
    if (!trainerApp) {
      return res.status(404).json({ message: "Trainer application not found." });
    }

    trainerApp.status = "rejected";
    trainerApp.feedback = feedback || "No feedback provided";
    await trainerApp.save();

    return res.status(200).json({
      message: "Trainer application rejected successfully.",
      trainer: trainerApp,
    });
  } catch (error) {
    console.error("Error rejecting trainer:", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Get a single trainer application by ID (public)
exports.getTrainerById = async (req, res) => {
  try {
    const { id } = req.params;

    const trainer = await Trainer.findById(id).select('-password'); // Exclude password or sensitive info
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found." });
    }

    // Find classes where this trainer is included in trainers array
    const classes = await Class.find({ trainers: id });

    return res.status(200).json({
      trainer,
       classes,
    });
  } catch (error) {
    console.error("Error fetching trainer by ID:", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Get trainer application by email (for current user)
exports.getTrainerByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    const trainer = await Trainer.findOne({ email });
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found." });
    }

    return res.status(200).json(trainer);
  } catch (error) {
    console.error("Error fetching trainer by email:", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Get trainer applications for a specific member (activity log)
exports.getTrainerApplicationsForMember = async (req, res) => {
  try {
    const { memberEmail } = req.params;

    const applications = await Trainer.find({
      email: memberEmail,
      status: { $in: ["pending", "rejected"] },
    }).sort({ createdAt: -1 });

    return res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching trainer applications for member:", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};
// Remove trainer role and reset to member
exports.removeTrainer = async (req, res) => {
  try {
    const { id } = req.params;

    // Find trainer application
    const trainer = await Trainer.findById(id);
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found." });
    }

    // Find user and update role
    const user = await User.findOne({ email: trainer.email });
    if (user) {
      user.role = "member";
      await user.save();
    }

    // Delete trainer application
    await Trainer.findByIdAndDelete(id);

    return res.status(200).json({ message: "Trainer role removed and user updated." });
  } catch (error) {
    console.error("Error deleting trainer:", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};

