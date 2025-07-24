import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

import axiosSecure from "../../../api/axiosSecure";

const COLORS = ['#1D4ED8', '#10B981', '#F59E0B', '#EF4444'];

const dayIcons = {
  Sunday: "☀️",
  Monday: "📅",
  Tuesday: "📆",
  Wednesday: "🗓️",
  Thursday: "📌",
  Friday: "⭐",
  Saturday: "🌟",
};

const TrainerDetails = () => {
  const { id: trainerId } = useParams();
  const navigate = useNavigate();


  const {
    data: trainer,
    isLoading: loadingTrainer,
    error: trainerError,
  } = useQuery({
    queryKey: ["trainer", trainerId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/trainers/${trainerId}`);
      return res.data.trainer;
    },
    enabled: !!trainerId,
  });

  const {
    data: availableSlots = [],
    isLoading: loadingSlots,
    error: slotsError,
  } = useQuery({
    queryKey: ["slots", trainer?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/slots/trainer/email`, {
        params: { email: trainer.email, isBooked: false },
      });
      return res.data;
    },
    enabled: !!trainer?.email,
  });

  const handleBookSlot = (slot) => {
    Swal.fire({
      title: "Confirm Booking?",
      text: `Do you want to book slot "${slot.slotName}" at ${slot.slotTime}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: COLORS[0],
      cancelButtonColor: '#aaa',
      confirmButtonText: "Yes, Book",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/book/${trainerId}?slotId=${slot._id}`);
      }
    });
  };

  if (loadingTrainer || !trainer) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600 font-semibold">
        Loading trainer details...
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-6 sm:p-10 font-sans text-gray-900">
      {/* Trainer Header */}
      <section className="flex flex-col md:flex-row items-center md:items-start gap-10 bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
  {/* Trainer Image */}
  <div className="flex-shrink-0">
    <img
      src={trainer.profileImageUrl}
      alt={trainer.fullName}
      className="w-44 h-44 rounded-full object-cover border-8 border-indigo-600 shadow-md"
      loading="lazy"
    />
  </div>

  {/* Trainer Info */}
  <div className="flex-1 w-full text-center md:text-left space-y-5">
    {/* Name & Email */}
    <div>
      <h1 className="text-3xl font-extrabold text-indigo-700 mb-1 tracking-tight">
        {trainer.fullName}
      </h1>
      <p className="text-indigo-500 font-medium select-text break-all">{trainer.email}</p>
    </div>

    {/* Age & Status */}
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-gray-700 font-medium">
      <span className="text-sm">Age: {trainer.age}</span>
      <span
        className="px-4 py-1 rounded-full text-white text-sm font-semibold w-fit"
        style={{ backgroundColor: COLORS[1] }}
      >
        {trainer.status}
      </span>
    </div>

    {/* Divider */}
    <hr className="border-t border-indigo-200" />

    {/* Skills */}
    <div>
      <h2 className="text-xl font-semibold text-indigo-800 mb-2">Skills & Experience</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        {trainer.skills?.map((skill, idx) => (
          <li key={idx}>{skill}</li>
        ))}
      </ul>
    </div>

    {/* Other Info */}
    {trainer.otherInfo && (
      <div>
        <h3 className="text-lg font-semibold text-indigo-700 mb-1">Additional Info</h3>
        <p className="italic text-gray-600">{trainer.otherInfo}</p>
      </div>
    )}
  </div>
</section>

      {/* Available Slots */}
      <section className="mt-14 bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h3
          className="text-3xl font-bold mb-8 text-indigo-700 tracking-wide"
          style={{ color: COLORS[0] }}
        >
          Available Slots
        </h3>

        {availableSlots.length === 0 ? (
          <p className="text-center text-gray-500 italic text-lg">
            No available slots at the moment. Please check back later.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {availableSlots.map((slot) => (
              <div
                key={slot._id}
                className="border rounded-xl p-6 flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-lg transition duration-300 border-yellow-400"
                role="button"
                tabIndex={0}
                onClick={() => handleBookSlot(slot)}
                onKeyDown={(e) => { if (e.key === "Enter") handleBookSlot(slot) }}
                aria-label={`Book slot ${slot.slotName} at ${slot.slotTime}`}
              >
                <div>
                  <h4 className="text-2xl font-semibold text-indigo-900 mb-2">
                    {slot.slotName}
                  </h4>
                  <p className="text-yellow-600 font-semibold mb-4 text-lg">
                    Time: {slot.slotTime}
                  </p>
                </div>

                <div>
                  <h5 className="text-indigo-700 font-semibold mb-3 text-lg">
                    Days
                  </h5>
                  <div className="flex flex-wrap gap-3">
                    {slot.days.map((day) => (
                      <span
                        key={day}
                        className="flex items-center gap-2 px-4 py-1 rounded-full text-white font-semibold select-none"
                        style={{
                          backgroundColor:
                            day === "Sunday" || day === "Saturday"
                              ? COLORS[3]
                              : COLORS[2],
                          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        }}
                      >
                        <span className="text-lg">{dayIcons[day] || "📅"}</span> {day}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-md transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookSlot(slot);
                  }}
                  aria-label={`Book slot ${slot.slotName} at ${slot.slotTime}`}
                >
                  Book This Slot
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default TrainerDetails;
