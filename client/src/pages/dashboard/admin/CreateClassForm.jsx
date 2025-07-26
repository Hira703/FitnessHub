import React, { useState } from 'react';
import axiosSecure from '../../../api/axiosSecure';
import axiosPublic from '../../../api/axiosPublic';
import { Helmet } from 'react-helmet-async';

const skillOptions = [
  { value: 'yoga', label: 'Yoga' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'strength', label: 'Strength Training' },
  { value: 'pilates', label: 'Pilates' },
  { value: 'crossfit', label: 'CrossFit' },
  { value: 'zumba', label: 'Zumba' },
  { value: 'aerobics', label: 'Aerobics' },
  { value: 'hiit', label: 'HIIT' },
  { value: 'kickboxing', label: 'Kickboxing' },
  { value: 'meditation', label: 'Meditation' },
];

const levelOptions = ['Beginner', 'Intermediate', 'Advanced'];

const CreateClassForm = () => {
  const [className, setClassName] = useState('');
  const [skill, setSkill] = useState('');
  const [details, setDetails] = useState('');
  const [duration, setDuration] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [location, setLocation] = useState('Online');
  const [equipmentNeeded, setEquipmentNeeded] = useState('');
  const [capacity, setCapacity] = useState(20);
  const [language, setLanguage] = useState('English');
  const [trainers, setTrainers] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;

  const uploadImage = async () => {
    if (!imageFile) {
      setError('Please select an image');
      return null;
    }

    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const res = await axiosPublic.post(CLOUDINARY_URL, formData);
      const data = res.data;

      if (data.secure_url) {
        setImageUrl(data.secure_url);
        return data.secure_url;
      } else {
        setError('Image upload failed');
        return null;
      }
    } catch (err) {
      setError('Error uploading image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!className.trim() || !skill) {
      setError('Class name and skill are required');
      return;
    }

    setSubmitting(true);

    const uploadedUrl = await uploadImage();
    if (!uploadedUrl) {
      setSubmitting(false);
      return;
    }

    const newClass = {
      className,
      skill,
      details,
      duration,
      level,
      location,
      equipmentNeeded: equipmentNeeded.split(',').map((e) => e.trim()),
      capacity: Number(capacity),
      language,
      trainers: trainers.split(',').map((id) => id.trim()),
      image: uploadedUrl,
    };

    try {
      const res = await axiosSecure.post('/api/classes', newClass);

      if (res.status === 201 || res.status === 200) {
        setSuccessMsg('✅ Class added successfully!');
        setClassName('');
        setSkill('');
        setDetails('');
        setDuration('');
        setLevel('Beginner');
        setLocation('Online');
        setEquipmentNeeded('');
        setCapacity(20);
        setLanguage('English');
        setTrainers('');
        setImageFile(null);
        setImageUrl('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add class');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
     <Helmet>
        <title>Fitness Club | Add New Class</title>
        <meta name="description" content="Welcome to Login page" />
      </Helmet>
    <div className="max-w-5xl mx-auto p-6 sm:p-10 bg-white rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Add New Class</h2>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      {successMsg && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{successMsg}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-full md:col-span-1">
          <label className="block font-medium text-gray-700 mb-1">Class Name *</label>
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            placeholder="e.g. Power Yoga"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Skill / Category *</label>
          <select
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          >
            <option value="" disabled>
              -- Select Skill --
            </option>
            {skillOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Duration</label>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            placeholder="e.g. 1 hour"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Level</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          >
            {levelOptions.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            placeholder="e.g. Online / Studio A"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Capacity</label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            min={1}
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Language</label>
          <input
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            placeholder="e.g. English"
          />
        </div>

        <div className="col-span-full">
          <label className="block font-medium text-gray-700 mb-1">Equipment Needed</label>
          <input
            type="text"
            value={equipmentNeeded}
            onChange={(e) => setEquipmentNeeded(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            placeholder="Comma-separated (e.g., Yoga mat, Dumbbells)"
          />
        </div>


        <div className="col-span-full">
          <label className="block font-medium text-gray-700 mb-1">Details *</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border rounded"
            required
          ></textarea>
        </div>

        <div className="col-span-full">
  <label className="block font-medium text-gray-700 mb-1">
    Class Image <span className="text-red-500">*</span>
  </label>

  <div
    className="relative w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition duration-300"
  >
    <input
      type="file"
      accept="image/*"
      onChange={(e) => setImageFile(e.target.files[0])}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      required
    />
    <div className="flex flex-col items-center justify-center pointer-events-none">
      <svg
        className="w-12 h-12 text-gray-400 mb-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M7 16v-4m0 0L3 12m4 0l4-4m6 4v4m0 0l4-4m-4 4l-4-4M3 21h18" />
      </svg>
      <p className="text-gray-500">
        <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
      </p>
      <p className="text-xs text-gray-400 mt-1">Only image files are allowed</p>
    </div>
  </div>

  {uploading && (
    <p className="text-blue-500 mt-2 animate-pulse">Uploading image...</p>
  )}

  {imageFile && !imageUrl && (
    <p className="mt-2 text-sm text-gray-600">
      Selected file: <span className="font-medium">{imageFile.name}</span>
    </p>
  )}

  {imageUrl && (
    <div className="mt-4">
      <img
        src={imageUrl}
        alt="Preview"
        className="rounded-lg w-full max-h-64 object-contain border"
      />
    </div>
  )}
</div>

        <div className="col-span-full">
          <button
            type="submit"
            disabled={uploading || submitting}
            className="w-full py-3 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Add Class'}
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default CreateClassForm;
