import { useLocation, useParams } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import CheckoutForm from "../../components/CheckoutForm";
import axiosSecure from "../../api/axiosSecure";
import { ImSpinner2 } from "react-icons/im";
import Loader from "../../components/Loader";

const stripePromise = loadStripe("pk_test_51Rg3qRIEw3M6eUMZgYG7cUWZhthnJcPfIwUVP4xnyIDzT3rjxnadMzwxOdY6TE818tKnI0J9IyWFCcHUk99N6S8500ARhY03xb");

const PaymentPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const slot = searchParams.get("slot");
  const selectedPackage = searchParams.get("package");
  const classId = searchParams.get("classId");

  const [amount, setAmount] = useState(0);

  // 💳 Set amount based on selectedPackage
  useEffect(() => {
    if (selectedPackage === "Basic") setAmount(10);
    else if (selectedPackage === "Standard") setAmount(50);
    else if (selectedPackage === "Premium") setAmount(100);
  }, [selectedPackage]);

  // 📦 Fetch trainer details using TanStack Query
  const {
    data: trainerData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["trainer", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/trainers/${id}`);
      return res.data;
    },
    enabled: !!id, // ensure query runs only when id is available
  });

  const trainer = trainerData?.trainer;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader></Loader>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-red-500 font-semibold">
        Failed to load trainer info: {error.message}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-[#1D4ED8]">
        Payment for {trainer?.fullName}'s {selectedPackage} Package
      </h2>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md mb-6 space-y-2 text-gray-800 dark:text-gray-200">
        <p>
          <strong>Slot:</strong> {slot}
        </p>
        <p>
          <strong>Package:</strong> {selectedPackage}
        </p>
        <p>
          <strong>Amount:</strong> ${amount}
        </p>
      </div>

      <Elements stripe={stripePromise}>
        <CheckoutForm
          trainerId={id}
          trainerName={trainer?.fullName}
          slot={slot}
          selectedPackage={selectedPackage}
          amount={amount}
          classId={classId}
        />
      </Elements>
    </div>
  );
};

export default PaymentPage;
