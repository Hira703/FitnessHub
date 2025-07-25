import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaUserCircle,
} from "react-icons/fa";
import { MdCalendarToday, MdAccessTime } from "react-icons/md";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { motion } from "framer-motion";
import { Fade } from "react-awesome-reveal";
import { useQuery } from "@tanstack/react-query";
import axiosPublic from "../../api/axiosPublic";
import { Helmet } from "react-helmet-async";
import Loader from "../../components/Loader";

const COLORS = ['#1D4ED8', '#10B981', '#F59E0B', '#EF4444'];

const fetchApprovedTrainers = async () => {
  const res = await axiosPublic.get("/api/trainers?status=approved");
  return res.data;
};

const AllTrainers = () => {
  const navigate = useNavigate();
  const [imgErrors, setImgErrors] = useState([]);

  const { data: trainers = [], isLoading, isError, error } = useQuery({
    queryKey: ["approvedTrainers"],
    queryFn: fetchApprovedTrainers,
    onSuccess: (data) => {
      setImgErrors(new Array(data.length).fill(false));
    },
  });

  const handleImgError = (index) => {
    const updatedErrors = [...imgErrors];
    updatedErrors[index] = true;
    setImgErrors(updatedErrors);
  };

  if (isLoading) {
    return (
      <Loader></Loader>
    )
  }

  if (isError) {
    return (
      <div className="text-center text-red-600 mt-10 text-lg">
        Failed to load trainers: {error.message}
      </div>
    );
  }

  if (trainers.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-10 text-lg">
        No trainers available at the moment.
      </div>
    );
  }

  return (
    <>
     <Helmet>
        <title>Trainers</title>
        <meta name="description" content="Welcome to Trainers page" />
      </Helmet>
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1
        className="text-4xl font-extrabold text-center mb-12"
        style={{ color: COLORS[0] }}
      >
        Meet Our Expert Trainers
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {trainers.map((trainer, index) => (
          <motion.div
            key={trainer._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="rounded-xl shadow-lg overflow-hidden bg-white flex flex-col hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="relative">
              {!imgErrors[index] && trainer.profileImageUrl ? (
                <img
                  src={trainer.profileImageUrl}
                  alt={trainer.fullName}
                  onError={() => handleImgError(index)}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-t-xl">
                  <FaUserCircle className="text-7xl text-gray-300" />
                </div>
              )}

              {trainer.isVerified && (
                <div className="absolute top-3 right-3 bg-green-500 rounded-full p-1 shadow-lg">
                  <BsFillPatchCheckFill className="text-white" />
                </div>
              )}
            </div>

            <div className="px-6 py-5 flex flex-col flex-grow text-gray-900">
              <Fade cascade triggerOnce damping={0.1}>
                <h2
                  className="text-xl font-semibold mb-3 text-center"
                  style={{ color: COLORS[0] }}
                  title={trainer.fullName}
                >
                  {trainer.fullName}
                </h2>

                <div className="text-sm space-y-3">
                  <p className="flex items-center gap-2 flex-wrap text-gray-700">
                    <BsFillPatchCheckFill className="text-green-500" />
                    <span className="font-semibold">Experience:</span>{" "}
                    {trainer.yearsOfExperience
                      ? `${trainer.yearsOfExperience} year${trainer.yearsOfExperience > 1 ? "s" : ""}`
                      : "N/A"}
                  </p>

                  <p className="flex items-center gap-2 flex-wrap text-gray-700">
                    <MdCalendarToday className="text-blue-600" />
                    <span className="font-semibold">Available Days:</span>{" "}
                    {trainer.availableDays?.join(", ") || "Not specified"}
                  </p>

                  <p className="flex items-center gap-2 flex-wrap text-gray-700">
                    <MdAccessTime className="text-blue-600" />
                    <span className="font-semibold">Time:</span>{" "}
                    {trainer.availableTime || "Not specified"}
                  </p>

                  {trainer.skills?.length > 0 && (
                    <p className="flex items-start gap-2 flex-wrap text-gray-700">
                      <span
                        className="font-semibold"
                        style={{ color: COLORS[1] }}
                      >
                        Skills:
                      </span>
                      <span>{trainer.skills.join(", ")}</span>
                    </p>
                  )}

                  {trainer.otherInfo && (
                    <p className="line-clamp-3 text-gray-600 italic">
                      {trainer.otherInfo}
                    </p>
                  )}
                </div>
              </Fade>

              <div className="flex justify-between items-center mt-6">
                <div className="flex gap-5 text-2xl" style={{ color: COLORS[0] }}>
                  {trainer.socialLinks?.linkedin && (
                    <a
                      href={trainer.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-800 transition"
                      aria-label="LinkedIn"
                    >
                      <FaLinkedin />
                    </a>
                  )}
                  {trainer.socialLinks?.twitter && (
                    <a
                      href={trainer.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-500 transition"
                      aria-label="Twitter"
                    >
                      <FaTwitter />
                    </a>
                  )}
                  {trainer.socialLinks?.instagram && (
                    <a
                      href={trainer.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-pink-600 transition"
                      aria-label="Instagram"
                    >
                      <FaInstagram />
                    </a>
                  )}
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate(`/trainer-details/${trainer._id}`)}
                  className="py-2 px-5 rounded-md font-semibold shadow-md transition-colors duration-300"
                  style={{
                    backgroundColor: COLORS[0],
                    color: "white",
                  }}
                >
                  Know More
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
    </>
  );
};

export default AllTrainers;
