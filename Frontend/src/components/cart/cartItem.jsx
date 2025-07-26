import { useRef, useState } from "react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { toast } from "react-toastify";
import { updateCart, removeFromCart } from "../../api/cartApi";

const CartItem = ({ item, isLast, onCartChange, token }) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [loading, setLoading] = useState(false);
  const itemRef = useRef(null);

  console.log("Items in CartItem Page", item);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await removeFromCart({
        token,
        cartId: item.cartId,
      });
      toast.info(`${item.productId.name || item.name} removed from cart.`);
      onCartChange?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item.");
      setIsRemoving(false);
    }
  };

  const handleUpdateQuantity = async (newQuantity) => {
    if (newQuantity < 1) return;
    setLoading(true);
    try {
      console.log("Hello",item.productId, item.variantId)
      await updateCart({
        token,
        productId: item.productId._id || item.productId,
        variantId: item.variantId || null,
        quantity: newQuantity,
      });
      onCartChange?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update quantity.");
    } finally {
      setLoading(false);
    }
  };

  // Get product info from productId object if available
  const productImage = item.productId?.images?.[0] || "/placeholder.svg";
  const productName = item.productId?.name || item.name;
  const price = item.productId?.price || item.price || 0;

  return (
    <div
      ref={itemRef}
      className={`transition-all duration-300 ${
        isRemoving ? "opacity-0 scale-95" : "opacity-100 scale-100"
      } ${!isLast ? "border-b border-gray-200" : ""} py-3`}
    >
      <div className="flex gap-3 items-start">
        {/* Image & Quantity Badge */}
        <div className="relative">
          <img
            src={productImage}
            alt={productName}
            className="w-14 h-14 object-cover rounded border"
          />
          <div className="absolute -top-1 -right-1 bg-[#64973f] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {item.quantity}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm text-[#486e40] truncate">{productName}</h3>
          <p className="text-xs text-[#8F9779] mb-1">{item.variant?.color}</p>

          {/* Quantity & Remove */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleUpdateQuantity(item.quantity - 1)}
                disabled={item.quantity <= 1 || loading}
                className={`w-6 h-6 rounded bg-gray-200 flex items-center justify-center text-xs ${
                  item.quantity <= 1 || loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-300"
                }`}
              >
                <FaMinus />
              </button>
              <span className="w-6 text-center text-xs">{item.quantity}</span>
              <button
                onClick={() => handleUpdateQuantity(item.quantity + 1)}
                disabled={loading}
                className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs"
              >
                <FaPlus />
              </button>
            </div>

            <button
              onClick={handleRemove}
              disabled={loading}
              className="p-1 text-red-500 hover:bg-red-50 rounded"
              title="Remove item"
            >
              <FaTrash className="text-sm" />
            </button>
          </div>

          {/* Price Info */}
          <div className="mt-1 text-right">
            <span className="text-sm text-[#64973f]">
              Rs. {(price * item.quantity).toFixed(2)}
            </span>
            <span className="text-xs text-gray-500 ml-1">
              Rs. {price.toFixed(2)} each
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
