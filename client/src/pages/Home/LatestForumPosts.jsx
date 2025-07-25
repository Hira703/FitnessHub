import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { motion } from "framer-motion";
import axiosSecure from "../../api/axiosSecure"; // Adjust the path if needed
import axiosPublic from "../../api/axiosPublic";
import Loader from "../../components/Loader";

const COLORS = ["#1D4ED8", "#10B981", "#F59E0B", "#EF4444"];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, type: "spring", stiffness: 50 },
  }),
};

const iconPulse = {
  rest: { scale: 1 },
  hover: {
    scale: 1.3,
    color: "#34D399",
    transition: { yoyo: Infinity, duration: 0.6 },
  },
};

// Query Function
const fetchLatestForumPosts = async () => {
  const res = await axiosPublic.get("/api/forums?page=1");
  return res.data.forums || [];
};

const LatestForumPosts = () => {
  const {
    data: posts = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["latestForumPosts"],
    queryFn: fetchLatestForumPosts,
    enabled: true,
    staleTime: 1000 * 60 * 3, // cache for 3 minutes
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader>
        </Loader></div>
    );

  if (isError)
    return (
      <p className="text-center py-8 text-lg font-medium text-red-500">
        Error: {error.message}
      </p>
    );

  if (!posts.length)
    return (
      <p className="text-center py-8 text-lg font-medium text-gray-600">
        No forum posts available.
      </p>
    );

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-10 py-12 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-10 text-center text-[#1D4ED8]">
        📝 Latest Community Posts
      </h2>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => {
          const color = COLORS[index % COLORS.length];
          return (
            <motion.article
              key={post._id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="border rounded-xl shadow-md p-6 flex flex-col justify-between bg-white hover:shadow-xl transition-shadow duration-300"
              style={{ borderTop: `6px solid ${color}` }}
              whileHover={{ scale: 1.03 }}
            >
              <div>
                <h3 className="text-xl font-semibold mb-3" style={{ color }}>
                  {post.title}
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {post.content.length > 150
                    ? post.content.slice(0, 150) + "..."
                    : post.content}
                </p>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span className="italic">
                  By <strong>{post.author?.name || "Unknown"}</strong>
                </span>
                <time dateTime={post.createdAt} className="font-mono">
                  {new Date(post.createdAt).toLocaleDateString()}
                </time>
              </div>

              <div className="flex gap-6 text-sm font-semibold text-gray-600">
                <motion.div
                  className="flex items-center gap-2 cursor-pointer"
                  style={{ color: COLORS[1] }}
                  variants={iconPulse}
                  initial="rest"
                  whileHover="hover"
                >
                  <FaArrowUp size={18} />
                  <span>{post.votes?.up || 0}</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-2 cursor-pointer"
                  style={{ color: COLORS[3] }}
                  variants={iconPulse}
                  initial="rest"
                  whileHover="hover"
                >
                  <FaArrowDown size={18} />
                  <span>{post.votes?.down || 0}</span>
                </motion.div>
              </div>

              <a
                href={`/forum/${post._id}`}
                className="mt-6 inline-block font-semibold text-sm"
                style={{ color }}
              >
                Read More &rarr;
              </a>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};

export default LatestForumPosts;
