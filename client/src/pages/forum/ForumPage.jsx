import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../api/axiosSecure";
import { AuthContext } from "../../context/AuthProvider";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import Swal from "sweetalert2";

const fetchForums = async (page) => {
  const res = await axiosSecure.get(`/api/forums?page=${page}&limit=6`);
  return res.data;
};

const ForumPage = () => {
  const { backendUser } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const [voting, setVoting] = useState(false);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["forums", page],
    queryFn: () => fetchForums(page),
    keepPreviousData: true,
  });

  const forums = data?.forums || [];
  const pages = data?.pagination?.pages || 1;

  const handleVote = async (forumId, voteType) => {
    if (!backendUser) {
      Swal.fire({
        icon: "warning",
        title: "Login required",
        text: "Please log in to vote.",
      });
      return;
    }

    setVoting(true);
    try {
      const res = await axiosSecure.patch(`/api/forums/${forumId}/vote`, {
        voteType,
      });

      Swal.fire({
        icon: "success",
        title: "Thank you!",
        text: "Your vote has been recorded.",
        timer: 1500,
        showConfirmButton: false,
      });

      refetch();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to submit vote.";
      if (message === "You have already voted on this post") {
        Swal.fire({
          icon: "info",
          title: "Already voted",
          text: "You have already voted on this post.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: message,
        });
      }
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-[#1D4ED8]">
        💬 Community Forums
      </h1>

      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <ImSpinner2 className="animate-spin text-5xl text-[#1D4ED8]" />
        </div>
      ) : isError ? (
        <p className="text-red-500 text-center">{error.message}</p>
      ) : forums.length === 0 ? (
        <p className="text-center text-gray-500">
          No forum posts yet.
        </p>
      ) : (
        <div className="space-y-8">
          {forums.map((forum) => (
            <div
              key={forum._id}
              className="bg-white p-6 rounded-xl shadow-md border border-[#E0E7FF] transition hover:shadow-lg"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {forum.title}
                </h2>
                <span
                  className={`text-sm font-bold px-3 py-1 rounded-full ${
                    forum.author.role === "admin"
                      ? "bg-[#1D4ED8]/10 text-[#1D4ED8]"
                      : "bg-[#10B981]/10 text-[#10B981]"
                  }`}
                >
                  {forum.author.role === "admin" ? "Admin" : "Trainer"}
                </span>
              </div>

              <p className="mt-3 text-gray-700 leading-relaxed">
                {forum.content}
              </p>

              <div className="flex flex-wrap gap-6 mt-5 items-center">
                <button
                  onClick={() => handleVote(forum._id, "upvote")}
                  disabled={voting}
                  className="flex items-center gap-1 text-[#10B981] hover:text-[#059669] transition font-semibold"
                >
                  <FaArrowUp className="text-lg" /> {forum.votes?.up || 0}
                </button>
                <button
                  onClick={() => handleVote(forum._id, "downvote")}
                  disabled={voting}
                  className="flex items-center gap-1 text-[#EF4444] hover:text-[#DC2626] transition font-semibold"
                >
                  <FaArrowDown className="text-lg" /> {forum.votes?.down || 0}
                </button>
                <span className="text-sm text-gray-500">
                  Posted by{" "}
                  <span className="font-medium text-[#1E3A8A]">
                    {forum.author.name}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && pages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-12">
          <button
            disabled={page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-5 py-2 rounded-lg font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed bg-[#1D4ED8] hover:bg-[#2563EB] text-white shadow-md"
          >
            Previous
          </button>
          <span className="text-gray-800 font-medium">
            Page {page} of {pages}
          </span>
          <button
            disabled={page >= pages}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-5 py-2 rounded-lg font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed bg-[#1D4ED8] hover:bg-[#2563EB] text-white shadow-md"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ForumPage;
