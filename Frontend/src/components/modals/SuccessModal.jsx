import { FaCheck } from "react-icons/fa";

const SuccessModal = ({ title, message, onClose }) => (
  <div
    className="fixed inset-0 bg-transparent backdrop-blur-xs flex items-center justify-center z-50"
  >
    <div className="bg-white rounded-lg max-w-sm w-full shadow-sm p-5 text-center">
      <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-600 flex items-center justify-center shadow-xs text-white text-xl">
        <FaCheck />
      </div>

      <h3 className="text-lg font-semibold text-green-800 mb-2 select-none">
        {title}
      </h3>
      {message && (
        <p className="text-green-700 mb-4 text-sm max-w-xs mx-auto">
          {message}
        </p>
      )}

      <button
        onClick={onClose}
        className="inline-block px-4 py-1.5 bg-green-600 text-white font-medium rounded-md shadow-sm
                   hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1
                   transition active:scale-95"
        autoFocus
      >
        OK
      </button>
    </div>
  </div>
);

export default SuccessModal;
