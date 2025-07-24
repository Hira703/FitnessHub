import { useState } from "react";
import Swal from "sweetalert2";
import { FaTrashAlt } from "react-icons/fa";
import axiosSecure from "../api/axiosSecure";

const COLORS = ['#1D4ED8', '#10B981', '#F59E0B', '#EF4444'];

const TrainerSlotsTable = ({ slots, refetch }) => {
  const [deletingSlotId, setDeletingSlotId] = useState(null);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This slot will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: COLORS[3],
      cancelButtonColor: COLORS[0],
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingSlotId(id);
      const res = await axiosSecure.delete(`/api/slots/${id}`);

      Swal.fire({
        title: "Deleted!",
        text: res.data.message,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      refetch();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to delete the slot.",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setDeletingSlotId(null);
    }
  };

  return (
    <div className="px-6 py-8 bg-gray-50 min-h-screen">
      <h2
        className="text-3xl font-bold mb-8 text-center"
        style={{ color: COLORS[0] }}
      >
        Manage Your Slots
      </h2>

      <div className="overflow-x-auto rounded border border-gray-300 bg-white shadow-sm">
        <table className="w-full min-w-[700px] text-left text-gray-700 text-base border-collapse">
          <thead
            style={{ backgroundColor: COLORS[0], color: "white" }}
            className="uppercase text-sm font-semibold tracking-wide"
          >
            <tr>
              {["#", "Slot Name", "Time", "Class", "Status", "Booked By", "Actions"].map((header) => (
                <th
                  key={header}
                  className="px-5 py-3 border-b border-blue-300"
                  style={{ borderColor: "rgba(255, 255, 255, 0.3)" }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {slots.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-16 text-gray-400 italic border-b border-gray-200"
                >
                  No slots found. Add some slots to get started!
                </td>
              </tr>
            ) : (
              slots.map((slot, index) => {
                const bgColor = index % 2 === 0 ? "white" : "#f9fafb";
                return (
                  <tr
                    key={slot._id}
                    style={{ backgroundColor: bgColor }}
                    className="hover:bg-blue-100 transition-colors duration-150 border-b border-gray-200"
                  >
                    <td className="px-5 py-3 font-medium border-r border-gray-200">{index + 1}</td>

                    <td
                      className="px-5 py-3 capitalize font-semibold border-r border-gray-200"
                      style={{ color: COLORS[1] }}
                    >
                      {slot.slotName}
                    </td>

                    <td className="px-5 py-3 font-mono border-r border-gray-200">{slot.slotTime}</td>

                    <td className="px-5 py-3 border-r border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {slot.classIds?.map((cls) => (
                          <span
                            key={cls._id}
                            className="rounded-lg px-3 py-1 text-xs font-semibold text-white"
                            style={{ backgroundColor: COLORS[0] }}
                          >
                            {cls.className}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-5 py-3 text-center border-r border-gray-200">
                      <span
                        className="inline-block rounded-lg px-3 py-1 text-xs font-semibold"
                        style={{
                          backgroundColor: slot.isBooked ? COLORS[3] : COLORS[1],
                          color: "white",
                        }}
                      >
                        {slot.isBooked ? "Booked" : "Available"}
                      </span>
                    </td>

                    <td className="px-5 py-3 text-sm border-r border-gray-200">
                      {slot.isBooked && slot.bookedBy ? (
                        <div className="bg-blue-50 border border-blue-200 p-2 rounded-md">
                          <p className="font-semibold text-blue-700">{slot.bookedBy.fullName}</p>
                          <p className="text-gray-600">{slot.bookedBy.email}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400 block text-center">-</span>
                      )}
                    </td>

                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => handleDelete(slot._id)}
                        disabled={deletingSlotId === slot._id}
                        className="inline-flex items-center gap-2 px-4 py-1 rounded border border-red-600 text-red-600 font-semibold hover:bg-red-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaTrashAlt />
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrainerSlotsTable;
