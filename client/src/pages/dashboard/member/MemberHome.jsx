import { useEffect, useState, useContext } from "react";
import {
  FaClipboardList,
  FaCalendarCheck,
  FaUserCircle,
  FaCheckCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthProvider";
import axiosSecure from "../../../api/axiosSecure";

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
  const [activityCount, setActivityCount] = useState(0);
  const [bookedSessions, setBookedSessions] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchMemberData = async () => {
  //     try {
  //       const res1 = await axiosSecure.get(
  //         `/api/activitylogs?email=${user?.email}`
  //       );
  //       const res2 = await axiosSecure.get(
  //         `/api/bookings?email=${user?.email}`
  //       );

  //       setActivityCount(res1.data.length);
  //       setRecentActivities(res1.data.slice(0, 3));
  //       setBookedSessions(res2.data.slice(0, 1)); // Show next session only
  //     } catch (err) {
  //       console.error("Error fetching member data:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (user?.email) {
  //     fetchMemberData();
  //   }
  // }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-bars loading-lg text-indigo-600"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-4xl font-extrabold text-center mb-8 text-gray-900 dark:text-gray-100">
        Welcome back,{" "}
        <span className="text-indigo-600 dark:text-indigo-400">
          {user?.displayName || "Member"}!
        </span>
      </h2>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-12">
        {memberLinks.map(({ to, label, icon, color }) => (
          <Link
            to={to}
            key={to}
            className="flex flex-col items-center justify-center gap-3 rounded-xl shadow-lg p-8 text-white transform transition hover:scale-105 hover:shadow-2xl"
            style={{ backgroundColor: color }}
            aria-label={label}
          >
            <div className="text-6xl">{icon}</div>
            <h3 className="text-xl font-semibold">{label}</h3>
          </Link>
        ))}
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <StatCard
          label="Total Activities"
          value={activityCount}
          icon={<FaClipboardList className="text-indigo-600" />}
          color="indigo"
        />
        <StatCard
          label="Booked Sessions"
          value={bookedSessions.length}
          icon={<FaCalendarCheck className="text-green-600" />}
          color="green"
        />
        <StatCard
          label="Profile Status"
          value="Complete"
          icon={<FaUserCircle className="text-yellow-500" />}
          color="yellow"
        />
      </div>

      {/* Upcoming Session */}
      {bookedSessions.length > 0 && (
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 mb-12">
          <h3 className="text-2xl font-semibold text-indigo-700 mb-6 dark:text-indigo-400">
            Upcoming Session
          </h3>
          <div className="space-y-3 text-gray-800 dark:text-gray-300 text-lg">
            <p>
              <span className="font-semibold">Trainer:</span>{" "}
              {bookedSessions[0]?.trainerName}
            </p>
            <p>
              <span className="font-semibold">Class:</span>{" "}
              {bookedSessions[0]?.className}
            </p>
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {new Date(bookedSessions[0]?.date).toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span className="text-green-600 font-medium">Confirmed</span>
            </p>
          </div>
        </div>
      )}

      {/* Recent Activity Logs */}
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 mb-16">
        <h3 className="text-2xl font-semibold text-indigo-700 mb-6 dark:text-indigo-400">
          Recent Activities
        </h3>
        {recentActivities.length > 0 ? (
          <ul className="space-y-3 text-gray-700 dark:text-gray-300 text-base">
            {recentActivities.map((log, i) => (
              <li
                key={i}
                className="border-b border-gray-200 dark:border-gray-700 pb-2"
              >
                <p>
                  <span className="font-semibold">{log.type}</span> -{" "}
                  {new Date(log.date).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No recent activity found.
          </p>
        )}
      </div>

      {/* Call to Action */}
      <div className="max-w-3xl mx-auto bg-indigo-100 dark:bg-indigo-900 p-6 rounded-lg text-indigo-800 dark:text-indigo-200 text-center text-lg font-semibold shadow-lg">
        Keep logging your workouts and showing up consistently to achieve your
        goals! 💪
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  const colors = {
    indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
    green: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    yellow: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  };
  return (
    <div
      className={`flex items-center gap-5 p-6 rounded-xl shadow-lg ${colors[color]}`}
    >
      <div className="text-5xl">{icon}</div>
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-3xl font-extrabold">{value}</p>
      </div>
    </div>
  );
};

export default MemberHome;
