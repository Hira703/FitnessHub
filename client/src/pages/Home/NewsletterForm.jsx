import { useState } from 'react';
import Swal from 'sweetalert2';
import { FaPaperPlane } from 'react-icons/fa';

import axiosPublic from '../../api/axiosPublic';

const COLORS = ['#1D4ED8', '#10B981', '#F59E0B', '#EF4444'];

const NewsletterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      Swal.fire('Error', 'Please enter both name and email.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const res = await axiosPublic.post('/api/newsletter/subscribe', { name, email });
      Swal.fire('Success!', res.data.message, 'success');
      setName('');
      setEmail('');
    } catch (err) {
      console.error(err);
      const message = err?.response?.data?.message || 'Something went wrong.';
      Swal.fire('Error', message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-10 bg-white shadow-2xl rounded-3xl mt-16 border border-blue-100 animate-fadeIn">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
        Subscribe to Our Newsletter
      </h2>
      <p className="text-gray-600 mb-6 text-sm md:text-base">
        Get the latest updates on fitness tips, classes, and more delivered straight to your inbox!
      </p>
      <form onSubmit={handleSubscribe} className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className={`w-full flex items-center justify-center gap-2 py-3 text-white rounded-xl font-semibold text-lg transition-transform transform hover:scale-105 shadow-md`}
          style={{
            background: `linear-gradient(to right, ${COLORS[0]}, ${COLORS[1]})`,
          }}
          disabled={submitting}
        >
          <FaPaperPlane className="text-white" />
          {submitting ? 'Subscribing...' : 'Subscribe Now'}
        </button>
      </form>
    </div>
  );
};

export default NewsletterForm;
