import { FaTimes, FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";

const CartHeader = ({ onClose }) => {
    const itemCount = useSelector((state) => state.cartCount.itemCount);
  return (
    <div className="bg-[#8BA88F] text-white p-4 border-b">
      <div className="flex items-center justify-between">
        {/* Cart Icon and Title */}
        <div className="flex items-center gap-3">
          <FaShoppingCart className="text-lg" />
          <div>
            <h2 className="text-lg font-semibold">Your Cart</h2>
            <p className="text-sm text-[#e4eadd]">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-1 hover:bg-[#7a967e] rounded transition-colors"
        >
          <FaTimes className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default CartHeader;
