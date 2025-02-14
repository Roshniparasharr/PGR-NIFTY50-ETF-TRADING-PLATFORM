import React from "react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay with rgba for consistent opacity */}
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose} // Close modal when clicking outside
      ></div>

      {/* Modal Content */}
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96 relative z-50 transform transition-all duration-300 ease-in-out scale-100">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">{message}</h3>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;