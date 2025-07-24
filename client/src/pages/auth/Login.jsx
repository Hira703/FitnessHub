// src/pages/Login.jsx
import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Card } from "flowbite-react";
import { FcGoogle } from "react-icons/fc";
import { HiLockClosed, HiMail } from "react-icons/hi";
import axiosPublic from "../../api/axiosPublic"; // import axiosPublic
import { Helmet } from "react-helmet-async";

const Login = () => {
  const { loginUser, loginWithGoogle } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // Email/Password Login
  const onSubmit = async (data) => {
    const { email, password } = data;
    setLoading(true);
    try {
      await loginUser(email, password);
      Swal.fire("Success", "You have logged in successfully", "success");
      navigate(from, { replace: true });
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await loginWithGoogle();
      const user = userCredential.user;

      // Send user data to backend
      await axiosPublic.post("/users", {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL || "",
      });

      Swal.fire("Success", "Logged in with Google", "success");
      navigate(from, { replace: true });
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Helmet>
        <title>Login</title>
        <meta name="description" content="Welcome to Login page" />
      </Helmet>
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-200 flex items-center justify-center px-4 py-10">
      <Card className="max-w-md w-full border border-gray-300 shadow-xl rounded-2xl p-6">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Email</label>
            <div className="relative">
              <span className="absolute top-2.5 left-3 text-gray-500">
                <HiMail />
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email", { required: "Email is required" })}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Password</label>
            <div className="relative">
              <span className="absolute top-2.5 left-3 text-gray-500">
                <HiLockClosed />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                {...register("password", { required: "Password is required" })}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-100 py-2 rounded-lg text-gray-700 font-medium transition duration-300"
        >
          <FcGoogle size={20} /> Continue with Google
        </button>

        {/* Register link */}
        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline font-medium">Register</Link>
        </p>
      </Card>
    </div>
    </>
  );
};

export default Login;
