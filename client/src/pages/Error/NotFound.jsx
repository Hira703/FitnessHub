import React from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import errorAnimation from "../../assets/lottie-json/404 error page with cat (1).json"; // adjust path as needed

const COLORS = ['#1D4ED8', '#10B981', '#F59E0B', '#EF4444'];

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-tr from-red-50 to-yellow-50 px-6">
      <div className="w-64 h-64 mb-8">
        <Lottie animationData={errorAnimation} loop={true} />
      </div>
      <h1
        className="text-6xl font-extrabold mb-4"
        style={{ color: COLORS[3] }}
      >
        Oops!
      </h1>
      <p className="text-xl text-gray-700 max-w-md text-center mb-10">
        The page you’re looking for doesn’t exist or an unexpected error occurred.
      </p>
      <Link
        to="/"
        style={{ backgroundColor: COLORS[0] }}
        className="px-8 py-3 rounded-lg text-white font-semibold shadow-lg hover:bg-indigo-700 transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default ErrorPage;
