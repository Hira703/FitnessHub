import {
  FaClipboardList,
  FaCalendarCheck,
  FaUserCircle,
  FaCheckCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../../context/AuthProvider";
import axiosSecure from "../../../api/axiosSecure";
import Loader from "../../../components/Loader";

// Custom color palette
const COLORS = ["#1D4ED8", "#10B981", "#F59E0B", "#EF4444"];

const memberLinks = [
  {
    to: "/dashboard/member/activitylog",
    label: "Activity Log",
    icon: <FaClipboardList />,
    color: COLORS[0],
  },
  {
    to: "/dashboard/member/booked-trainer",
    label: "Booked Trainer",
    icon: <FaCalendarCheck />,
    color: COLORS[1],
  },
  {
    to: "/dashboard/member/profile",
    label: "My Profile",
    icon: <FaUserCircle />,
    color: COLORS[2],
  },
  {
    to: "/dashboard/member",
    label: "Motivation",
    icon: <FaCheckCircle />,
    color: COLORS[3],
  },
];

const MemberHome = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/api/users/stats/member/${user.email}`)
        .then((res) => {
          setStats(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load member stats:", err);
          setLoading(false);
        });
    }
  }, [user?.email]);

  if (loading || !stats) return <div className="text-center mt-10"><Loader></Loader></div>;

  const {
    totalPayment,
    totalBookedClasses,
    totalBookedTrainers,
    totalReviews,
  } = stats;

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-10 text-gray-800">
        Welcome back,{" "}
        <span className="text-[#1D4ED8]">{user?.displayName || "Member"}!</span>
      </h2>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-10">
        <StatCard
          label="Booked Classes"
          value={totalBookedClasses}
          icon={<FaClipboardList className="text-[#1D4ED8]" />}
          color="#DBEAFE"
        />
        <StatCard
          label="Booked Trainers"
          value={totalBookedTrainers}
          icon={<FaCalendarCheck className="text-[#10B981]" />}
          color="#D1FAE5"
        />
        <StatCard
          label="Total Reviews"
          value={totalReviews}
          icon={<FaUserCircle className="text-[#F59E0B]" />}
          color="#FEF3C7"
        />
        <StatCard
          label="Total Payments"
          value={`$${totalPayment.toFixed(2)}`}
          icon={<FaCheckCircle className="text-[#EF4444]" />}
          color="#FECACA"
        />
      </div>

      {/* Navigation Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-14">
        {memberLinks.map(({ to, label, icon, color }) => (
          <Link
            to={to}
            key={to}
            className="flex flex-col items-center justify-center gap-4 rounded-xl shadow-md p-8 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            style={{ backgroundColor: color }}
            aria-label={label}
          >
            <div className="text-5xl">{icon}</div>
            <h3 className="text-lg sm:text-xl font-semibold">{label}</h3>
          </Link>
        ))}
      </div>

      {/* Motivational Message */}
      <div className="max-w-3xl mx-auto bg-[#E0E7FF] p-6 rounded-lg text-[#3730A3] text-center text-lg font-semibold shadow-md">
        Keep logging your workouts and showing up consistently to achieve your goals! 💪
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  return (
    <div
      className="flex items-center gap-4 p-5 rounded-xl shadow-md"
      style={{ backgroundColor: color }}
    >
      <div className="text-4xl">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default MemberHome;
