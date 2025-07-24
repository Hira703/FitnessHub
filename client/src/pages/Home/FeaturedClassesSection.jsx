import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ClassCard from "../../components/ClassCard";
import axiosSecure from "../../api/axiosSecure"; // Adjust the path if needed
import { Spinner } from "flowbite-react";
import axiosPublic from "../../api/axiosPublic";

const fetchTopBookedClasses = async () => {
  const res = await axiosPublic.get("/api/classes?sortBy=bookings&limit=6");
  return res.data.classes || [];
};

const FeaturedClassesSection = () => {
  const navigate = useNavigate();

  const {
    data: featuredClasses = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["topBookedClasses"],
    queryFn: fetchTopBookedClasses,
    staleTime: 5 * 60 * 1000, // 5 mins
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spinner size="xl" />
      </div>
    );

  if (isError)
    return (
      <p className="text-center text-red-500 font-semibold">
        Error loading classes: {error.message}
      </p>
    );

  return (
    <section className="py-16 px-4 md:px-10 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1D4ED8] mb-10">
          🚀 Top Booked Fitness Classes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredClasses.map((classItem) => (
            <ClassCard key={classItem._id} classItem={classItem} />
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => navigate("/all-classes")}
            className="bg-[#10B981] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#0f9b75] transition duration-300 shadow-md"
          >
            View All Classes
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedClassesSection;
