import React, { useContext, useState } from "react";
import Select from "react-select";
import { AuthContext } from "../../context/AuthProvider";
import axiosSecure from "../../api/axiosSecure";
import axiosPublic from "../../api/axiosPublic";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
const BeATrainer = () => {
  const { user } = useContext(AuthContext);
  const role = user?.role || "member";

  const [formData, setFormData] = useState({
    fullName: "",
    email: user?.email || "",
    age: "",
    yearsOfExperience: "",
    profileImage: null,
    skills: [],
    availableDays: [],
    availableTime: '', // Array of strings (time slots)
    otherInfo: "",
  });
  const [loading, setLoading] = useState(false);

  const skillsOptions = [
    { value: "yoga", label: "Yoga" },
    { value: "cardio", label: "Cardio" },
    { value: "strength", label: "Strength Training" },
    { value: "pilates", label: "Pilates" },
    { value: "crossfit", label: "CrossFit" },
    { value: "zumba", label: "Zumba" },
    { value: "aerobics", label: "Aerobics" },
    { value: "hiit", label: "HIIT" },
    { value: "kickboxing", label: "Kickboxing" },
    { value: "meditation", label: "Meditation" },
  ];
  

  const daysOptions = [
    { value: "Sun", label: "Sunday" },
    { value: "Mon", label: "Monday" },
    { value: "Tue", label: "Tuesday" },
    { value: "Wed", label: "Wednesday" },
    { value: "Thu", label: "Thursday" },
    { value: "Fri", label: "Friday" },
    { value: "Sat", label: "Saturday" },
  ];

  const handleAvailableTimeChange = (e) => {
    const times = e.target.value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setFormData({ ...formData, availableTime: times });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Front-end validation
    if (formData.skills.length === 0) {
      return Swal.fire("Missing Field", "Please select at least one skill.", "warning");
    }
    if (formData.availableDays.length === 0) {
      return Swal.fire("Missing Field", "Please select at least one available day.", "warning");
    }
    if (!formData.availableTime.length) {
      return Swal.fire("Missing Field", "Please specify available time.", "warning");
    }
    if (!formData.profileImage) {
      return Swal.fire("Missing Image", "Please upload a profile image.", "warning");
    }
    if (!formData.yearsOfExperience) {
      return Swal.fire("Missing Field", "Please enter your years of experience.", "warning");
    }
  
    setLoading(true);
  
    try {
      // Upload image to Cloudinary
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
      const apiBaseUrl = import.meta.env.VITE_CLOUDINARY_API_BASE_URL;
  
      const imageData = new FormData();
      imageData.append("file", formData.profileImage);
      imageData.append("upload_preset", uploadPreset);
  
      const uploadRes = await axiosPublic.post(
        `${apiBaseUrl}/${cloudName}/image/upload`,
        imageData
      );
  
      const uploaded = uploadRes.data;
      if (!uploaded.secure_url) throw new Error("Image upload failed.");
  
      // Prepare trainer data
      const trainerData = {
        userId: user._id,
        fullName: formData.fullName.trim(),
        email: formData.email.toLowerCase().trim(),
        age: Number(formData.age),
        yearsOfExperience: Number(formData.yearsOfExperience),
        profileImageUrl: uploaded.secure_url,
        skills: formData.skills.map((s) => s.value),
        availableDays: formData.availableDays.map((d) => d.value),
        availableTime: formData.availableTime,
        otherInfo: formData.otherInfo.trim(),
        status: "pending",
      };
  
      const saveRes = await axiosSecure.post("/api/trainers", trainerData);
  
      if (saveRes.status === 200 || saveRes.status === 201) {
        Swal.fire("Success", "Your trainer application has been submitted!", "success");
        setFormData({
          fullName: "",
          email: user?.email || "",
          age: "",
          yearsOfExperience: "",
          profileImage: null,
          skills: [],
          availableDays: [],
          availableTime: [],
          otherInfo: "",
        });
      }
    } catch (err) {
      console.error(err);
  
      if (err.response && err.response.status === 400) {
        // Duplicate submission or validation error
        Swal.fire("Already Applied", err.response.data.message, "info");
      } else {
        Swal.fire("Error", "Something went wrong. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };
  
  

  if (!user)
    return <p className="text-center mt-6">Please log in to apply as a trainer.</p>;

  if (role === "trainer")
    return (
      <div className="max-w-xl mx-auto mt-10 bg-yellow-100 text-yellow-800 border border-yellow-300 p-6 rounded">
        <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
        <p className="text-sm">
          You are already registered as a trainer. This form is only for new
          applicants.
        </p>
      </div>
    );

  return (
    <>
     <Helmet>
        <title>Be a Trainer</title>
        <meta name="description" content="Welcome to Be a Trainer page" />
      </Helmet>
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow py-16"
    >
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-700  ">
        Be a Trainer
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            required
            minLength={3}
            maxLength={100}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="block mb-1 font-medium">Email (read-only)</label>
          <input
            type="email"
            value={formData.email}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        {/* Age */}
        <div>
          <label className="block mb-1 font-medium">Age</label>
          <input
            type="number"
            min={16}
            max={100}
            value={formData.age}
            onChange={(e) =>
              setFormData({ ...formData, age: e.target.value })
            }
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Years of Experience */}
        <div>
          <label className="block mb-1 font-medium">Years of Experience</label>
          <input
            type="number"
            min={0}
            max={80}
            value={formData.yearsOfExperience}
            onChange={(e) =>
              setFormData({ ...formData, yearsOfExperience: e.target.value })
            }
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Available Time (comma-separated) */}
        <div>
  <label className="block mb-1 font-medium">Available Time</label>
  <input
    type="text"
    placeholder="e.g., 9 AM - 12 PM, 2 PM - 5 PM"
    value={formData.availableTime}
    onChange={(e) =>
      setFormData({ ...formData, availableTime: e.target.value })
    }
    required
    className="w-full p-2 border rounded"
  />
</div>


        {/* Skills */}
        <div className="md:col-span-1">
          <label className="block mb-1 font-medium">Skills</label>
          <Select
            options={skillsOptions}
            isMulti
            onChange={(selected) =>
              setFormData({ ...formData, skills: selected || [] })
            }
            className="react-select-container"
            classNamePrefix="react-select"
            value={formData.skills}
          />
        </div>

        {/* Available Days */}
        <div className="md:col-span-1">
          <label className="block mb-1 font-medium">Available Days</label>
          <Select
            options={daysOptions}
            isMulti
            closeMenuOnSelect={false}
            onChange={(selected) =>
              setFormData({ ...formData, availableDays: selected || [] })
            }
            className="react-select-container"
            classNamePrefix="react-select"
            value={formData.availableDays}
          />
        </div>
      </div>

      {/* Profile Image Upload */}
      <div className="mt-6">
        <label
          htmlFor="profileImage"
          className="block mb-1 font-medium text-gray-700"
        >
          Profile Image
        </label>
        <input
          id="profileImage"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {/* Other Info */}
      <div className="mt-6">
        <label className="block mb-1 font-medium">Other Info</label>
        <textarea
          rows={4}
          maxLength={500}
          value={formData.otherInfo}
          onChange={(e) =>
            setFormData({ ...formData, otherInfo: e.target.value })
          }
          className="w-full p-2 border rounded resize-none"
          placeholder="Anything else you'd like us to know..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-8 w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </form>
    </>
  );
};

export default BeATrainer;
