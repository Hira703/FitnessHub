import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaUser, FaClock, FaCheckCircle } from "react-icons/fa";
import axiosSecure from "../../api/axiosSecure"; // Adjust path as needed

const TrainerBookedPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const slot = searchParams.get("slotId");

  const [selectedPackage, setSelectedPackage] = useState("Basic");

  // Fetch trainer data using useQuery
  const {
    data: trainerData,
    isLoading: loadingTrainer,
    error: trainerError,
  } = useQuery({
    queryKey: ["trainer", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/trainers/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // Fetch slot info using useQuery
  const {
    data: slotInfoData,
    isLoading: loadingSlot,
    error: slotError,
  } = useQuery({
    queryKey: ["slot", slot],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/slots/${slot}`);
      return res.data;
    },
    enabled: !!slot,
  });

  const trainer = trainerData?.trainer || null;
  const classes = trainerData?.classes || [];
  const slotInfo = slotInfoData || null;

  const packages = [
    {
      name: "Basic",
      price: "$10",
      benefits: [
        "Access during regular hours",
        "Cardio & strength equipment",
        "Locker room & showers",
      ],
    },
    {
      name: "Standard",
      price: "$50",
      benefits: [
        "All Basic benefits",
        "Group fitness classes",
        "Yoga, Spinning, Zumba",
      ],
    },
    {
      name: "Premium",
      price: "$100",
      benefits: [
        "All Standard benefits",
        "Personal training sessions",
        "Sauna, steam room, massage discounts",
      ],
    },
  ];

  const handleJoinNow = () => {
    if (!classes || classes.length === 0) {
      Swal.fire({
        icon: "error",
        title: "No Classes Available",
        text: "This trainer does not offer any classes at the moment.",
      });
      return;
    }

    const classOptions = classes
      .map((c) => `<option value="${c._id}">📘 ${c.className}</option>`)
      .join("");

    Swal.fire({
      title: "🎓 Choose a Class",
      html: `
      <div style="text-align: left;">
        <label for="class-select" style="display: block; font-weight: bold; margin-bottom: 8px;">
          Available Classes:
        </label>
        <select id="class-select" class="swal2-select" style="
          width: 100%;
          padding: 0.6em;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 1em;
          background-color: #f9f9f9;
        ">
          ${classOptions}
        </select>
      </div>
    `,
      focusConfirm: false,
      confirmButtonText: "➡ Next",
      cancelButtonText: "Cancel",
      showCancelButton: true,
      customClass: {
        confirmButton: "swal2-confirm btn btn-primary",
        cancelButton: "swal2-cancel btn btn-secondary",
      },
      preConfirm: () => {
        const selectedClassId = Swal.getPopup().querySelector("#class-select").value;
        if (!selectedClassId) {
          Swal.showValidationMessage("Please select a class");
        }
        return selectedClassId;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const chosenClassId = result.value;

        Swal.fire({
          title: "✅ Confirm Membership",
          html: `
          <p style="margin-bottom: 0.5em;">
            Proceed to pay for the <strong>${selectedPackage}</strong> package and join your selected class?
          </p>
        `,
          icon: "info",
          confirmButtonText: "Yes, Continue",
          cancelButtonText: "Cancel",
          showCancelButton: true,
          showCloseButton: true,
        }).then((confirmResult) => {
          if (confirmResult.isConfirmed) {
            navigate(
              `/payment/${id}?slot=${slot}&package=${selectedPackage}&classId=${chosenClassId}`
            );
          }
        });
      }
    });
  };

  if (loadingTrainer) {
    return (
      <div className="text-center py-20 text-lg font-semibold">
        Loading booking details...
      </div>
    );
  }

  if (trainerError) {
    return (
      <div className="text-center py-20 text-lg font-semibold text-red-600">
        Error loading trainer data.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      {/* Trainer and Slot Info */}
      <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold flex items-center gap-3 mb-2">
          <FaUser /> {trainer.fullName}
        </h2>
        <p className="flex items-center gap-2 text-lg">
          <FaClock /> Selected Slot:{" "}
          <span className="font-medium underline">
            {slotInfo?.slotName || "Loading..."}
          </span>
        </p>
      </div>

      {/* Available Classes */}
      <div>
        <h3 className="text-2xl font-semibold mb-6 text-center">Available Classes</h3>
        {classes && classes.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {classes.map((cls) => (
              <div
                key={cls._id}
                className="bg-white rounded-lg border shadow hover:shadow-lg transition cursor-pointer"
                onClick={() =>
                  Swal.fire({
                    title: cls.className,
                    html: `
                      <img src="${cls.image}" alt="${cls.className}" class="w-full h-40 object-cover rounded mb-4" />
                      <p><strong>Skill:</strong> ${cls.skill}</p>
                      <p><strong>Level:</strong> ${cls.level}</p>
                      <p><strong>Duration:</strong> ${cls.duration}</p>
                      <p><strong>Details:</strong> ${cls.details}</p>
                    `,
                    showCloseButton: true,
                    showCancelButton: false,
                    focusConfirm: false,
                    confirmButtonText: 'Close'
                  })
                }
              >
                <img
                  src={cls.image}
                  alt={cls.className}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h4 className="text-lg font-bold mb-1">{cls.className}</h4>
                  <p className="text-gray-600 text-sm mb-2">{cls.skill} | {cls.level}</p>
                  <p className="text-gray-700 text-sm truncate">{cls.details}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No classes offered by this trainer yet.</p>
        )}
      </div>

      {/* Packages */}
      <div>
        <h3 className="text-2xl font-bold mb-6 text-center">Choose a Package</h3>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              onClick={() => setSelectedPackage(pkg.name)}
              className={`relative cursor-pointer bg-white rounded-2xl border transition-all duration-300 ease-in-out shadow-md hover:shadow-xl p-6 
                ${
                  selectedPackage === pkg.name
                    ? "border-blue-600 ring-2 ring-blue-300 bg-blue-50"
                    : "border-gray-200"
                }`}
            >
              {selectedPackage === pkg.name && (
                <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                  Selected
                </span>
              )}

              <h3 className="text-2xl font-bold text-gray-800 mb-2">{pkg.name} Membership</h3>
              <div className="text-3xl font-extrabold text-blue-600 mb-4">{pkg.price}</div>
              <ul className="text-gray-700 space-y-2 mb-6">
                {pkg.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <FaCheckCircle className="text-green-500 mt-1" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleJoinNow}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Join Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainerBookedPage;
