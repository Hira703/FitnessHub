const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const verifyToken= require('../middlewares/verifyToken');

// Create a new review
router.post("/",verifyToken, reviewController.createReview);
router.get('/top-rated', reviewController.getTopRatedReviews);

// Get all reviews for a specific trainer
router.get("/trainer/:trainerId",verifyToken, reviewController.getReviewsByTrainer);

// Get a single review by ID
router.get("/:id", reviewController.getReviewById);

// Update a review by ID
router.put("/:id", reviewController.updateReview);

// Delete a review by ID
router.delete("/:id", reviewController.deleteReview);

module.exports = router;
