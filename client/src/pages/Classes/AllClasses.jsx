import React, { useState } from 'react';
import ClassCard from '../../components/ClassCard';
import { FaSearch } from 'react-icons/fa';
import { MdLocationOn, MdSchool } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../../api/axiosSecure'; 
import axiosPublic from '../../api/axiosPublic';

const COLORS = ['#1D4ED8', '#10B981', '#F59E0B', '#EF4444'];

const fetchClasses = async ({ queryKey }) => {
  const [_key, { search, sort, levelFilter, locationFilter, page }] = queryKey;

  const params = new URLSearchParams({
    search,
    sort,
    page,
    limit: 6,
    ...(levelFilter && { level: levelFilter }),
    ...(locationFilter && { location: locationFilter }),
  });

  const res = await axiosPublic.get(`/api/classes?${params.toString()}`);
  return res.data;
};

const AllClasses = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['classes', { search, sort, levelFilter, locationFilter, page }],
    queryFn: fetchClasses,
    keepPreviousData: true,
    enabled: true, 
  });

  const classes = data?.classes || [];
  const pages = data?.pages || 1;

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSortChange = (value) => {
    setSort(value);
    setPage(1);
  };
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-10 text-[#1D4ED8]">Explore All Classes</h1>

      {/* Filters & Search */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {/* Search Input */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search classes or skills..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400"
        >
          <option value="">Sort by</option>
          <option value="bookings">🔥 Most Popular</option>
          <option value="name">A-Z Name</option>
        </select>

        {/* Level Filter */}
        <div className="relative">
          <MdSchool className="absolute left-3 top-3 text-gray-400" />
          <select
            value={levelFilter}
            onChange={(e) => {
              setLevelFilter(e.target.value);
              setPage(1);
            }}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Location Filter */}
        <div className="relative">
          <MdLocationOn className="absolute left-3 top-3 text-gray-400" />
          <select
            value={locationFilter}
            onChange={(e) => {
              setLocationFilter(e.target.value);
              setPage(1);
            }}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-400"
          >
            <option value="">All Locations</option>
            <option value="Online">Online</option>
            <option value="In-person">In-person</option>
          </select>
        </div>
      </div>

      {/* Classes */}
      {isLoading ? (
        <p className="text-center text-gray-500">Loading classes...</p>
      ) : isError ? (
        <p className="text-center text-red-500">Error: {error.message}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => (
              <ClassCard key={classItem._id} classItem={classItem} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-10 flex justify-center items-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
            >
              Prev
            </button>

            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 rounded text-sm border ${
                  page === i + 1
                    ? `bg-[${COLORS[0]}] text-white`
                    : 'bg-white hover:bg-gray-100 text-gray-700'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
              disabled={page === pages}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AllClasses;
