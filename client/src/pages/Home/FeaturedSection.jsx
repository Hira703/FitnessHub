import React from "react";
import { motion } from "framer-motion";
import {
  FaUserCheck,
  FaChartLine,
  FaCalendarAlt,
  FaComments,
  FaDumbbell,
  FaBell,
} from "react-icons/fa";

const COLORS = ["#1D4ED8", "#10B981", "#F59E0B", "#EF4444"];

const features = [
  {
    icon: FaUserCheck,
    title: "Certified Trainers",
    desc: "Get expert guidance from qualified fitness professionals who truly care about your goals.",
  },
  {
    icon: FaChartLine,
    title: "Progress Tracking",
    desc: "Track your workouts, nutrition, and performance with real-time charts and stats.",
  },
  {
    icon: FaCalendarAlt,
    title: "Flexible Booking",
    desc: "Choose sessions and slots that fit perfectly into your lifestyle and daily schedule.",
  },
  {
    icon: FaComments,
    title: "Motivational Community",
    desc: "Connect with others, share your journey, and stay inspired with a supportive community.",
  },
  {
    icon: FaDumbbell,
    title: "Goal-Based Classes",
    desc: "Join fitness programs tailored to your personal goals—weight loss, strength, or wellness.",
  },
  {
    icon: FaBell,
    title: "Smart Reminders",
    desc: "Get notified before sessions and never miss your workout with smart alerts.",
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const FeaturedSection = () => {
  return (
    <section className="py-20 bg-gray-50 px-4 md:px-10">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-[#1D4ED8] mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Why Choose Our Platform?
        </motion.h2>

        <motion.p
          className="text-gray-600 mb-12 max-w-2xl mx-auto text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Everything you need to transform your body and stay consistent—all in one place.
        </motion.p>

        <motion.div
          className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            const color = COLORS[idx % COLORS.length];
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 250 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 transition duration-300"
              >
                <div className="flex justify-center mb-4">
                  <div
                    className="rounded-full w-16 h-16 flex items-center justify-center shadow-md"
                    style={{
                      backgroundColor: `${color}15`, // light translucent bg
                    }}
                  >
                    <Icon size={28} style={{ color }} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedSection;
