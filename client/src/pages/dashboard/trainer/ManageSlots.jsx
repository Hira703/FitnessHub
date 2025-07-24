import { useContext } from "react";
import TrainerSlotsTable from "../../../components/TrainerSlotsTable";
import { AuthContext } from "../../../context/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../../api/axiosSecure";

const ManageSlots = () => {
  const { backendUser } = useContext(AuthContext);
  const trainerEmail = backendUser?.email;

  const { data: slots = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["slots", trainerEmail],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/slots/trainer/email", {
        params: { email: trainerEmail },
      });
      return res.data;
    },
    enabled: !!trainerEmail,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-red-600 text-center mt-10 font-medium">
        Error loading slots. Please try again later.
      </p>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-10 bg-white shadow-md rounded-xl min-h-screen">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-[#1D4ED8] border-b-4 border-[#10B981] inline-block pb-1">
        Manage Your Slots
      </h2>

      {slots.length === 0 ? (
        <p className="text-[#EF4444] text-center mt-10 text-base sm:text-lg font-medium">
          No slots found. Please add some to get started!
        </p>
      ) : (
        <TrainerSlotsTable slots={slots} refetch={refetch} />
      )}
    </div>
  );
};

export default ManageSlots;
