import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaEnvelopeOpenText, FaTrashAlt } from 'react-icons/fa';
import axiosSecure from '../../../api/axiosSecure';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Loader from '../../../components/Loader';

const COLORS = ['#1D4ED8', '#10B981', '#F59E0B', '#EF4444'];

const fetchSubscribers = async () => {
  const res = await axiosSecure.get('/api/newsletter/subscribers');
  return res.data;
};

const deleteSubscriber = async (id) => {
  const res = await axiosSecure.delete(`/api/newsletter/subscribers/${id}`);
  if (res.status !== 200) throw new Error('Failed to delete subscriber');
  return res.data;
};

const AllSubscribers = () => {
  const queryClient = useQueryClient();

  const {
    data: subscribers = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['subscribers'],
    queryFn: fetchSubscribers,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: deleteSubscriber,
    onSuccess: () => {
      queryClient.invalidateQueries(['subscribers']);
      Swal.fire('Deleted!', 'Subscriber has been removed.', 'success');
    },
    onError: () => {
      Swal.fire('Error!', 'Something went wrong while deleting.', 'error');
    },
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This subscriber will be removed permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
    });
    if (result.isConfirmed) mutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
       <Loader></Loader>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-600 py-12">
        Failed to load subscribers: {error.message}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <h2 className="text-3xl font-extrabold flex items-center gap-3 bg-gradient-to-r from-[#1D4ED8] via-[#10B981] to-[#F59E0B] bg-clip-text text-transparent">
          <FaEnvelopeOpenText className="text-[#10B981]" />
          Newsletter Subscribers
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Total Subscribers:{' '}
          <span className="font-semibold text-[#1D4ED8]">{subscribers.length}</span>
        </p>
      </div>

      {subscribers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No subscribers found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-xl rounded-xl bg-base-100 border border-gray-200 dark:border-gray-700">
          <table className="min-w-full table-auto text-sm md:text-base">
            <thead className="bg-gradient-to-r from-[#1D4ED8] via-[#10B981] to-[#F59E0B] text-white sticky top-0 z-10">
              <tr className="uppercase tracking-wide">
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Subscribed At</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber, index) => {
                const color = COLORS[index % COLORS.length];
                return (
                  <tr
                    key={subscriber._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-300"
                  >
                    <td className="p-3 text-left">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color }}
                          title={`Badge color for ${subscriber.name}`}
                        ></div>
                        <span className="font-medium">{index + 1}</span>
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-gray-800 dark:text-gray-200">
                      {subscriber.name}
                    </td>
                    <td className="p-3 text-blue-600 dark:text-blue-400 break-all">
                      {subscriber.email}
                    </td>
                    <td className="p-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {new Date(subscriber.subscribedAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(subscriber._id)}
                        className="bg-[#EF4444] hover:bg-red-600 text-white px-3 py-1.5 rounded-md shadow-md transition tooltip"
                        data-tip="Delete Subscriber"
                        disabled={mutation.isLoading}
                      >
                        <FaTrashAlt className="text-sm" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllSubscribers;
