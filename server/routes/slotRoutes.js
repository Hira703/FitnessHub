const express = require("express");
const router = express.Router();
const slotController = require("../controllers/slotController");
const verifyToken = require("../middlewares/verifyToken");

// Create a slot
router.post("/",verifyToken, slotController.createSlot);

// Get all slots
router.get("/",verifyToken, slotController.getAllSlots);
router.get('/:id',verifyToken, slotController.getSlotById);

// Get slots by trainer ID
router.get("/trainer/email", slotController.getSlotsByTrainer);
router.get("/byTrainerAndClass", slotController.getSlotsByTrainerAndClass);

// Delete a slot by ID
router.delete("/:id",verifyToken, slotController.deleteSlot);

// Update booking status (isBooked + bookedBy)
// router.patch("/book/:id", slotController.updateBookingStatus);
router.patch("/:slotId/book", slotController.bookSlotById);
// router.get('/bookings/user/:email', slotController.getBookingsByUserEmail);

module.exports = router;
