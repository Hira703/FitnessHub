import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../context/AuthProvider";
import Modal from "../../../components/Modal";
import axiosSecure from "../../../api/axiosSecure";
import { FaEye } from "react-icons/fa";
import Loader from "../../../components/Loader";

const COLORS = {
  default: "#1D4ED8",  // blue
  approved: "#10B981", // green (not shown but kept for completeness)
  pending: "#F59E0B",  // amber
  rejected: "#EF4444", // red
};

const ActivityLog = () => {
  const { backendUser } = useContext(AuthContext);
  const memberEmail = backendUser?.email;
  const [selectedRejection, setSelectedRejection] = useState(null);

  const {
    data: applications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["applications", memberEmail],
    enabled: !!memberEmail,
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/trainers/member/${memberEmail}`);
      return res.data;
    },
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2
        className="text-3xl font-bold mb-8 text-center"
        style={{ color: COLORS.default }}
      >
        My Activity Log
      </h2>

      {isLoading ? (
      <div className="flex justify-center items-center h-72 sm:h-96">
        <Loader></Loader></div>
      ) : error ? (
        <p className="text-lg text-red-500 text-center">Error fetching data.</p>
      ) : applications.length === 0 ? (
        <p className="text-lg text-center" style={{ color: COLORS.pending }}>
          No activity found. You haven’t applied for any slots yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300 shadow-md rounded-md">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-base">
                <th className="border border-gray-300 px-4 py-3 text-left">Status</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Name</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Skills</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Experience (yrs)</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Submitted On</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => {
                const statusKey = app.status?.toLowerCase();
                const badgeColor = COLORS[statusKey] || COLORS.default;
                const submittedDate = app?.createdAt
                  ? new Date(app.createdAt).toLocaleDateString()
                  : "N/A";

                return (
                  <tr key={app._id} className="hover:bg-gray-50 transition-all">
                    <td className="border border-gray-300 px-4 py-3 capitalize">
                      <span
                        className="px-3 py-1 rounded-full text-white text-sm font-semibold"
                        style={{ backgroundColor: badgeColor }}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">{app.fullName}</td>
                    <td className="border border-gray-300 px-4 py-3">
                      {app.skills?.join(", ") || "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-3">{app.yearsOfExperience}</td>
                    <td className="border border-gray-300 px-4 py-3">{submittedDate}</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      {statusKey === "rejected" && app.feedback && (
                        <button
                          onClick={() => setSelectedRejection(app.feedback)}
                          title="View rejection message"
                          className="text-blue-600 hover:text-blue-800 transition"
                        >
                          <FaEye className="inline-block w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedRejection && (
        <Modal onClose={() => setSelectedRejection(null)} title="Rejection Message">
          <p className="text-gray-700 text-base">{selectedRejection}</p>
          <button
            onClick={() => setSelectedRejection(null)}
            className="mt-4 px-4 py-2 rounded text-white hover:brightness-90 transition"
            style={{ backgroundColor: COLORS.default }}
          >
            Close
          </button>
        </Modal>
      )}
    </div>
  );
};

export default ActivityLog;
