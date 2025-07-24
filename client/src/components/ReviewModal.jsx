import React, { useState } from "react";
import Modal from "react-modal";
import { FaStar } from "react-icons/fa";
import Swal from "sweetalert2";
import axiosSecure from "../api/axiosSecure";

const ReviewModal = ({ isOpen, onClose, trainerId, memberId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setRating(0);
    setHover(null);
    setComment("");
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      Swal.fire("Incomplete", "Please provide both rating and comment.", "warning");
      return;
    }

    setLoading(true);
    try {
      await axiosSecure.post("/api/reviews", {
        trainerId,
        memberId,
        rating,
        comment,
      });

      Swal.fire("Success!", "Review submitted successfully!", "success");
      resetForm();
      
      // Notify parent to update UI immediately
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      console.error(err);

      if (
        err.response?.status === 400 &&
        err.response.data?.message === "You have already reviewed this trainer."
      ) {
        Swal.fire("Duplicate Review", "You can only review a trainer once.", "info");
      } else {
        Swal.fire("Error", "Failed to submit review.", "error");
      }
    }
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      ariaHideApp={false}
      className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4 text-center">Rate Your Trainer</h2>
      <form onSubmit={handleSubmitReview} className="space-y-4">
        <div className="flex justify-center mb-2">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <label key={index}>
                <input
                  type="radio"
                  name="rating"
                  className="hidden"
                  value={ratingValue}
                  onClick={() => setRating(ratingValue)}
                />
                <FaStar
                  className={`cursor-pointer text-3xl transition-all ${
                    ratingValue <= (hover || rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(null)}
                />
              </label>
            );
          })}
        </div>

        <div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full border px-3 py-2 rounded"
            placeholder="Write your feedback..."
            required
          />
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReviewModal;
