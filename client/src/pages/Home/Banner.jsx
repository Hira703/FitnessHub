import { motion } from "framer-motion";
import { FaDumbbell, FaUsers, FaFireAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import CountUp from "react-countup"; // ✅ Add CountUp import
import bannerImage from "../../assets/images/banner-image.jpg";

const statVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.5 },
  }),
};

const Banner = () => {
  const stats = [
    { icon: <FaUsers className="text-[#10B981] text-xl" />, count: 5000, label: "Members" },
    { icon: <FaDumbbell className="text-[#1D4ED8] text-xl" />, count: 100, label: "Trainers" },
    { icon: <FaFireAlt className="text-[#F59E0B] text-xl" />, count: 200, label: "Classes" },
  ];

  return (
    <section className="bg-white py-16 px-6 md:px-12 lg:px-20 flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto">
      {/* Left Content */}
      <motion.div
        className="w-full md:w-1/2 text-center md:text-left"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-[#1D4ED8] via-[#10B981] to-[#F59E0B] text-transparent bg-clip-text"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Transform Your Body, Mind, and Life
        </motion.h1>

        <motion.p
          className="text-gray-600 mb-8 text-lg md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Join thousands training with expert coaches. Personalized plans. Real results.
        </motion.p>

        <div className="flex flex-col md:flex-row items-center gap-4 mb-8 justify-center md:justify-start">
          <Link to="/get-started">
            <button className="bg-gradient-to-r from-[#1D4ED8] to-[#10B981] text-white px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition">
              Get Started
            </button>
          </Link>
          <Link to="/classes">
            <button className="border-2 border-[#1D4ED8] text-[#1D4ED8] px-6 py-3 rounded-full font-semibold hover:bg-[#1D4ED8] hover:text-white transition">
              Explore Classes
            </button>
          </Link>
        </div>

        {/* Animated Stats with CountUp */}
        <div className="flex flex-wrap gap-6 justify-center md:justify-start text-gray-700 font-medium">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-lg shadow-sm hover:shadow-md transition"
              custom={i}
              initial="hidden"
              animate="visible"
              variants={statVariants}
            >
              {stat.icon}
              <div className="flex flex-col items-start">
                <span className="text-xl font-bold text-[#1F2937]">
                  <CountUp end={stat.count} duration={2} separator="," />+
                </span>
                <span className="text-sm">{stat.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right Image - Slightly Bigger */}
      <motion.div
        className="w-full md:w-1/2 mb-10 md:mb-0 flex justify-center"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src={bannerImage}
          alt="Fitness Banner"
          className="w-[90%] md:w-[100%] lg:w-[110%] max-w-xl rounded-2xl shadow-2xl"
        />
      </motion.div>
    </section>
  );
};

export default Banner;
