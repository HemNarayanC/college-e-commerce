const Modal = ({ open, title, message, success, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
        <h3 className={`text-lg font-semibold mb-2 ${success ? "text-green-600" : "text-red-600"}`}>
          {title}
        </h3>
        <p className="text-gray-700 text-sm">{message}</p>
        <div className="text-right mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
