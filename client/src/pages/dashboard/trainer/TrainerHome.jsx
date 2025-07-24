import React from "react";
import { Link } from "react-router-dom";
import {
  FaChalkboardTeacher,
  FaPlusCircle,
  FaTasks,
  FaComments,
} from "react-icons/fa";

const COLORS = ["#1D4ED8", "#10B981", "#F59E0B", "#EF4444"];

const trainerRoutes = [
  {
    to: "/dashboard/trainer",
    label: "Trainer Dashboard",
    icon: <FaChalkboardTeacher size={36} />,
    color: COLORS[0],
    desc: "View your overview and statistics",
  },
  {
    to: "/dashboard/trainer/add-slot",
    label: "Add New Slot",
    icon: <FaPlusCircle size={36} />,
    color: COLORS[1],
    desc: "Create new training slots easily",
  },
  {
    to: "/dashboard/trainer/manage-slot",
    label: "Manage Slots",
    icon: <FaTasks size={36} />,
    color: COLORS[2],
    desc: "View, update, or delete your slots",
  },
  {
    to: "/dashboard/trainer/add-forum",
    label: "Add Forum",
    icon: <FaComments size={36} />,
    color: COLORS[3],
    desc: "Contribute to the community discussions",
  },
];

const TrainerHome = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-green-50 flex flex-col items-center py-10 px-4 sm:px-8 md:py-14">
      {/* Welcome Card */}
      <section className="max-w-4xl w-full mb-14 bg-white rounded-3xl shadow-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-10">
        <div className="flex-1 text-center md:text-left">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 tracking-wide text-indigo-700"
            style={{ color: COLORS[0] }}
          >
            Welcome Back, Trainer!
          </h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-md mx-auto md:mx-0">
            Manage your slots, add new sessions, and engage with the community — all from your personalized dashboard.
          </p>
        </div>
        <div className="flex-1 flex justify-center md:justify-end max-w-xs sm:max-w-sm mx-auto md:mx-0">
          {/* Illustration Placeholder */}
          <div className="w-40 h-40 sm:w-48 sm:h-48 bg-indigo-100 rounded-full flex items-center justify-center shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 sm:h-24 sm:w-24 text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
              focusable="false"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 14l6.16-3.422a12.083 12.083 0 01.84 4.265c0 3.866-3.582 7-8 7s-8-3.134-8-7a12.083 12.083 0 01.84-4.265L12 14z"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Section Header */}
      <h2
        className="text-3xl sm:text-4xl md:text-4xl font-bold mb-12 tracking-wide border-b-4 border-yellow-400 pb-2 w-full max-w-6xl text-center"
        style={{ color: COLORS[2] }}
      >
        Your Trainer Tools
      </h2>

      {/* Route Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl w-full px-2 sm:px-0">
        {trainerRoutes.map(({ to, label, icon, color, desc }) => (
          <Link
            key={to}
            to={to}
            className="group relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl shadow-lg bg-white transition-transform transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-400"
            aria-label={`Go to ${label}`}
          >
            <div
              className="rounded-full mb-5 p-4 flex items-center justify-center transition-colors duration-300"
              style={{ backgroundColor: color + "22", color: color }}
            >
              {icon}
            </div>
            <h3
              className="text-xl sm:text-2xl font-semibold mb-2 text-gray-900 group-hover:text-gray-700 transition-colors"
              style={{ color }}
            >
              {label}
            </h3>
            <p className="text-center text-gray-600 text-sm sm:text-base">{desc}</p>

            {/* Decorative accent line */}
            <span
              className="absolute bottom-6 left-1/2 -translate-x-1/2 w-14 h-1 rounded-full"
              style={{ backgroundColor: color }}
            />
          </Link>
        ))}
      </section>
    </main>
  );
};

export default TrainerHome;
