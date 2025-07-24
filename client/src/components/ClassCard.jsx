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
import { motion } from 'framer-motion';

const COLORS = ['#1D4ED8', '#10B981', '#F59E0B', '#EF4444'];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: { scale: 1.05, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' },
};

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
    <motion.div
      className="bg-white rounded-3xl overflow-hidden cursor-pointer transform transition duration-300"
      style={{ borderTop: `6px solid ${COLORS[0]}` }}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
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
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />
        <h2 className="absolute bottom-3 left-4 text-white text-lg font-extrabold drop-shadow-lg">
          {className}
        </h2>
      </div>

      {/* Details Section */}
      <div className="p-5 space-y-3">
        <p className="text-gray-700 text-sm line-clamp-3">
          {details}
        </p>

        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mt-3">
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

        {equipmentNeeded?.length > 0 && (
          <p className="text-xs text-gray-500 mt-3">
            <strong>Equipment:</strong> {equipmentNeeded.join(', ')}
          </p>
        )}

        <div className="mt-5 flex justify-between items-center">
          <span className="text-sm text-gray-500 font-semibold">
            Bookings: {bookingCount}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-green-600 transition"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ClassCard;
