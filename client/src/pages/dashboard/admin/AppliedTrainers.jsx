import React, { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../../api/axiosSecure";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';
import Loader from "../../../components/Loader";
import { Helmet } from "react-helmet-async";

// Fetch pending trainers
const fetchPendingTrainers = async () => {
  const res = await axiosSecure.get("/api/trainers", {
    params: { status: "pending" },
  });
  return res.data;
};

const AppliedTrainers = () => {
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Query to fetch trainers
  const { data: trainers = [], isLoading } = useQuery({
    queryKey: ["pendingTrainers"],
    queryFn: fetchPendingTrainers,
    staleTime: 5 * 60 * 1000,
  });

  // Mutation to confirm trainer
  const confirmMutation = useMutation({
    mutationFn: (id) => axiosSecure.patch(`/api/trainers/confirm/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingTrainers"]);
      Swal.fire("Success", "Trainer application approved!", "success");
    },
    onError: () => {
      Swal.fire("Error", "Failed to approve trainer.", "error");
    },
  });

  // Mutation to reject trainer
  const rejectMutation = useMutation({
    mutationFn: ({ id, feedback }) =>
      axiosSecure.patch(`/api/trainers/reject/${id}`, { feedback }),
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingTrainers"]);
      Swal.fire("Rejected", "Trainer has been rejected with feedback.", "info");
      setShowModal(false);
      setFeedback("");
    },
    onError: () => {
      Swal.fire("Error", "Failed to reject trainer.", "error");
    },
  });

  const handleRejectSubmit = () => {
    if (!feedback.trim()) {
      Swal.fire("Feedback Required", "Please provide feedback.", "warning");
      return;
    }
    rejectMutation.mutate({ id: selectedTrainer._id, feedback });
  };

  return (
    <>
     <Helmet>
        <title>Pending Trainer Applications</title>
        <meta name="description" content="Welcome to Login page" />
      </Helmet>
      
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
        Pending Trainer Applications
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
         <Loader></Loader>
        </div>
      ) : trainers.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No pending applications.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Name</th>
                <th className="px-6 py-3 text-left font-semibold">Email</th>
                <th className="px-6 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {trainers.map((trainer) => (
                <tr
                  key={trainer._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium">{trainer.fullName}</td>
                  <td className="px-6 py-4">{trainer.email}</td>
                  <td className="px-6 py-4 flex flex-wrap gap-2">
                    <button
                      className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                      onClick={() =>
                        navigate(`/trainer-details/${trainer._id}`)
                      }
                    >
                      <FaInfoCircle className="mr-1" /> View
                    </button>
                    <button
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      onClick={() => confirmMutation.mutate(trainer._id)}
                      disabled={confirmMutation.isPending}
                    >
                      {confirmMutation.isPending ? "Processing..." : "Accept"}
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      onClick={() => {
                        setSelectedTrainer(trainer);
                        setShowModal(true);
                      }}
                      disabled={rejectMutation.isPending}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Reject Trainer Application
            </h3>
            <p className="text-sm mb-2">
              <strong>Name:</strong> {selectedTrainer?.fullName}
            </p>
            <p className="text-sm mb-4">
              <strong>Email:</strong> {selectedTrainer?.email}
            </p>
            <textarea
              className="w-full border rounded-md p-2 h-24 resize-none"
              placeholder="Enter feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            ></textarea>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={() => {
                  setShowModal(false);
                  setFeedback("");
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleRejectSubmit}
                disabled={rejectMutation.isPending}
              >
                {rejectMutation.isPending ? "Submitting..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default AppliedTrainers;
