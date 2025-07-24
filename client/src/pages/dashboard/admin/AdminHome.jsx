import {
  FaUsers,
  FaEnvelopeOpenText,
  FaUserTie,
  FaClipboardList,
  FaWallet,
  FaChalkboardTeacher,
  FaBan,
} from 'react-icons/fa';
import axiosSecure from '../../../api/axiosSecure';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';

const COLORS = ['#1D4ED8', '#10B981', '#F59E0B', '#EF4444'];

// Custom label renderer for pie slices - places label inside slice
const renderCustomLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent,
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
      fontSize={14}
    >
      {(percent * 100).toFixed(0)}%
    </text>
  );
};

// Fetch function for React Query
const fetchStats = async () => {
  const res = await axiosSecure.get('/api/users/overview');
  return res.data;
};

const AdminHome = () => {
  const { data: stats, isLoading, isError, error } = useQuery({
    queryKey: ['adminStats'],
    queryFn: fetchStats,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const trainerStatusData = stats
    ? [
        { name: 'Approved', value: stats.approvedTrainers, color: COLORS[1] },
        { name: 'Pending', value: stats.pendingTrainers, color: COLORS[2] },
        { name: 'Rejected', value: stats.rejectedTrainers, color: COLORS[3] },
      ]
    : [];

  const subscriberMemberData = stats
    ? [
        { name: 'Subscribers', value: stats.totalSubscribers, color: COLORS[0] },
        { name: 'Members', value: stats.totalMembers, color: COLORS[1] },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-72 sm:h-96">
        <span className="loading loading-bars loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-red-600">
        Failed to load data: {error.message}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-indigo-700 mb-10">
        Admin Dashboard Overview
      </h2>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard icon={<FaEnvelopeOpenText />} label="Subscribers" value={stats.totalSubscribers} color={COLORS[0]} />
        <StatCard icon={<FaUserTie />} label="Total Trainers" value={stats.totalTrainers} color={COLORS[1]} />
        <StatCard icon={<FaClipboardList />} label="Pending Trainers" value={stats.pendingTrainers} color={COLORS[2]} />
        <StatCard icon={<FaBan />} label="Rejected Trainers" value={stats.rejectedTrainers} color={COLORS[3]} />
        <StatCard icon={<FaWallet />} label="Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} color={COLORS[0]} />
        <StatCard icon={<FaUsers />} label="Members" value={stats.totalMembers} color={COLORS[1]} />
        <StatCard icon={<FaChalkboardTeacher />} label="Classes" value={stats.totalClasses} color={COLORS[2]} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <ChartCard title="Trainer Application Status">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={trainerStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                label={renderCustomLabel}
                labelLine={false}
              >
                {trainerStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Applications']} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Subscribers vs Members">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subscriberMemberData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                label={renderCustomLabel}
                labelLine={false}
              >
                {subscriberMemberData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Count']} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div
    className="flex items-center gap-4 p-4 sm:p-6 rounded-xl shadow hover:shadow-lg transition-shadow bg-white min-w-0"
  >
    <div
      className="text-2xl sm:text-3xl p-3 rounded-lg text-white flex justify-center items-center shrink-0"
      style={{ backgroundColor: color }}
    >
      {icon}
    </div>
    <div className="truncate">
      <p className="text-sm sm:text-base text-gray-500 font-medium">{label}</p>
      <p className="text-lg sm:text-2xl font-bold text-gray-900 break-words">{value}</p>
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow p-4 sm:p-6 w-full min-h-[350px]">
    <h3 className="text-lg sm:text-xl font-semibold mb-4 text-indigo-700">{title}</h3>
    {children}
  </div>
);

export default AdminHome;
