import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../api/axiosSecure";
import Loader from "./Loader";

const COLORS = ['#1D4ED8', '#10B981', '#F59E0B', '#EF4444'];

const CheckoutForm = ({
  trainerId,
  trainerName,
  slot,
  selectedPackage,
  amount,
  classId,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { backendUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [finalAmount, setFinalAmount] = useState(amount);
  const [clientSecret, setClientSecret] = useState(null);

  const {
    data: slotData,
    isLoading: isSlotLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["slotData", slot],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/slots/${slot}`);
      return res.data;
    },
    enabled: !!slot,
  });

  useEffect(() => {
    if (slotData?.isBooked) {
      Swal.fire({
        icon: "error",
        title: "Slot Already Booked",
        text: "Sorry! This slot has already been booked by another user.",
      });
    }

    if (slotData?.slotName) {
      setSlotTime(slotData.slotName);
    }
  }, [slotData]);

  const applyCouponAndCreateIntent = async () => {
    setLoading(true);
    try {
      const { data } = await axiosSecure.post("/api/payments/create-payment-intent", {
        price: amount,
        couponCode: couponCode.trim() || null,
      });

      setFinalAmount(parseFloat(data.finalAmount));
      setClientSecret(data.clientSecret);

      Swal.fire("Coupon Applied!", `Final Price: $${data.finalAmount}`, "success");
    } catch (error) {
      Swal.fire("Invalid Coupon", error?.response?.data?.error || "Try again", "error");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const slotCheckRes = await axiosSecure.get(`/api/slots/${slot}`);
      const latestSlotData = slotCheckRes.data;

      if (latestSlotData?.isBooked) {
        Swal.fire({
          icon: "error",
          title: "Slot Already Booked",
          text: "This slot was just booked by someone else. Please choose another slot.",
        });
        setLoading(false);
        return;
      }

      if (!clientSecret) {
        Swal.fire("Error", "Please apply coupon or initiate payment intent first.", "error");
        setLoading(false);
        return;
      }

      const card = elements.getElement(CardElement);
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

      if (paymentResult.error) {
        Swal.fire("Payment Failed", paymentResult.error.message, "error");
      } else if (paymentResult.paymentIntent.status === "succeeded") {
        setPaymentSuccess("Payment successful!");

        await axiosSecure.post("/api/payments/save-payment", {
          trainerId,
          trainerName,
          slotId: slot,
          slot: slotTime,
          package: selectedPackage,
          price: finalAmount,
          couponCode,
          paymentIntentId: paymentResult.paymentIntent.id,
          classId,
          userName: backendUser.name,
          userEmail: backendUser.email,
        });

        await axiosSecure.patch(`/api/slots/${slot}/book`, {
          isBooked: true,
          bookedBy: backendUser._id,
        });

        Swal.fire("Success", "Payment completed and slot booked!", "success");
      }
    } catch (error) {
      console.error("Payment error:", error);
      Swal.fire("Error", error.message || "Something went wrong.", "error");
    }

    setLoading(false);
  };

  if (isSlotLoading) return <Loader />;
  if (isError) return <p className="text-center text-red-500">Error loading slot: {error.message}</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg mx-auto transition-all duration-300"
    >
      {/* Coupon Code */}
      <input
        type="text"
        placeholder="Enter coupon code"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      />

      {/* Apply Coupon Button */}
      <button
        type="button"
        onClick={applyCouponAndCreateIntent}
        disabled={loading || !stripe}
        className="w-full bg-[#10B981] hover:bg-green-700 text-white font-semibold py-3 rounded-md transition duration-200"
      >
        Apply Coupon
      </button>

      {/* Card Element */}
      <div className="rounded-md border border-gray-300 dark:border-gray-600 p-4 bg-gray-50 dark:bg-gray-800">
        <CardElement />
      </div>

      {/* Pay Button */}
      <button
        type="submit"
        disabled={!stripe || loading || !clientSecret}
        className="w-full bg-[#1D4ED8] hover:bg-blue-800 text-white font-semibold py-3 rounded-md transition duration-200"
      >
        {loading ? "Processing..." : `Pay $${finalAmount.toFixed(2)}`}
      </button>

      {/* Success Message */}
      {paymentSuccess && (
        <p className="text-[#10B981] font-medium text-center">{paymentSuccess}</p>
      )}
    </form>
  );
};

export default CheckoutForm;
