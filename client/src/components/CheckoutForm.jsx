import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../api/axiosSecure"; // Make sure this is your secured Axios instance
import Loader from "./Loader";

const CheckoutForm = ({
  trainerId,
  trainerName,
  slot, // slotId
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

  // ✅ Fetch slot info using TanStack Query
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

  // ✅ Handle slot availability and time
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

  //  Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Double-check slot availability before payment
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

      // Step 1: Create payment intent
      const { data: intentData } = await axiosSecure.post(
        "/api/payments/create-payment-intent",
        { price: amount }
      );

      const clientSecret = intentData.clientSecret;

      // Step 2: Confirm payment
      const card = elements.getElement(CardElement);
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

      if (paymentResult.error) {
        Swal.fire("Payment Failed", paymentResult.error.message, "error");
      } else {
        if (paymentResult.paymentIntent.status === "succeeded") {
          setPaymentSuccess("Payment successful!");

          // Step 3: Save payment info
          await axiosSecure.post("/api/payments/save-payment", {
            trainerId,
            trainerName,
            slotId: slot,
            slot: slotTime,
            package: selectedPackage,
            price: amount,
            paymentIntentId: paymentResult.paymentIntent.id,
            classId,
            userName: backendUser.name,
            userEmail: backendUser.email,
          });

          // Step 4: Mark slot as booked
          await axiosSecure.patch(`/api/slots/${slot}/book`, {
            isBooked: true,
            bookedBy: backendUser._id,
          });

          Swal.fire("Success", "Payment completed and slot booked!", "success");
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      Swal.fire("Error", error.message || "Something went wrong.", "error");
    }

    setLoading(false);
  };

  if (isSlotLoading) {
    return <Loader></Loader>;
  }

  if (isError) {
    return <p className="text-center text-red-500">Error loading slot info: {error.message}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-4 border rounded" />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        {loading ? "Processing..." : `Pay $${amount}`}
      </button>

      {paymentSuccess && (
        <p className="text-green-600 font-semibold text-center">{paymentSuccess}</p>
      )}
    </form>
  );
};

export default CheckoutForm;
