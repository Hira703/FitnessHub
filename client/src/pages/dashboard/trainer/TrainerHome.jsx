import React, { useContext } from "react";
import {
  FaChalkboardTeacher,
  FaPlusCircle,
  FaTasks,
  FaComments,
  FaUserGraduate,
  FaUsers,
  FaClock,
  FaDollarSign,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../context/AuthProvider";
import axiosSecure from "../../../api/axiosSecure";
import { Link } from "react-router-dom";

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
  const { backendUser } = useContext(AuthContext);
  const trainerEmail = backendUser?.email;

  const {
    data: trainerStats,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["trainerStats", trainerEmail],
    enabled: !!trainerEmail,
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/users/stats/trainer?email=${trainerEmail}`);
      return res.data;
    },
  });

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (isError) return <div className="text-center text-red-500 py-8">{error.message}</div>;
  // console.log(trainerStats);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-green-50 flex flex-col items-center py-10 px-4 sm:px-8 md:py-14">
      {/* Welcome & Profile Card */}
      <section className="max-w-5xl w-full mb-16 bg-white rounded-3xl shadow-2xl px-4 py-8 sm:px-8 sm:py-10 flex flex-col md:flex-row items-center gap-10 md:gap-20">
  {/* Profile Picture & Info */}
  <div className="flex-shrink-0 rounded-full overflow-hidden w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 shadow-lg border-4 border-indigo-300">
    <img
      src={
        trainerStats?.trainer.profileImageUrl ||
        "/default-profile.png"
      }
      alt={trainerStats?.trainer.fullName || "Trainer"}
      className="object-cover w-full h-full"
    />
  </div>

  {/* Text Welcome */}
  <div className="flex-1 text-center md:text-left">
    <h1
      className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 tracking-wide text-indigo-700"
      style={{ color: COLORS[0] }}
    >
      Welcome Back, {trainerStats?.trainer.fullName || "Trainer"}!
    </h1>
    <p className="text-base sm:text-lg text-gray-700 max-w-md mx-auto md:mx-0">
      Manage your slots, add new sessions, and engage with the community — all from your personalized dashboard.
    </p>

    {/* Extra Trainer Info */}
    <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start text-gray-600 font-medium text-sm sm:text-base">
      <div className="flex items-center gap-2">
        <FaUserGraduate className="text-indigo-500" />
        <span>{trainerStats?.trainer.yearsOfExperience || 0} years experience</span>
      </div>
      <div className="flex items-center gap-2">
        <FaClock className="text-green-500" />
        <span>{trainerStats?.trainer.availableDays?.join(", ") || "N/A"}</span>
      </div>
      <div className="flex items-center gap-2">
        <FaTasks className="text-yellow-500" />
        <span>{trainerStats?.trainer.skills?.join(", ") || "No skills listed"}</span>
      </div>
    </div>
  </div>
</section>


      {/* Section Header */}
      <h2
        className="text-3xl sm:text-4xl font-bold mb-12 tracking-wide border-b-4 border-yellow-400 pb-2 w-full max-w-6xl text-center"
        style={{ color: COLORS[2] }}
      >
        Your Trainer Tools
      </h2>

      {/* Trainer Stats Section */}
      <section className="max-w-6xl w-full mb-12 px-2 sm:px-0">
        <h3 className="text-2xl font-semibold mb-6" style={{ color: COLORS[0] }}>
          Trainer Statistics
        </h3>
        {isLoading && <p className="text-gray-600">Loading stats...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {trainerStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full px-2 sm:px-0">
            {/* Total Slots */}
            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-indigo-700">
              <FaTasks size={36} className="mb-2" />
              <p className="text-4xl font-bold">{trainerStats.slots.total}</p>
              <p className="mt-2 font-medium">Total Slots</p>
            </div>

            {/* Available Slots */}
            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-green-600">
              <FaClock size={36} className="mb-2" />
              <p className="text-4xl font-bold">{trainerStats.slots.available}</p>
              <p className="mt-2 font-medium">Available Slots</p>
            </div>

            {/* Booked Slots */}
            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-yellow-500">
              <FaUsers size={36} className="mb-2" />
              <p className="text-4xl font-bold">{trainerStats.slots.booked}</p>
              <p className="mt-2 font-medium">Booked Slots</p>
            </div>

            {/* Total Earnings */}
            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-red-500">
              <FaDollarSign size={36} className="mb-2" />
              <p className="text-4xl font-bold">${trainerStats.earnings.toFixed(2)}</p>
              <p className="mt-2 font-medium">Total Earnings</p>
            </div>

            {/* Unique Members */}
            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-indigo-500">
              <FaUserGraduate size={36} className="mb-2" />
              <p className="text-4xl font-bold">{trainerStats.uniqueMembers}</p>
              <p className="mt-2 font-medium">Unique Members</p>
            </div>

            {/* Classes Offered */}
            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-green-700">
              <FaChalkboardTeacher size={36} className="mb-2" />
              <p className="text-4xl font-bold">{trainerStats.classes.length}</p>
              <p className="mt-2 font-medium">Classes Offered</p>
            </div>
          </div>
        )}
      </section>


      {/* Route Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full px-2 sm:px-0">
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
