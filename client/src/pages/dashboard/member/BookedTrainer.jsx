import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../context/AuthProvider";
import axiosSecure from "../../../api/axiosSecure";
import { FaStar, FaCalendarAlt, FaDumbbell } from "react-icons/fa";
import ReviewModal from "../../../components/ReviewModal";

const fetchBookings = async (email) => {
  const res = await axiosSecure.get(`/api/payments/details/${email}`);
  return res.data;
};

const BookedTrainer = () => {
  const { backendUser } = useContext(AuthContext);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewTrainerId, setReviewTrainerId] = useState(null);

  const {
    data: bookings = [],
    isLoading,
    isError,
    error,
    refetch, // <-- get refetch function here
  } = useQuery({
    queryKey: ["bookings", backendUser?.email],
    queryFn: () => fetchBookings(backendUser.email),
    enabled: !!backendUser?.email,
  });

  const openReviewModal = (trainerId) => {
    setReviewTrainerId(trainerId);
    setReviewModalOpen(true);
  };

  // New handler for when a review is submitted successfully
  const handleReviewSubmitted = () => {
    setReviewModalOpen(false);
    setReviewTrainerId(null);
    refetch(); // Refetch bookings so reviews update immediately
  };

  const closeReviewModal = () => {
    setReviewModalOpen(false);
    setReviewTrainerId(null);
  };

  const defaultImage = "https://i.ibb.co/fD1S9m6/default-user.png";

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center text-primary-dark dark:text-primary-light mb-10">
        Your Booked Trainers
      </h2>

      {isLoading ? (
        <p className="text-center text-gray-600">Loading bookings...</p>
      ) : isError ? (
        <p className="text-center text-red-500">Error: {error.message}</p>
      ) : bookings.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p className="text-lg font-semibold">You haven't booked any trainers yet.</p>
          <p className="text-sm mt-2">
            Browse our trainers and book your first session today!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {bookings.map((booking) => {
            const trainer = booking.trainer;
            const bookedClass = booking.class;
            const bookedSlots = booking.slots || [];

            const ratings = booking.trainerReviews || [];
            const averageRating =
              ratings.length > 0
                ? ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length
                : 0;

            return (
              <div
                key={booking._id}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition duration-300 overflow-hidden"
              >
                {/* Top Image & Trainer Info */}
                <div className="flex flex-col sm:flex-row items-center p-6 gap-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary-base shadow-sm">
                    <img
                      src={trainer?.profileImageUrl || defaultImage}
                      alt={trainer?.fullName || "Trainer"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultImage;
                      }}
                    />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-semibold text-primary-base dark:text-primary-light">
                      {trainer?.fullName || "Trainer Name"}
                    </h3>
                    <p className="text-sm mt-1 text-gray-700 dark:text-gray-400">
                      {trainer?.otherInfo || "No additional info available."}
                    </p>
                    <div className="flex items-center justify-center sm:justify-start mt-2 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < averageRating
                              ? "text-yellow-400"
                              : "text-yellow-200 dark:text-yellow-600"
                          }
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-300">
                        ({averageRating.toFixed(1)})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Class & Slot Details */}
                <div className="px-6 pb-6">
                  <div className="flex flex-col gap-2 text-sm text-gray-800 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <FaDumbbell className="text-primary-base dark:text-primary-light" />
                      <span>
                        <strong>Class:</strong> {bookedClass?.className || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <FaCalendarAlt className="text-secondary-base dark:text-secondary-light mt-1" />
                      <span>
                        <strong>Slots:</strong>{" "}
                        {bookedSlots.length > 0
                          ? bookedSlots
                              .map(
                                (slot) =>
                                  `${slot.slotName || "Slot"} at ${slot.slotTime || ""}`
                              )
                              .join(", ")
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 text-center sm:text-right">
                    <button
                      onClick={() => openReviewModal(trainer?._id)}
                      className="bg-primary-base hover:bg-primary-dark text-blue-600 px-5 py-2 rounded-lg text-sm shadow-md transition-colors duration-200"
                    >
                      Leave a Review
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {reviewModalOpen && reviewTrainerId && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={closeReviewModal}
          onReviewSubmitted={handleReviewSubmitted} // <-- pass this callback to modal
          trainerId={reviewTrainerId}
          memberId={backendUser._id}
        />
      )}
    </div>
  );
};

export default BookedTrainer;