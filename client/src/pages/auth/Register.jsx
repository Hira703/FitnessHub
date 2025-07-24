// src/pages/Register.jsx
import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Card } from "flowbite-react";
import axiosPublic from "../../api/axiosPublic";  // Import axiosPublic instance
import "sweetalert2/dist/sweetalert2.min.css";

const Register = () => {
  const { registerUser, updateUserProfile } = useContext(AuthContext);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    const { name, email, photoURL, password } = data;
    setLoading(true);

    try {
      // Register user with Firebase Auth
      const userCredential = await registerUser(email, password);
      // Update profile info on Firebase user
      await updateUserProfile(name, photoURL);

      // Send user data to backend to save in MongoDB
      await axiosPublic.post("/users", { name, email, photoURL });

      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Welcome to the Fitness Club 🎉",
        confirmButtonColor: "#3b82f6",
      });

      reset();
      navigate("/");
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.response?.data?.message || error.message,
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Helmet>
        <title>Register</title>
        <meta name="description" content="Welcome to Trainers page" />
      </Helmet>
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-xl border border-gray-200 rounded-2xl">
        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6">Create Fitness Account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block font-medium text-gray-700">Photo URL</label>
            <input
              type="url"
              {...register("photoURL", { required: "Photo URL is required" })}
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://image.com/profile.jpg"
            />
            {errors.photoURL && <p className="text-red-500 text-sm">{errors.photoURL.message}</p>}
          </div>

          <div>
            <label className="block font-medium text-gray-700">Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 characters" },
              })}
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-300"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-center text-sm mt-3 text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </form>
      </Card>
    </div>
    </>
  );
};

export default Register;
