import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../context/AuthProvider";
import Swal from "sweetalert2";
import axiosSecure from "../../../api/axiosSecure";
import Loader from "../../../components/Loader";
import { Helmet } from "react-helmet-async";

const AddNewSlot = () => {
  const { backendUser } = useContext(AuthContext);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [slotName, setSlotName] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [notes, setNotes] = useState("");

  const {
    data: trainerData,
    isLoading: loadingTrainer,
    error: trainerError,
  } = useQuery({
    queryKey: ["trainer", backendUser?.email],
    queryFn: async () => {
      if (!backendUser?.email) return null;
      const res = await axiosSecure.get("/api/trainers/email", {
        params: { email: backendUser.email },
      });
      return res.data;
    },
    enabled: !!backendUser?.email,
  });

  const {
    data: classes,
    isLoading: loadingClasses,
    error: classesError,
  } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/classes");
      return res.data.classes;
    },
  });

  useEffect(() => {
    if (trainerData?.availableDays) {
      const labelMap = {
        Mon: "Monday",
        Tue: "Tuesday",
        Wed: "Wednesday",
        Thu: "Thursday",
        Fri: "Friday",
        Sat: "Saturday",
        Sun: "Sunday",
      };

      const formattedDays = trainerData.availableDays.map((day) => ({
        value: day,
        label: labelMap[day] || day,
      }));

      setSelectedDays(formattedDays);
    }
  }, [trainerData]);

  const classOptions = classes?.map((cls) => ({
    value: cls._id,
    label: cls.className,
  })) || [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!trainerData?._id) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Trainer data is missing. Please try again later.",
      });
      return;
    }

    const payload = {
      trainerId: trainerData._id,
      slotName,
      slotTime,
      days: selectedDays.map((day) => day.value),
      classIds: selectedClasses.map((cls) => cls.value),
      notes,
    };

    try {
      const res = await axiosSecure.post("/api/slots", payload);

      Swal.fire({
        icon: "success",
        title: "Slot Created!",
        text: "The slot has been successfully added.",
      });

      // Reset form
      setSlotName("");
      setSlotTime("");
      setSelectedDays([]);
      setSelectedClasses([]);
      setNotes("");
    } catch (error) {
      if (error.response?.status === 409) {
        Swal.fire({
          icon: "warning",
          title: "Duplicate Slot",
          text: error.response.data?.message || "Slot already exists!",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to Create Slot",
          text: error.message || "Something went wrong!",
        });
      }
    }
  };

  if (loadingTrainer || loadingClasses) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
       <Loader></Loader>
      </div>
    );
  }

  if (trainerError || classesError) {
    return (
      <p className="text-red-600 font-semibold">
        Error loading data. Please try again later.
      </p>
    );
  }


  return (
    <>
     <Helmet>
        <title>Add New Slot</title>
        <meta name="description" content="Welcome to Login page" />
      </Helmet>
    <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg mt-6">
      <h2 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-8">
        🕒 Add New Slot
      </h2>

      {trainerData ? (
  <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
    {/* Trainer Profile */}
    <div className="flex flex-col items-center mb-8">
      <img
        src={trainerData.profileImageUrl}
        alt="Trainer Profile"
        className="w-28 h-28 rounded-full border-4 border-blue-600 shadow-lg object-cover"
      />
      <h2 className="mt-3 text-2xl font-semibold text-blue-700 dark:text-blue-400">{trainerData.fullName}</h2>
    </div>

    {/* Read-only Trainer Info Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { label: "Full Name", value: trainerData.fullName },
        { label: "Email", value: trainerData.email },
        { label: "Age", value: trainerData.age },
        { label: "Experience (Years)", value: trainerData.yearsOfExperience },
        { label: "Available Time", value: trainerData.availableTime },
        { label: "Skills", value: trainerData.skills?.join(", ") },
      ].map((field, i) => (
        <div key={i}>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            {field.label}
          </label>
          <input
            type="text"
            value={field.value}
            disabled
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-4 py-2 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}
    </div>
{/* Available Days (Read-only) */}
<div>
  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
    Available Days
  </label>
  <div className="flex flex-wrap gap-2 bg-blue-50 dark:bg-blue-900 p-3 rounded-md">
    {selectedDays.map((day) => (
      <span
        key={day.value}
        className="bg-blue-200 text-blue-800 font-semibold px-3 py-1 rounded-full text-sm"
      >
        {day.label}
      </span>
    ))}
  </div>
</div>

         {/* Slot Info */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  <div>
    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
      Slot Name
    </label>
    <input
      type="text"
      className="w-full px-5 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-transparent transition"
      placeholder="e.g. Morning Slot"
      value={slotName}
      onChange={(e) => setSlotName(e.target.value)}
      required
    />
  </div>
  <div>
    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
      Slot Duration
    </label>
    <input
      type="text"
      className="w-full px-5 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-transparent transition"
      placeholder="e.g. 1 Hour"
      value={slotTime}
      onChange={(e) => setSlotTime(e.target.value)}
      required
    />
  </div>
</div>

{/* Classes Include */}
<div className="mt-8">
  <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
    Classes Include
  </label>
  <Select
    options={classOptions}
    isMulti
    value={selectedClasses}
    onChange={setSelectedClasses}
    className="react-select-container text-base"
    classNamePrefix="react-select"
    placeholder="Select one or more classes"
    styles={{
      control: (base, state) => ({
        ...base,
        backgroundColor: "#f9fafb", // light bg
        borderColor: state.isFocused ? "#3b82f6" : "#d1d5db", // blue border on focus
        borderRadius: "0.5rem",
        padding: "3px",
        boxShadow: state.isFocused ? "0 0 0 3px rgba(59, 130, 246, 0.4)" : "none",
        transition: "border-color 0.2s ease",
        minHeight: 45,
      }),
      multiValue: (styles) => ({
        ...styles,
        backgroundColor: "#bfdbfe", // Tailwind blue-200
      }),
      multiValueLabel: (styles) => ({
        ...styles,
        color: "#1e3a8a", // Tailwind blue-900
        fontWeight: "600",
      }),
      placeholder: (styles) => ({
        ...styles,
        color: "#93c5fd", // Tailwind blue-300
      }),
    }}
  />
</div>

{/* Other Info */}
<div className="mt-8">
  <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
    Other Info
  </label>
  <textarea
    rows={5}
    className="w-full px-5 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-transparent transition resize-none"
    placeholder="Any additional info or notes..."
    value={notes}
    onChange={(e) => setNotes(e.target.value)}
  ></textarea>
</div>

{/* Submit Button */}
<div className="text-center mt-10">
  <button
    type="submit"
    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 focus:ring-4 focus:ring-blue-400 focus:outline-none"
  >
    ➕ Add Slot
  </button>
</div>

        </form>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-300">
          Loading trainer data...
        </p>
      )}
    </div>
    </>
  );
};

export default AddNewSlot;
