import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome, FaTachometerAlt, FaClipboardList, FaUserCircle, FaCalendarCheck,
  FaChalkboardTeacher, FaPlusCircle, FaTasks, FaComments, FaUserShield,
  FaUserCheck, FaChalkboard, FaPlus, FaBars, FaTimes, FaMoneyCheckAlt,
  FaUserFriends
} from "react-icons/fa";
import Loader from "./Loader";

const COLORS = ["#1D4ED8", "#10B981", "#F59E0B", "#EF4444"];
const PRIMARY_COLOR = COLORS[0];

const Sidebar = () => {
  const { user, backendUser, loading, logoutUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Automatically close sidebar on route change (mobile UX)
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const toggleSidebar = () => setIsOpen(prev => !prev);

  // ⏳ Show loader while data is still being fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  // ⛔ Fallback: if user or user.role is missing, redirect or logout (optional)
  const role = user?.role || "member"; // safe fallback

  const links = [
    { to: "/", label: "Home", icon: <FaHome /> },
    ...(role === "member"
      ? [
          { to: "/dashboard/member", label: "My Dashboard", icon: <FaTachometerAlt /> },
          { to: "/dashboard/member/activitylog", label: "Activity Log", icon: <FaClipboardList /> },
          { to: "/dashboard/member/profile", label: "My Profile", icon: <FaUserCircle /> },
          { to: "/dashboard/member/booked-trainer", label: "Booked Trainer", icon: <FaCalendarCheck /> },
        ]
      : []),
    ...(role === "trainer"
      ? [
          { to: "/dashboard/trainer", label: "Trainer Dashboard", icon: <FaChalkboardTeacher /> },
          { to: "/dashboard/trainer/add-slot", label: "Add New Slot", icon: <FaPlusCircle /> },
          { to: "/dashboard/trainer/manage-slot", label: "Manage Slots", icon: <FaTasks /> },
          { to: "/dashboard/trainer/add-forum", label: "Add Forum", icon: <FaComments /> },
        ]
      : []),
    ...(role === "admin"
      ? [
          { to: "/dashboard/admin", label: "Admin Dashboard", icon: <FaUserShield /> },
          { to: "/dashboard/admin/applied-trainers", label: "Applied Trainers", icon: <FaUserCheck /> },
          { to: "/dashboard/admin/manage-classes", label: "Manage Classes", icon: <FaChalkboard /> },
          { to: "/dashboard/admin/create-class", label: "Create Class", icon: <FaPlus /> },
          { to: "/dashboard/admin/add-forum", label: "Add Forum", icon: <FaComments /> },
          { to: "/dashboard/admin/trainers", label: "All Trainers", icon: <FaChalkboardTeacher /> },
          { to: "/dashboard/admin/balance", label: "Transaction Overview", icon: <FaMoneyCheckAlt /> },
          { to: "/dashboard/admin/subscribers", label: "All Subscribers", icon: <FaUserFriends /> },
        ]
      : []),
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between bg-white border-b border-gray-300 p-4 shadow-sm fixed w-full z-40">
        <h1 className="text-lg font-semibold" style={{ color: PRIMARY_COLOR }}>
          Dashboard
        </h1>
        <button
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          onClick={toggleSidebar}
          className="text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </header>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform
          md:translate-x-0 md:static md:shadow-none
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <div className="px-6 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold" style={{ color: PRIMARY_COLOR }}>
              Welcome,
            </h2>
            <p className="mt-1 text-gray-600 truncate">
              {backendUser?.name || user?.displayName || "User"}
            </p>
          </div>

          <nav className="flex-grow overflow-y-auto px-2 py-4 space-y-1">
            {links.map(({ to, label, icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-3 px-4 py-2 rounded-md
                    text-gray-700 hover:bg-blue-100 hover:text-blue-700
                    transition duration-150
                    ${active ? "bg-blue-200 text-blue-800 font-semibold" : ""}`}
                >
                  <span className="text-lg">{icon}</span>
                  <span className="truncate">{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="px-6 py-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
