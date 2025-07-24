import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeadCell,
  Button,
  Modal,
  Textarea,
  Spinner,
} from "flowbite-react";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosSecure from "../api/axiosSecure";
import { useQuery } from "@tanstack/react-query";

const fetchPendingTrainers = async () => {
  const res = await axiosSecure.get("/api/trainers", {
    params: { status: "pending" },
  });
  return res.data;
};

const AppliedTrainers = () => {
  const navigate = useNavigate();

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [processing, setProcessing] = useState(false);

  const {
    data: trainers = [],
    isLoading,
    isError,
    refetch,
    error,
  } = useQuery({
    queryKey: ["pendingTrainers"],
    queryFn: fetchPendingTrainers,
    staleTime: 5 * 60 * 1000,
  });

  const handleConfirm = async (id) => {
    setProcessing(true);
    try {
      await axiosSecure.post(`/api/trainers/confirm/${id}`);
      refetch(); // Refresh trainer list
    } catch (error) {
      console.error(error);
    }
    setProcessing(false);
  };

  const handleRejectClick = (trainer) => {
    setSelectedTrainer(trainer);
    setFeedback("");
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!feedback.trim()) {
      alert("Please provide rejection feedback.");
      return;
    }
    setProcessing(true);
    try {
      await axiosSecure.post(`/api/trainers/reject/${selectedTrainer._id}`, {
        feedback,
      });
      setShowRejectModal(false);
      refetch(); // Refresh after rejection
    } catch (error) {
      console.error(error);
    }
    setProcessing(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spinner size="xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-600 py-6">
        Error loading trainers: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
        Pending Trainer Applications
      </h1>

      {trainers.length === 0 ? (
        <p className="text-center text-gray-500">No pending applications.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
          <Table hoverable striped>
            <TableHead>
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell>Email</TableHeadCell>
              <TableHeadCell>Age</TableHeadCell>
              <TableHeadCell>Skills</TableHeadCell>
              <TableHeadCell>Available Days</TableHeadCell>
              <TableHeadCell>Actions</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {trainers.map((trainer) => (
                <TableRow
                  key={trainer._id}
                  className="bg-white dark:bg-gray-800 transition hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <TableCell className="font-medium">
                    {trainer.fullName}
                  </TableCell>
                  <TableCell>{trainer.email}</TableCell>
                  <TableCell>{trainer.age}</TableCell>
                  <TableCell>
                    {trainer.skills.slice(0, 3).join(", ")}
                    {trainer.skills.length > 3 && "…"}
                  </TableCell>
                  <TableCell>
                    {trainer.availableDays.join(", ")}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="xs"
                        color="info"
                        onClick={() =>
                          navigate(`/admin/trainer-details/${trainer._id}`)
                        }
                        title="View Details"
                      >
                        <FaInfoCircle className="mr-1" /> View
                      </Button>
                      <Button
                        size="xs"
                        color="success"
                        onClick={() => handleConfirm(trainer._id)}
                        disabled={processing}
                        title="Confirm"
                      >
                        <FaCheckCircle className="mr-1" /> Confirm
                      </Button>
                      <Button
                        size="xs"
                        color="failure"
                        onClick={() => handleRejectClick(trainer)}
                        disabled={processing}
                        title="Reject"
                      >
                        <FaTimesCircle className="mr-1" /> Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Rejection Modal */}
      <Modal
        show={showRejectModal}
        size="md"
        popup
        onClose={() => setShowRejectModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Reject Trainer Application
          </h3>
          {selectedTrainer && (
            <div className="space-y-3">
              <p>
                <strong>Name:</strong> {selectedTrainer.fullName}
              </p>
              <p>
                <strong>Email:</strong> {selectedTrainer.email}
              </p>
              <p>
                <strong>Skills:</strong> {selectedTrainer.skills.join(", ")}
              </p>
              <p>
                <strong>Available Days:</strong>{" "}
                {selectedTrainer.availableDays.join(", ")}
              </p>

              <Textarea
                placeholder="Enter rejection feedback"
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              />

              <div className="flex justify-end space-x-2 mt-4">
                <Button color="gray" onClick={() => setShowRejectModal(false)}>
                  Cancel
                </Button>
                <Button
                  color="failure"
                  onClick={handleRejectSubmit}
                  disabled={processing}
                >
                  {processing ? "Submitting..." : "Submit Feedback & Reject"}
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AppliedTrainers;
