import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaDumbbell,
  FaGlobe,
  FaStar,
} from 'react-icons/fa';

const COLORS = ['#1D4ED8', '#10B981', '#F59E0B', '#EF4444'];

const ClassCard = ({ classItem }) => {
  const navigate = useNavigate();
  const {
    _id,
    className,
    image,
    details,
    skill,
    duration,
    level,
    location,
    equipmentNeeded,
    capacity,
    language,
    bookingCount,
  } = classItem;

  const handleViewDetails = () => {
    navigate(`/classes/${_id}`);
  };

  return (
    <div
      className="bg-white dark:bg-gray-900 shadow-lg rounded-3xl overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-2xl"
      style={{ borderTop: `6px solid ${COLORS[0]}` }}
      onClick={handleViewDetails}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && handleViewDetails()}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden rounded-t-3xl">
        <img
          src={image}
          alt={className}
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/70 to-transparent"
          aria-hidden="true"
        />
        <h2
          className="absolute bottom-3 left-4 text-white text-lg font-extrabold drop-shadow-lg"
          title={className}
        >
          {className}
        </h2>
      </div>

      {/* Details Section */}
      <div className="p-5 space-y-3">
        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">
          {details}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400 mt-3">
          <div className="flex items-center gap-2">
            <FaClock style={{ color: COLORS[0] }} />
            <span>{duration} hrs</span>
          </div>

          <div className="flex items-center gap-2">
            <FaStar className="text-yellow-400" />
            <span>{level}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-red-500" />
            <span>{location}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaGlobe className="text-green-500" />
            <span>{language}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaUsers className="text-purple-600" />
            <span>{capacity} seats</span>
          </div>

          <div className="flex items-center gap-2">
            <FaDumbbell className="text-pink-500" />
            <span>{skill}</span>
          </div>
        </div>

        {/* Equipment Info (Optional) */}
        {equipmentNeeded?.length > 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            <strong>Equipment:</strong> {equipmentNeeded.join(', ')}
          </p>
        )}

        {/* Footer Section */}
        <div className="mt-5 flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
            Bookings: {bookingCount}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              handleViewDetails();
            }}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-green-600 transition"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;
