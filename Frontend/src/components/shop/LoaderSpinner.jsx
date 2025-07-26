import { FaSpinner } from "react-icons/fa";

const LoadingSpinner = ({ message }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <FaSpinner className="animate-spin text-4xl text-green-600" />
      {message && (
        <p className="ml-4 text-lg text-gray-700">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
