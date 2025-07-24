const Slot = require("../models/Slot");
const User = require("../models/User");
const Trainer = require("../models/Trainer");
const Class = require("../models/Class");
// Helper to check duplicate slots
const isDuplicateSlot = async ({ trainerId, slotTime, days }) => {
  const existingSlot = await Slot.findOne({
    trainerId,
    slotTime,
    days: { $all: days, $size: days.length },
  });
  return !!existingSlot;
};

// Create a new slot
exports.createSlot = async (req, res) => {
  try {
    const { trainerId, slotName, slotTime, days, classIds, notes } = req.body;
    console.log(req.body);

    if (!trainerId || !slotName || !slotTime || !Array.isArray(days) || days.length === 0) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    const duplicate = await isDuplicateSlot({ trainerId, slotTime, days });
    if (duplicate) {
      return res.status(409).json({ message: "Slot with same time and days already exists." });
    }

    const newSlot = new Slot({
      trainerId,
      slotName: slotName.trim().toLowerCase(),
      slotTime,
      days,
      classIds,
      notes,
    });
    await Class.updateMany(
      { _id: { $in: classIds } },
      { $addToSet: { trainers: trainerId } }
    );

    const savedSlot = await newSlot.save();
    res.status(201).json(savedSlot);
  } catch (error) {
    res.status(400).json({ message: "Failed to create slot", error: error.message });
  }
};

//  Get all slots
exports.getAllSlots = async (req, res) => {
  try {
    const slots = await Slot.find()
      .populate("trainerId", "fullName email profileImageUrl")
      .populate("classIds", "className category");

    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch slots", error: error.message });
  }
};

// Get slots by trainer
exports.getSlotsByTrainer = async (req, res) => {
  const { email, isBooked } = req.query;

  try {
    if (!email) {
      return res.status(400).json({ message: "Trainer email is required." });
    }

    const trainer = await Trainer.findOne({ email });
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found." });
    }

    const filter = { trainerId: trainer._id };
    if (isBooked !== undefined) {
      filter.isBooked = isBooked === "true";
    }

    const slots = await Slot.find(filter)
      .populate("classIds", "className category")
      .populate("bookedBy", "name email") 
      .exec();

    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch slots", error: error.message });
  }
};

// Get slots by trainer AND class AND optional isBooked
exports.getSlotsByTrainerAndClass = async (req, res) => {
  const { trainerId, classId, isBooked } = req.query;

  if (!trainerId || !classId) {
    return res.status(400).json({ message: "trainerId and classId are required." });
  }

  try {
    const filter = {
      trainerId,
      classIds: classId, // classIds must contain classId
    };

    if (isBooked !== undefined) {
      filter.isBooked = isBooked === "true";
    }

    const slots = await Slot.find(filter)
      .populate("classIds", "className category")
      .populate("trainerId", "fullName email");

    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch filtered slots", error: error.message });
  }
};

// ✅ Delete a slot
exports.deleteSlot = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Slot.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Slot not found" });
    }

    res.status(200).json({ message: "Slot deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete slot", error: error.message });
  }
};

// ✅ Update booking status
// exports.updateBookingStatus = async (req, res) => {
//   const { id } = req.params;
//   const { isBooked, bookedBy } = req.body;

//   try {
//     const updated = await Slot.findByIdAndUpdate(
//       id,
//       {
//         isBooked,
//         bookedBy: isBooked ? bookedBy : null,
//       },
//       { new: true }
//     );

//     if (!updated) {
//       return res.status(404).json({ message: "Slot not found" });
//     }

//     res.status(200).json(updated);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to update booking", error: error.message });
//   }
// };
exports.getSlotById = async (req, res) => {
  try {
    const { id } = req.params;

    const slot = await Slot.findById(id).populate("classIds", "className category");
    
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    res.status(200).json(slot);
  } catch (error) {
    console.error("Error fetching slot by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.bookSlotById = async (req, res) => {
  const { slotId } = req.params;
  const { isBooked, bookedBy } = req.body;

  try {
    const slot = await Slot.findById(slotId);

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    // 🔒 Prevent double booking
    if (slot.isBooked) {
      return res.status(400).json({ message: "This slot is already booked." });
    }

    slot.isBooked = isBooked ?? true;
    slot.bookedBy = bookedBy;

    const updatedSlot = await slot.save();

    res.status(200).json({
      message: "Slot booked successfully",
      updatedSlot,
    });
  } catch (error) {
    console.error("Error booking slot:", error);
    res.status(500).json({ message: "Failed to book slot" });
  }
};
