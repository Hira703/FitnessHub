import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../../../api/axiosSecure';

import Swal from 'sweetalert2';

const COLORS = ['#1D4ED8', '#10B981', '#F59E0B', '#EF4444'];

const fetchClasses = async ({ queryKey }) => {
  const [_key, { search, page, limit }] = queryKey;
  const res = await axiosSecure.get(`/api/classes`, {
    params: { search, page, limit },
  });
  return res.data;
};

const ManageClasses = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['classes', { search, page, limit }],
    queryFn: fetchClasses,
    keepPreviousData: true,
  });

  const classes = data?.classes || [];
  const totalPages = data?.pages || 1;


  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This class will be permanently deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444', // Tailwind red-500
      cancelButtonColor: '#1D4ED8',  // Tailwind blue-700
      confirmButtonText: 'Yes, delete it!',
    });
  
    if (!result.isConfirmed) return;
  
    try {
      const res = await axiosSecure.delete(`/api/classes/${id}`);
      if (res.status === 200) {
        Swal.fire('Deleted!', 'The class has been deleted.', 'success');
        refetch();
      } else {
        Swal.fire('Failed', 'Could not delete the class.', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Something went wrong while deleting.', 'error');
    }
  };
  

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-2xl sm:text-3xl font-extrabold mb-6"
          style={{ color: COLORS[0] }}
        >
          📚 Manage Classes
        </h2>

        {/* Search input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by class or skill..."
            className="w-full max-w-md p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: COLORS[0], outlineColor: COLORS[0] }}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Table */}
        {isLoading ? (
          <p className="text-center py-10 text-gray-600">Loading...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md bg-white">
            <table className="w-full text-left min-w-[640px] text-sm sm:text-base">
              <thead style={{ backgroundColor: COLORS[0] }} className="text-white">
                <tr>
                  <th className="p-4">#</th>
                  <th className="p-4">Class Name</th>
                  <th className="p-4">Skill</th>
                  <th className="p-4">Trainers</th>
                  <th className="p-4 text-center">Bookings</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cls, i) => (
                  <tr
                    key={cls._id}
                    className="border-t hover:bg-gray-100 transition"
                  >
                    <td className="p-4">{(page - 1) * limit + i + 1}</td>
                    <td className="p-4 font-medium text-gray-900">{cls.className}</td>
                    <td className="p-4 capitalize text-gray-700">{cls.skill}</td>
                    <td className="p-4 text-gray-600">
                      {cls.trainers?.map(t => t.fullName).join(', ') || 'N/A'}
                    </td>
                    <td className="p-4 text-center text-gray-800 font-semibold">
                      {cls.bookingCount}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(cls._id)}
                        className="px-3 py-1 rounded text-white text-sm sm:text-base"
                        style={{ backgroundColor: COLORS[3] }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {classes.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center p-6 text-gray-500">
                      No classes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 rounded text-white"
            style={{ backgroundColor: COLORS[0] }}
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="text-gray-700 text-sm sm:text-base">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 rounded text-white"
            style={{ backgroundColor: COLORS[0] }}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageClasses;
