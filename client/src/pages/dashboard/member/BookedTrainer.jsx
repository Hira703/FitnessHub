import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../context/AuthProvider";
import axiosSecure from "../../../api/axiosSecure";
import { FaStar, FaCalendarAlt, FaDumbbell } from "react-icons/fa";
import ReviewModal from "../../../components/ReviewModal";
import Loader from "../../../components/Loader";
import ChatBox from "../../../components/ChatBox";

const COLORS = ['#1D4ED8', '#10B981', '#F59E0B', '#EF4444'];

const fetchBookings = async (email) => {
  const res = await axiosSecure.get(`/api/payments/details/${email}`);
  return res.data;
};

const BookedTrainer = () => {
  const { backendUser } = useContext(AuthContext);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewTrainerId, setReviewTrainerId] = useState(null);
  const [chatTrainerId, setChatTrainerId] = useState(null);

  const {
    data: bookings = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["bookings", backendUser?.email],
    queryFn: () => fetchBookings(backendUser.email),
    enabled: !!backendUser?.email,
  });

  const openReviewModal = (trainerId) => {
    setReviewTrainerId(trainerId);
    setReviewModalOpen(true);
  };

  const handleReviewSubmitted = () => {
    setReviewModalOpen(false);
    setReviewTrainerId(null);
    refetch();
  };

  const closeReviewModal = () => {
    setReviewModalOpen(false);
    setReviewTrainerId(null);
  };

  const toggleChatBox = (trainerId) => {
    if (chatTrainerId === trainerId) {
      setChatTrainerId(null);
    } else {
      setChatTrainerId(trainerId);
    }
  };

  const defaultImage = "https://i.ibb.co/fD1S9m6/default-user.png";

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2
        className="text-4xl font-extrabold text-center mb-12"
        style={{ color: COLORS[0] }}
      >
        Your Booked Trainers
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-72 sm:h-96">
          <Loader />
        </div>
      ) : isError ? (
        <p className="text-center text-red-600 text-lg font-semibold">
          Error: {error.message}
        </p>
      ) : bookings.length === 0 ? (
        <div className="text-center text-gray-700 dark:text-gray-300 space-y-2">
          <p className="text-xl font-semibold">
            You haven't booked any trainers yet.
          </p>
          <p className="text-md">
            Browse our trainers and book your first session today!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col"
              >
                {/* Trainer Info */}
                <div className="flex flex-col sm:flex-row items-center p-6 gap-6 border-b border-gray-100 dark:border-gray-800">
                  <div
                    className="w-28 h-28 rounded-full overflow-hidden border-4"
                    style={{ borderColor: COLORS[0] }}
                  >
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
                    <h3
                      className="text-2xl font-bold"
                      style={{ color: COLORS[0] }}
                    >
                      {trainer?.fullName || "Trainer Name"}
                    </h3>
                    <p className="text-sm mt-2 text-gray-600 dark:text-gray-400 italic">
                      {trainer?.otherInfo || "No additional info available."}
                    </p>
                    <div className="flex items-center justify-center sm:justify-start mt-3 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < averageRating
                              ? "text-yellow-400"
                              : "text-yellow-200 dark:text-yellow-600"
                          }
                          size={18}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-300 font-semibold">
                        ({averageRating.toFixed(1)})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Class & Slot Details */}
                <div className="px-8 py-6 flex flex-col gap-4 flex-grow">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-gray-800 dark:text-gray-300 font-medium text-lg gap-3 sm:gap-0">
                    <div className="flex items-center gap-2">
                      <FaDumbbell
                        size={20}
                        className="text-[var(--primary-color)]"
                        style={{ color: COLORS[1] }}
                      />
                      <span>
                        <strong>Class:</strong> {bookedClass?.className || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 max-w-xs sm:max-w-md">
                      <FaCalendarAlt
                        size={20}
                        className="text-[var(--secondary-color)] mt-1"
                        style={{ color: COLORS[2] }}
                      />
                      <span className="break-words">
                        <strong>Slots:</strong>{" "}
                        {bookedSlots.length > 0
                          ? bookedSlots
                              .map(
                                (slot) =>
                                  `${slot.slotName || "Slot"} at ${
                                    slot.slotTime || ""
                                  }`
                              )
                              .join(", ")
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-auto flex flex-col sm:flex-row gap-4 justify-between">
                    <button
                      onClick={() => openReviewModal(trainer?._id)}
                      className="w-full sm:w-auto px-6 py-2 rounded-lg font-semibold shadow-md text-white transition-transform transform hover:scale-105"
                      style={{ backgroundColor: COLORS[0] }}
                    >
                      Leave a Review
                    </button>

                    <button
                      onClick={() => toggleChatBox(trainer?.email)}
                      className="w-full sm:w-auto px-6 py-2 rounded-lg font-semibold shadow-md text-white transition-transform transform hover:scale-105"
                      style={{ backgroundColor: COLORS[1] }}
                    >
                      {chatTrainerId === trainer?.email ? "Close Chat" : "Chat"}
                    </button>
                  </div>

                  {/* Chat Box */}
                  {chatTrainerId === trainer?.email && (
                    <div className="mt-6 border border-gray-300 dark:border-gray-700 rounded-lg shadow-inner overflow-hidden">
                      <ChatBox
                        receiverEmail={trainer.email}
                        senderEmail={backendUser.email}
                      />
                    </div>
                  )}
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
          onReviewSubmitted={handleReviewSubmitted}
          trainerId={reviewTrainerId}
          memberId={backendUser._id}
        />
      )}
    </div>
  );
};

export default BookedTrainer;
