const KhaltiButton = ({ amount, onSuccess }) => {
  const handlePay = () => {
    // Mock Khalti process — replace with real SDK logic
    alert("Redirecting to Khalti...");
    setTimeout(() => {
      alert("Payment Success");
      onSuccess();
    }, 1500);
  };

  return (
    <button
      onClick={handlePay}
      className="w-full bg-[#5C2D91] text-white py-2 rounded hover:bg-[#4a2178] transition"
    >
      Pay with Khalti
    </button>
  );
};

export default KhaltiButton;
