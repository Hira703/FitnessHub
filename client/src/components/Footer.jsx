import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const COLORS = ['#1D4ED8', '#10B981', '#F59E0B', '#EF4444'];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-6 md:space-y-0">
          {/* Logo and description */}
          <div>
            <h1
              className="text-3xl font-bold"
              style={{ color: COLORS[0], fontFamily: "'Brush Script MT', cursive" }}
            >
              𝓕𝓲𝓽𝓝𝓮𝔁𝓾𝓼
            </h1>
            <p className="mt-2 max-w-xs text-gray-500">
              Your ultimate fitness companion — track workouts, join classes, and connect with trainers.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex space-x-8 text-base font-medium">
            <Link
              to="/"
              className="hover:text-indigo-600 transition"
              style={{ color: COLORS[0] }}
            >
              Home
            </Link>
            <Link
              to="/trainers"
              className="hover:text-green-600 transition"
              style={{ color: COLORS[1] }}
            >
              All Trainers
            </Link>
            <Link
              to="/all-classes"
              className="hover:text-yellow-600 transition"
              style={{ color: COLORS[2] }}
            >
              All Classes
            </Link>
            <Link
              to="/forums"
              className="hover:text-red-600 transition"
              style={{ color: COLORS[3] }}
            >
              Community
            </Link>
            <Link
              to="/be-a-trainer"
              className="hover:text-indigo-600 transition"
              style={{ color: COLORS[0] }}
            >
              Be a Trainer
            </Link>
          </nav>

          {/* Social Icons */}
          <div className="flex space-x-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-indigo-600 transition"
              style={{ color: COLORS[0] }}
            >
              <FaFacebookF size={22} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-green-600 transition"
              style={{ color: COLORS[1] }}
            >
              <FaTwitter size={22} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-yellow-600 transition"
              style={{ color: COLORS[2] }}
            >
              <FaInstagram size={22} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-red-600 transition"
              style={{ color: COLORS[3] }}
            >
              <FaLinkedinIn size={22} />
            </a>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-10 border-t border-gray-300 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} 𝓕𝓲𝓽𝓝𝓮𝔁𝓾𝓼. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
