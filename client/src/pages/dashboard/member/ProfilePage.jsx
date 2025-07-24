import { useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../context/AuthProvider";
import {
  HiOutlineMail,
  HiOutlineUserCircle,
  HiCamera,
  HiPhone,
  HiLocationMarker,
  HiCalendar,
} from "react-icons/hi";
import { Button, Label, TextInput, Select, Textarea } from "flowbite-react";
import axiosSecure from "../../../api/axiosSecure";
import Swal from "sweetalert2";

const COLORS = {
  primary: "#1D4ED8",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
};

const fetchUserProfile = async (email) => {
  const res = await axiosSecure.get(`/api/users/${email}`);
  return res.data;
};

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const email = user?.email || "";
  const lastLogin = user?.metadata?.lastSignInTime || "N/A";

  const {
    data: backendUser,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userProfile", email],
    queryFn: () => fetchUserProfile(email),
    enabled: !!email,
  });

  const [formData, setFormData] = useState({
    name: "",
    photoURL: "",
    phone: "",
    address: "",
    gender: "Other",
    dateOfBirth: "",
    bio: "",
  });

  useEffect(() => {
    if (backendUser) {
      setFormData({
        name: backendUser.name || "",
        photoURL: backendUser.photoURL || "",
        phone: backendUser.phone || "",
        address: backendUser.address || "",
        gender: backendUser.gender || "Other",
        dateOfBirth: backendUser.dateOfBirth
          ? backendUser.dateOfBirth.slice(0, 10)
          : "",
        bio: backendUser.bio || "",
      });
    }
  }, [backendUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosSecure.put(`/api/users/${email}`, formData);
      const data = res.data;
      if (data.modifiedCount > 0 || data.message === "User updated successfully") {
        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your profile has been updated successfully!",
          confirmButtonColor: COLORS.success,
        });
      } else {
        Swal.fire({
          icon: "info",
          title: "No Changes",
          text: "No changes were made to your profile.",
          confirmButtonColor: COLORS.warning,
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update profile.",
        confirmButtonColor: COLORS.danger,
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-10 bg-white dark:bg-gray-900 shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: COLORS.primary }}>
        My Profile
      </h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center lg:w-1/3 text-center">
          <div className="relative w-36 h-36">
            <img
              src={formData.photoURL || "https://i.ibb.co/2kR2YvM/default-avatar.png"}
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover border-4"
              style={{ borderColor: COLORS.primary }}
            />
            <div className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow-md">
              <HiCamera className="text-xl" style={{ color: COLORS.success }} />
            </div>
          </div>
          <h3 className="text-xl mt-4 font-semibold text-gray-800 dark:text-white">{formData.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{email}</p>
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <Label htmlFor="name" value="Full Name" />
            <TextInput
              icon={HiOutlineUserCircle}
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="photoURL" value="Profile Picture URL" />
            <TextInput
              icon={HiCamera}
              name="photoURL"
              id="photoURL"
              value={formData.photoURL}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="phone" value="Phone Number" />
            <TextInput
              icon={HiPhone}
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 555 123 4567"
            />
          </div>

          <div>
            <Label htmlFor="address" value="Address" />
            <TextInput
              icon={HiLocationMarker}
              name="address"
              id="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main St, Anytown, USA"
            />
          </div>

          <div>
            <Label htmlFor="gender" value="Gender" />
            <Select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="dateOfBirth" value="Date of Birth" />
            <TextInput
              icon={HiCalendar}
              name="dateOfBirth"
              type="date"
              id="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              max={new Date().toISOString().slice(0, 10)}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="bio" value="Bio" />
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us a bit about yourself..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="email" value="Email" />
            <TextInput
              icon={HiOutlineMail}
              id="email"
              type="email"
              value={email}
              readOnly
              className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
            />
          </div>

          <div>
            <Label htmlFor="lastLogin" value="Last Login" />
            <TextInput
              id="lastLogin"
              type="text"
              value={lastLogin}
              readOnly
              className="bg-gray-100 dark:bg-gray-700"
            />
          </div>

          <div className="md:col-span-2">
            <Button
              type="submit"
              className="w-full"
              style={{
                backgroundColor: COLORS.primary,
                color: "#fff",
              }}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
