const Review = require("../models/Review");

// Create a new review
exports.createReview = async (req, res) => {
    try {
      const { trainerId, memberId, rating, comment } = req.body;
  
      if (!trainerId || !memberId || !rating) {
        return res.status(400).json({ message: "Missing required fields." });
      }
  
      // Check if review already exists from this member for this trainer
      const existingReview = await Review.findOne({ trainerId, memberId });
      if (existingReview) {
        return res.status(400).json({ message: "You have already reviewed this trainer." });
      }
  
      const newReview = new Review({
        trainerId,
        memberId,
        rating,
        comment,
      });
  
      await newReview.save();
  
      res.status(201).json({ message: "Review created successfully.", review: newReview });
    } catch (error) {
      console.error("Create review error:", error);
      res.status(500).json({ message: "Server error while creating review." });
    }
  };
  

// Get all reviews for a specific trainer
exports.getReviewsByTrainer = async (req, res) => {
  try {
    const { trainerId } = req.params;

    const reviews = await Review.find({ trainerId })
      .populate("memberId", "fullName profileImageUrl") // populate member info
      .sort({ createdAt: -1 }); // newest first

    res.json(reviews);
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ message: "Server error while fetching reviews." });
  }
};

// Get a single review by ID
exports.getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id).populate("memberId", "fullName profileImageUrl");
    if (!review) return res.status(404).json({ message: "Review not found." });

    res.json(review);
  } catch (error) {
    console.error("Get review error:", error);
    res.status(500).json({ message: "Server error while fetching review." });
  }
};

// Update a review by ID (only rating and comment)
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: "Review not found." });

    if (rating) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();

    res.json({ message: "Review updated successfully.", review });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({ message: "Server error while updating review." });
  }
};

// Delete a review by ID
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndDelete(id);
    if (!review) return res.status(404).json({ message: "Review not found." });

    res.json({ message: "Review deleted successfully." });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ message: "Server error while deleting review." });
  }
};
exports.getTopRatedReviews = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const topReviews = await Review.find()
      .populate("memberId", "name  photoURL")
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit);

    res.json(topReviews);
  } catch (error) {
    console.error("Get top rated reviews error:", error);
    res.status(500).json({ message: "Server error while fetching top rated reviews." });
  }
};

