import { FaShoppingBag, FaShippingFast, FaUndo } from "react-icons/fa";

const EmptyCart = ({ onClose }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      {/* Empty Cart Icon */}
      <div className="w-20 h-20 bg-[#f1f4ef] rounded-full flex items-center justify-center mb-4 shadow-sm">
        <FaShoppingBag className="text-3xl text-[#8F9779]" />
      </div>

      {/* Message */}
      <h3 className="text-lg font-bold text-[#486e40] mb-2">Your cart is empty</h3>
      <p className="text-[#8F9779] mb-6 text-sm max-w-sm">
        Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
      </p>

      {/* Continue Shopping Button */}
      <button
        onClick={onClose}
        className="bg-[#64973f] hover:bg-[#688d4f] text-white px-6 py-2.5 rounded-lg font-semibold shadow-sm transition-all"
      >
        Continue Shopping
      </button>

      {/* Features */}
      <div className="mt-6 grid grid-cols-2 gap-4 w-full max-w-xs">
        <div className="text-center">
          <div className="w-10 h-10 bg-[#e7f5dc] rounded-lg flex items-center justify-center mx-auto mb-2">
            <FaShippingFast className="text-[#64973f]" />
          </div>
          <span className="text-xs text-[#486e40] font-medium">Free Shipping</span>
        </div>

        <div className="text-center">
          <div className="w-10 h-10 bg-[#f3fbe6] rounded-lg flex items-center justify-center mx-auto mb-2">
            <FaUndo className="text-[#688d4f]" />
          </div>
          <span className="text-xs text-[#486e40] font-medium">Easy Returns</span>
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;
