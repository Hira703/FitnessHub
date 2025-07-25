import { useState } from "react";
import axiosSecure from "../../../api/axiosSecure";
import Swal from "sweetalert2";

const CreateCoupon = () => {
  const [code, setCode] = useState("");
  const [percentOff, setPercentOff] = useState("");
  const [amountOff, setAmountOff] = useState("");
  const [duration, setDuration] = useState("once");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const couponData = {
      code,
      duration,
      percentOff: percentOff ? Number(percentOff) : null,
      amountOff: amountOff ? Number(amountOff) : null,
    };

    try {
      const res = await axiosSecure.post("/api/coupons/create-coupon", couponData);

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Coupon Created",
          text: "✅ Coupon created successfully!",
          timer: 2000,
          showConfirmButton: false,
        });

        // Reset form
        setCode("");
        setPercentOff("");
        setAmountOff("");
        setDuration("once");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: res.data.message || "Something went wrong.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to create coupon.",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputBaseStyle =
    "w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition";

  return (
    <div className="max-w-xl mx-auto p-8 bg-white shadow-xl rounded-xl dark:bg-gray-900 transition-all duration-300">
      <h2 className="text-3xl font-extrabold mb-8 text-[#1D4ED8] text-center select-none">
        Create New Coupon
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Coupon Code */}
        <div>
          <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Coupon Code
          </label>
          <input
            type="text"
            placeholder="Enter coupon code"
            className={`${inputBaseStyle} focus:ring-[#1D4ED8] focus:border-transparent`}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            required
          />
        </div>

        {/* Percent Off */}
        <div>
          <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Percent Off (%)
          </label>
          <input
            type="number"
            placeholder="1 - 100"
            className={`${inputBaseStyle} focus:ring-[#10B981] focus:border-transparent`}
            value={percentOff}
            onChange={(e) => setPercentOff(e.target.value)}
            disabled={!!amountOff}
            min="1"
            max="100"
          />
        </div>

        {/* Amount Off */}
        <div>
          <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Amount Off ($)
          </label>
          <input
            type="number"
            placeholder="Enter amount in dollars"
            className={`${inputBaseStyle} focus:ring-[#10B981] focus:border-transparent`}
            value={amountOff}
            onChange={(e) => setAmountOff(e.target.value)}
            disabled={!!percentOff}
            min="1"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Duration
          </label>
          <select
            className={`${inputBaseStyle} focus:ring-[#F59E0B] focus:border-transparent cursor-pointer`}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value="once">Once</option>
            <option value="repeating">Repeating</option>
            <option value="forever">Forever</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-md bg-[#1D4ED8] hover:bg-[#1e40af] text-white font-semibold shadow-md transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Coupon"}
        </button>
      </form>
    </div>
  );
};

export default CreateCoupon;
