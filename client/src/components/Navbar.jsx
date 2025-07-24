import { useState, useContext, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { AuthContext } from "../context/AuthProvider"; // adjust path accordingly

const COLORS = ['#1D4ED8', '#10B981', '#F59E0B', '#EF4444'];

export default function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false); // mobile menu toggle
  const [dropdownOpen, setDropdownOpen] = useState(false); // user dropdown toggle
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0 left-0 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Customized Logo Text */}
          <Link to="/" className="flex items-center space-x-2">
            <span
              style={{ 
                fontFamily: "'Dancing Script', cursive", 
                fontSize: "1.75rem", 
                fontWeight: "700", 
                color: COLORS[0],
                userSelect: "none",
                letterSpacing: "0.05em",
                textShadow: `1px 1px ${COLORS[1]}, 2px 2px ${COLORS[2]}`
              }}
              aria-label="FitNexus Logo"
            >
              𝓕𝓲𝓽𝓝𝓮𝔁𝓾𝓼
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive 
                  ? `text-[${COLORS[0]}] font-semibold` 
                  : `text-gray-700 hover:text-[${COLORS[0]}] transition-colors duration-300`
              }
              style={({ isActive }) => ({
                color: isActive ? COLORS[0] : undefined,
                fontWeight: isActive ? '600' : undefined,
              })}
            >
              Home
            </NavLink>
            <NavLink
              to="/trainers"
              className={({ isActive }) =>
                isActive
                  ? `text-[${COLORS[0]}] font-semibold`
                  : `text-gray-700 hover:text-[${COLORS[0]}] transition-colors duration-300`
              }
              style={({ isActive }) => ({
                color: isActive ? COLORS[0] : undefined,
                fontWeight: isActive ? '600' : undefined,
              })}
            >
              All Trainers
            </NavLink>
            <NavLink
              to="/all-classes"
              className={({ isActive }) =>
                isActive
                  ? `text-[${COLORS[0]}] font-semibold`
                  : `text-gray-700 hover:text-[${COLORS[0]}] transition-colors duration-300`
              }
              style={({ isActive }) => ({
                color: isActive ? COLORS[0] : undefined,
                fontWeight: isActive ? '600' : undefined,
              })}
            >
              All Classes
            </NavLink>
            <NavLink
              to="/forums"
              className={({ isActive }) =>
                isActive
                  ? `text-[${COLORS[0]}] font-semibold`
                  : `text-gray-700 hover:text-[${COLORS[0]}] transition-colors duration-300`
              }
              style={({ isActive }) => ({
                color: isActive ? COLORS[0] : undefined,
                fontWeight: isActive ? '600' : undefined,
              })}
            >
              Community
            </NavLink>
            {user && user.role && (
              <li>
                <NavLink
                  to={`/dashboard/${user.role}`}
                  className="hover:text-[${COLORS[1]}] transition-colors duration-300"
                  style={{ color: COLORS[1] }}
                >
                  Dashboard
                </NavLink>
              </li>
            )}
            {user && (
              <li>
                <NavLink
                  to={`/be-a-trainer`}
                  className="hover:text-[${COLORS[2]}] transition-colors duration-300"
                  style={{ color: COLORS[2] }}
                >
                  Be a Trainer
                </NavLink>
              </li>
            )}
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4 relative">
            {!user ? (
              <>
                <NavLink
                  to="/login"
                  className="font-semibold"
                  style={{ color: COLORS[0] }}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-4 py-2 rounded-md font-semibold transition"
                  style={{
                    backgroundColor: COLORS[0],
                    color: "white",
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = COLORS[1]}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = COLORS[0]}
                >
                  Register
                </NavLink>
              </>
            ) : (
              <div ref={dropdownRef} className="relative">
  <button
    onClick={toggleDropdown}
    className="focus:outline-none focus:ring-2 focus:ring-indigo-600 rounded-full p-1 border-2 border-indigo-600 hover:bg-indigo-50 transition"
    aria-label="User menu"
    style={{ color: COLORS[0] }}
  >
    <FiUser className="w-8 h-8" />
  </button>
  {dropdownOpen && (
    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50">
      <div className="px-4 py-2 text-gray-700 border-b border-gray-200 truncate">
        {user.email}
      </div>
      <button
        onClick={() => {
          logoutUser();
          setDropdownOpen(false);
          navigate("/login");  // Navigate to login page after logout
        }}
        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
      >
        Logout
      </button>
    </div>
  )}
</div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              aria-label="Toggle menu"
              className="text-gray-700 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 rounded"
              style={{ color: COLORS[0] }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-2">
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive
                ? "block font-semibold"
                : "block text-gray-700 hover:text-indigo-600"
            }
            style={({ isActive }) => ({
              color: isActive ? COLORS[0] : undefined,
              fontWeight: isActive ? "600" : undefined,
            })}
          >
            Home
          </NavLink>
          <NavLink
            to="/trainers"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive
                ? "block font-semibold"
                : "block text-gray-700 hover:text-indigo-600"
            }
            style={({ isActive }) => ({
              color: isActive ? COLORS[0] : undefined,
              fontWeight: isActive ? "600" : undefined,
            })}
          >
            All Trainers
          </NavLink>
          <NavLink
            to="/all-classes"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive
                ? "block font-semibold"
                : "block text-gray-700 hover:text-indigo-600"
            }
            style={({ isActive }) => ({
              color: isActive ? COLORS[0] : undefined,
              fontWeight: isActive ? "600" : undefined,
            })}
          >
            All Classes
          </NavLink>
          <NavLink
            to="/forums"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive
                ? "block font-semibold"
                : "block text-gray-700 hover:text-indigo-600"
            }
            style={({ isActive }) => ({
              color: isActive ? COLORS[0] : undefined,
              fontWeight: isActive ? "600" : undefined,
            })}
          >
            Community
          </NavLink>
          {user && user.role && (
            <li>
              <NavLink
                to={`/dashboard/${user.role}`}
                className="hover:text-primary"
                style={{ color: COLORS[1] }}
              >
                Dashboard
              </NavLink>
            </li>
          )}
          {!user ? (
            <>
              <NavLink
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block font-semibold"
                style={{ color: COLORS[0] }}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 rounded-md font-semibold transition"
                style={{
                  backgroundColor: COLORS[0],
                  color: "white",
                }}
              >
                Register
              </NavLink>
            </>
          ) : (
            <button
              onClick={() => {
                logoutUser();
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}