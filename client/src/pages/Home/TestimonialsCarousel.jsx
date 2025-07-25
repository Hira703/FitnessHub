import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

import defaultImg from "../../assets/images/trainer1.avif";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import axiosPublic from "../../api/axiosPublic";
import Loader from "../../components/Loader";

const COLORS = ["#1D4ED8", "#10B981", "#F59E0B", "#EF4444"];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

const fetchTopRatedReviews = async () => {
  const { data } = await axiosPublic.get("/api/reviews/top-rated");
  return data;
};

const TestimonialsCarousel = () => {
  const { data: reviews = [], isLoading, isError } = useQuery({
    queryKey: ["topRatedReviews"],
    queryFn: fetchTopRatedReviews,
    enabled: true,
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader></Loader>
      </div>
    );

  if (isError)
    return (
      <p className="text-center text-lg py-10 text-red-500">
        Failed to load reviews. Please try again later.
      </p>
    );

  if (reviews.length === 0)
    return (
      <p className="text-center text-lg py-10 text-gray-600">
        No reviews found.
      </p>
    );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white rounded-2xl shadow-2xl">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-[#1D4ED8] mb-12 drop-shadow-md">
        💬 What Our Members Say
      </h2>

      <Swiper
        modules={[Navigation, Pagination, A11y, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true, dynamicBullets: true }}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 30 },
          1024: { slidesPerView: 3, spaceBetween: 40 },
        }}
        style={{ padding: "0 1rem" }}
        a11y={{ prevSlideMessage: "Previous testimonial", nextSlideMessage: "Next testimonial" }}
      >
        {reviews.map((review, index) => (
          <SwiperSlide key={review._id}>
            <motion.div
              className="p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col gap-5 min-h-[320px] bg-gradient-to-tr from-white to-gray-50"
              style={{ borderLeft: `8px solid ${COLORS[index % COLORS.length]}` }}
              custom={index}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center gap-4 sm:gap-5">
                <img
                  src={review.memberId?.photoUrl || defaultImg}
                  alt={review.memberId?.name || "Member"}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-white shadow-md flex-shrink-0"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 text-base sm:text-lg tracking-wide">
                    {review.memberId?.name || "Anonymous"}
                  </h3>
                  <p className="flex items-center gap-1 text-yellow-400 text-sm sm:text-base font-medium">
                    {"⭐".repeat(review.rating)}
                    <span className="text-gray-400 text-xs sm:text-sm font-normal">({review.rating})</span>
                  </p>
                </div>
              </div>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed flex-grow select-text italic tracking-wide break-words">
                “{review.comment || "No comment provided."}”
              </p>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default TestimonialsCarousel;
