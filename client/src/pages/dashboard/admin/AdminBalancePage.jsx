import React from "react";
import axiosSecure from "../../../api/axiosSecure";
import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Loader from "../../../components/Loader";
import { Helmet } from "react-helmet-async";

const COLORS = ["#1D4ED8", "#10B981", "#F59E0B", "#EF4444"];

const fetchOverview = async () => {
  const res = await axiosSecure.get("/api/payments/overview");
  return res.data;
};

export default function AdminBalancePage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: fetchOverview,
  });

  // Customized label function for Pie slices
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontWeight="bold"
        fontSize={16}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  

  if (isLoading) {
    return (
      <main className="flex justify-center items-center min-h-screen bg-gradient-to-tr from-blue-100 to-green-100">
        <Loader></Loader>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex justify-center items-center min-h-screen bg-gradient-to-tr from-blue-100 to-green-100">
        <p className="text-red-600 text-lg font-semibold">
          Error: {error.message || "Failed to load data."}
        </p>
      </main>
    );
  }

  if (!data) return null;

  const { totalBalance, recentPayments, newsletterCount, paidMembersCount } = data;

  const chartData = [
    { name: "Newsletter Subscribers", value: newsletterCount },
    { name: "Paid Members", value: paidMembersCount },
  ];

  return (
    <>
     <Helmet>
        <title>Admin | Dashboard</title>
        <meta name="description" content="Welcome to Login page" />
      </Helmet>
    <main className="max-w-7xl mx-auto px-4 py-10 bg-gradient-to-tr from-blue-50 to-red-50 min-h-screen">
      {/* Title */}
      <h1 className="text-4xl font-extrabold mb-8 text-center text-[#1D4ED8] drop-shadow">
        Financial Overview
      </h1>

      {/* Total Balance */}
      <section className="mb-10 p-6 sm:p-8 bg-white rounded-xl shadow-lg border border-[#1D4ED8] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-semibold text-[#10B981] mb-1">
            Total Remaining Balance
          </h2>
          <p className="text-5xl font-extrabold text-[#1D4ED8] tracking-tight">
            ${totalBalance.toFixed(2)}
          </p>
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="bg-white rounded-xl shadow-lg border border-[#F59E0B] p-6 mb-12 overflow-x-auto">
        <h3 className="text-3xl font-semibold text-[#F59E0B] mb-6 border-b pb-2">
          Last 6 Transactions
        </h3>
        <table className="min-w-full text-base border-collapse border border-gray-200">
          <thead className="bg-yellow-50">
            <tr>
              <th className="border px-4 py-2 text-left text-[#F59E0B]">User Name</th>
              <th className="border px-4 py-2 text-left text-[#F59E0B]">Amount ($)</th>
              <th className="border px-4 py-2 text-left text-[#F59E0B]">Booking Date</th>
            </tr>
          </thead>
          <tbody>
            {recentPayments.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-400 italic">
                  No transactions found.
                </td>
              </tr>
            ) : (
              recentPayments.map(({ _id, userName, price, bookingDate }) => (
                <tr key={_id} className="hover:bg-gray-50 transition">
                  <td className="border px-4 py-3 text-gray-700">{userName}</td>
                  <td className="border px-4 py-3 text-gray-900 font-semibold">
                    ${price.toFixed(2)}
                  </td>
                  <td className="border px-4 py-3 text-gray-600">
                    {new Date(bookingDate).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* Pie Chart */}
      <section className="bg-white rounded-xl shadow-lg border border-[#EF4444] p-6 sm:p-8 flex flex-col items-center">
        <h3 className="text-3xl font-semibold mb-6 text-[#EF4444] text-center">
          Subscribers vs Paid Members
        </h3>
        <div className="w-full flex justify-center overflow-x-auto">
        <PieChart width={320} height={320}>
  <Pie
    data={chartData}
    cx="50%"
    cy="50%"
    innerRadius={80}
    outerRadius={120}
    paddingAngle={2}   // smaller gap between slices, adjust as needed
    dataKey="value"
    label={renderCustomizedLabel}
    labelLine={false}  // no connecting lines
  >
    {chartData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip />
  <Legend verticalAlign="bottom" height={36} />
</PieChart>

        </div>
      </section>
    </main>
    </>
  );
}
