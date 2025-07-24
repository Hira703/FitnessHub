import React from "react";

const Modal = ({ title, children, onClose }) => {
  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-semibold mb-4">{title}</h3>
          <div>{children}</div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
      </div>
    </>
  );
};

export default Modal;
