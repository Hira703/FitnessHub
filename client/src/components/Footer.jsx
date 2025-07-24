import { NavLink } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const COLORS = ["#1D4ED8", "#10B981", "#F59E0B", "#EF4444"];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-10">
          {/* Logo and Description */}
          <div className="text-center lg:text-left">
            <h1
              className="text-3xl font-bold"
              style={{
                color: COLORS[0],
                fontFamily: "'Brush Script MT', cursive",
              }}
            >
              𝓕𝓲𝓽𝓝𝓮𝔁𝓾𝓼
            </h1>
            <p className="mt-2 max-w-sm text-gray-500 mx-auto lg:mx-0">
              Your ultimate fitness companion — track workouts, join classes,
              and connect with trainers.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-6 text-base font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition ${
                  isActive ? "underline" : ""
                } text-indigo-600 hover:text-indigo-800`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/trainers"
              className={({ isActive }) =>
                `transition ${
                  isActive ? "underline" : ""
                } text-green-600 hover:text-green-800`
              }
            >
              All Trainers
            </NavLink>
            <NavLink
              to="/all-classes"
              className={({ isActive }) =>
                `transition ${
                  isActive ? "underline" : ""
                } text-yellow-600 hover:text-yellow-800`
              }
            >
              All Classes
            </NavLink>
            <NavLink
              to="/forums"
              className={({ isActive }) =>
                `transition ${
                  isActive ? "underline" : ""
                } text-red-600 hover:text-red-800`
              }
            >
              Community
            </NavLink>
            <NavLink
              to="/be-a-trainer"
              className={({ isActive }) =>
                `transition ${
                  isActive ? "underline" : ""
                } text-indigo-600 hover:text-indigo-800`
              }
            >
              Be a Trainer
            </NavLink>
          </nav>

          {/* Social Icons */}
          <div className="flex justify-center lg:justify-end space-x-4">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
              (Icon, index) => (
                <a
                  key={index}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition transform hover:scale-110"
                  aria-label={`Social ${index}`}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md"
                    style={{ backgroundColor: COLORS[index] }}
                  >
                    <Icon size={18} />
                  </div>
                </a>
              )
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 border-t border-gray-300 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} 𝓕𝓲𝓽𝓝𝓮𝔁𝓾𝓼. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
