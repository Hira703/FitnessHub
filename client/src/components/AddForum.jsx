import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import axiosSecure from "../api/axiosSecure";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AddForum = () => {
  const { backendUser } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (backendUser?.role !== "admin" && backendUser?.role !== "trainer") {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "Only Admins and Trainers can post forums.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axiosSecure.post("/api/forums", {
        title,
        content: description,
        author: {
          userId: backendUser?._id,
          name: backendUser?.name,
          role: backendUser?.role,
          image: backendUser?.image,
        },
      });

      if (res.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Forum Posted!",
          text: "Your forum post has been published successfully.",
        }).then(() => {
          navigate("/forums");
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to post forum. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-[#93C5FD] dark:border-[#1D4ED8]">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#1D4ED8] dark:text-[#93C5FD]">
        Start a New Discussion
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
            Forum Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
            placeholder="Enter your forum title"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
            Description
          </label>
          <textarea
            required
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
            placeholder="Share your thoughts, questions, or ideas..."
          ></textarea>
        </div>

        <div className="text-right">
          <button
            type="submit"
            disabled={loading}
            className="inline-block px-6 py-2 rounded-lg font-semibold text-white bg-[#1D4ED8] hover:bg-[#2563EB] transition focus:ring-2 focus:ring-offset-2 focus:ring-[#2563EB] disabled:opacity-60"
          >
            {loading ? "Posting..." : "Post Forum"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddForum;
