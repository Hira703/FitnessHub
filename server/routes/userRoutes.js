const express = require("express");
const {
  saveUser,
  getUserByEmail,
  updateUser,
  getAdminOverview,
  getMemberStatsByEmail,
  getTrainerStatsByEmail
} = require("../controllers/userController");

 // import trainer controller
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/", saveUser);

router.get('/overview', verifyToken, getAdminOverview);

// Member stats by email (using param)
router.get('/stats/member/:email', getMemberStatsByEmail);

// Trainer stats by email (using query param)
router.get('/stats/trainer', getTrainerStatsByEmail);

// Get user by email
router.get('/:email', getUserByEmail);

// Update user by email (protected)
router.put("/:email", verifyToken, updateUser);

module.exports = router;
