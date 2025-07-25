import React from "react";
import { FaDumbbell, FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../api/axiosSecure"; // your secure Axios instance
import axiosPublic from "../../api/axiosPublic";
import Loader from "../../components/Loader";

const COLORS = ['#1D4ED8', '#10B981', '#F59E0B', '#EF4444'];

const fetchApprovedTrainers = async () => {
  const res = await axiosPublic.get("/api/trainers?status=approved");
  return res.data.slice(0, 3);
};

const TeamSection = () => {
  const { data: trainers = [], isLoading, isError } = useQuery({
    queryKey: ["approvedTrainers"],
    queryFn: fetchApprovedTrainers,
    staleTime: 1000 * 60 * 5, // optional: cache for 5 min
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader></Loader>
        </div>
    );

  if (isError)
    return (
      <p className="text-center py-8 text-lg font-medium text-red-600">
        Could not load trainers. Please try again later.
      </p>
    );

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-10 py-12 bg-gray-50 rounded-lg shadow-lg">
      <motion.h2
        className="text-3xl font-bold mb-10 text-center flex items-center justify-center gap-3"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ color: COLORS[0] }}
      >
        <FaUsers /> Meet Our Expert Trainers
      </motion.h2>

      <div className="grid gap-10 md:grid-cols-3">
        {trainers.map((trainer, idx) => {
          const borderColor = COLORS[idx % COLORS.length];
          const expertiseColor = COLORS[(idx + 1) % COLORS.length];

          return (
            <motion.article
              key={trainer._id}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300"
              style={{ borderTop: `6px solid ${borderColor}` }}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
            >
              <img
                src={trainer.profileImageUrl}
                alt={trainer.fullName}
                className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-gray-100 shadow-sm"
              />
              <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS[0] }}>
                {trainer.fullName}
              </h3>
              <p className="text-gray-700 mb-4 italic max-h-24 overflow-hidden text-ellipsis">
                {trainer.otherInfo || "Passionate about helping clients achieve their fitness goals."}
              </p>

              <div className="mb-4">
                <h4 className="font-semibold mb-1 flex items-center justify-center gap-2" style={{ color: expertiseColor }}>
                  <FaDumbbell /> Expertise:
                </h4>
                <ul className="flex flex-wrap justify-center gap-2 text-sm">
                  {trainer.skills?.map((skill, i) => (
                    <li
                      key={i}
                      className="px-3 py-1 rounded-full bg-opacity-10"
                      style={{ backgroundColor: expertiseColor, color: "white" }}
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-sm font-semibold text-gray-500">
                {trainer.yearsOfExperience} {trainer.yearsOfExperience === 1 ? "year" : "years"} experience
              </p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};

export default TeamSection;
