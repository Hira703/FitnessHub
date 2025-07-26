import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../../api/axiosSecure'; 
import {
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaDumbbell,
  FaGlobe,
  FaStar,
  FaCheckCircle,
} from 'react-icons/fa';
import axiosPublic from '../../api/axiosPublic';
import Loader from '../../components/Loader';
import { Helmet } from 'react-helmet-async';

const COLORS = ['#1D4ED8', '#10B981', '#F59E0B', '#EF4444'];

const fetchClassDetails = async (id) => {
  const res = await axiosPublic.get(`/api/classes/${id}`);
  return res.data;
};

const ClassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: classItem,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['class', id],
    queryFn: () => fetchClassDetails(id),
    enabled: !!id, // only run if id exists
  });

  if (isLoading) {
    return <p className="text-center mt-10 text-gray-500"><Loader /></p>;
  }

  if (isError) {
    return <p className="text-center mt-10 text-red-500">Error: {error.message}</p>;
  }

  const {
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
    trainers,
  } = classItem;

  return (
    <>
     <Helmet>
        <title>Class Details</title>
        <meta name="description" content="Welcome to Login page" />
      </Helmet>
    <div className="px-4 py-16 min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-12 border border-gray-200">
        

        {/* Image */}
        <div className="overflow-hidden rounded-3xl shadow-xl">
          <img
            src={image}
            alt={className}
            className="w-full h-[320px] object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
        {/* Title & Description */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-800">{className}</h1>
          <div className="h-1 w-28 bg-blue-500 mx-auto rounded-full"></div>
          <p className="text-gray-600 text-base leading-relaxed max-w-2xl mx-auto">
            {details}
          </p>
        </div>

        {/* Class Info */}
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-md">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Class Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Info icon={<FaClock />} text={`Duration: ${duration} hrs`} color={COLORS[0]} />
            <Info icon={<FaStar />} text={`Level: ${level}`} color={COLORS[2]} />
            <Info icon={<FaMapMarkerAlt />} text={`Location: ${location}`} color={COLORS[3]} />
            <Info icon={<FaGlobe />} text={`Language: ${language}`} color={COLORS[1]} />
            <Info icon={<FaUsers />} text={`Capacity: ${capacity}`} color={COLORS[2]} />
            <Info icon={<FaDumbbell />} text={`Skill: ${skill}`} color={COLORS[1]} />
            <Info icon={<FaUsers />} text={`Bookings: ${bookingCount}`} color={COLORS[0]} />
          </div>
        </div>

        {/* Equipment Section */}
        {equipmentNeeded?.length > 0 && (
          <div className="bg-green-50 border border-green-200 p-6 rounded-3xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Equipment Needed
            </h3>
            <ul className="space-y-3 text-sm text-gray-800">
              {equipmentNeeded.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Trainers Section */}
        {trainers?.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Meet the Trainers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainers.slice(0, 5).map((trainer) => (
                <div
                  key={trainer._id}
                  onClick={() => navigate(`/trainer-details/${trainer._id}`)}
                  className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-2xl shadow hover:shadow-md cursor-pointer transition duration-300"
                >
                  <img
                    src={trainer.profileImageUrl}
                    alt={trainer.fullName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                  />
                  <div>
                    <p className="text-base font-medium text-gray-800">
                      {trainer.fullName}
                    </p>
                    <p className="text-xs text-gray-500">View Profile</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Book Button */}
        <div className="text-center pt-6">
          <button className="px-8 py-4 bg-blue-600 text-white font-semibold text-lg rounded-full shadow hover:bg-blue-700 transition duration-300">
            Book This Class
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

const Info = ({ icon, text, color }) => (
  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl shadow-sm">
    <span className="text-xl" style={{ color }}>{icon}</span>
    <span className="text-sm text-gray-700">{text}</span>
  </div>
  
);

export default ClassDetails;
