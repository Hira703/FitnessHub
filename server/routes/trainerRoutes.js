const express = require("express");
const router = express.Router();

const trainerController = require("../controllers/trainerController");
const verifyToken = require("../middlewares/verifyToken");


// Public: create trainer application (user must be authenticated)
router.post("/", verifyToken, trainerController.createTrainer);

// Admin-only: get all trainers
router.get("/",   trainerController.getAllTrainers);

// Public or authenticated user: get trainer by email (optional: protect if needed)
router.get("/email", trainerController.getTrainerByEmail);

// Public: get trainer by ID
router.get("/:id", trainerController.getTrainerById);

// Admin-only: update trainer status
router.patch("/:id/status", verifyToken,    trainerController.updateTrainerStatus);

// Admin-only: reject trainer application
router.patch("/reject/:id", verifyToken,  trainerController.rejectTrainerApplication);

// Admin-only: confirm trainer application
router.patch("/confirm/:id", verifyToken,   trainerController.confirmTrainerApplication);

// Member-only: get activity log of trainer applications by member email
router.get("/member/:memberEmail",verifyToken, trainerController.getTrainerApplicationsForMember);
router.delete('/remove/:id', verifyToken, trainerController.removeTrainer);
module.exports = router;
