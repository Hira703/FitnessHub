import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaTrashAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axiosSecure from '../../../api/axiosSecure';
import 'sweetalert2/dist/sweetalert2.min.css';
import Loader from '../../../components/Loader';

const COLORS = ['#1D4ED8', '#10B981', '#F59E0B', '#EF4444']; // Blue, Green, Amber, Red

// Query function to get approved trainers
const fetchApprovedTrainers = async () => {
  const res = await axiosSecure.get('/api/trainers?status=approved');
  return res.data;
};

// Mutation function to remove trainer
const removeTrainer = async (id) => {
  const res = await axiosSecure.delete(`/api/trainers/remove/${id}`);
  if (res.status !== 200) {
    throw new Error(res.data.message || 'Failed to remove trainer.');
  }
  return res.data;
};

const Trainers = () => {
  const queryClient = useQueryClient();

  const {
    data: trainers = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['approvedTrainers'],
    queryFn: fetchApprovedTrainers,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: removeTrainer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvedTrainers'] });
      Swal.fire('Removed!', 'Trainer has been demoted to member.', 'success');
    },
    onError: (err) => {
      Swal.fire('Error!', err.message, 'error');
    },
  });

  const handleRemoveTrainer = async (trainer) => {
    const confirm = await Swal.fire({
      title: `Remove ${trainer.fullName}?`,
      text: 'They will be demoted to a member.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: COLORS[3], // red
      cancelButtonColor: COLORS[0],  // blue
      confirmButtonText: 'Yes, remove',
    });

    if (confirm.isConfirmed) {
      mutation.mutate(trainer._id);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-4xl font-bold text-center mb-8 text-transparent bg-gradient-to-r from-blue-700 via-green-500 to-yellow-400 bg-clip-text">
        All Trainers
      </h2>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader></Loader>
        </div>
      ) : isError ? (
        <div className="text-center text-red-600 py-10">
          Failed to load trainers: {error.message}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg bg-white border border-gray-200">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-green-500 text-white">
                <th className="py-4 px-6 text-left text-sm font-semibold">#</th>
                <th className="py-4 px-6 text-left text-sm font-semibold">Name</th>
                <th className="py-4 px-6 text-left text-sm font-semibold">Email</th>
                <th className="py-4 px-6 text-left text-sm font-semibold">Status</th>
                <th className="py-4 px-6 text-left text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {trainers.length > 0 ? (
                trainers.map((trainer, index) => (
                  <tr
                    key={trainer._id}
                    className={`transition duration-300 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-blue-50'
                    }`}
                  >
                    <td className="py-3 px-6 text-sm">{index + 1}</td>
                    <td className="py-3 px-6 text-sm font-medium text-gray-800">{trainer.fullName}</td>
                    <td className="py-3 px-6 text-sm text-gray-600">{trainer.email}</td>
                    <td className="py-3 px-6 text-sm font-semibold capitalize">
                      <span
                        className="px-3 py-1 rounded-full text-white"
                        style={{ backgroundColor: COLORS[1] }} // Green for approved
                      >
                        {trainer.status}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <button
                        onClick={() => handleRemoveTrainer(trainer)}
                        className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-full transition"
                        title="Remove Trainer"
                        disabled={mutation.isLoading}
                      >
                        <FaTrashAlt className="text-lg" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500 text-sm">
                    No trainers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Trainers;
