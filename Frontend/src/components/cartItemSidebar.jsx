import { FaTimes, FaMinus, FaPlus, FaShoppingBag, FaTrash, FaArrowRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, removeFromCart, updateQuantity, closeCart } from "../redux/cart/cartSlice";

const CartSidebar = () => {
  const dispatch = useDispatch();
  const { items: cartItems, isOpen } = useSelector((state) => state.cart);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleQuantityChange = (id, qty) => {
    if (qty >= 1) dispatch(updateQuantity({ id, quantity: qty }));
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => dispatch(closeCart())}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-[380px] max-w-full bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <div className="flex items-center gap-3">
            <FaShoppingBag className="text-blue-600 text-xl" />
            <div>
              <h2 className="text-xl font-semibold">Cart</h2>
              <p className="text-sm text-gray-500">{itemCount} items</p>
            </div>
          </div>
          <button
            className="text-gray-500 hover:text-red-500"
            onClick={() => dispatch(closeCart())}
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="overflow-y-auto px-4 py-3 h-[calc(100vh-260px)] space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <FaShoppingBag size={50} className="mb-3" />
              <p className="text-lg">Your cart is empty</p>
              <button
                onClick={() => dispatch(closeCart())}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-3 border rounded-lg p-3 shadow-sm">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded border"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-medium">{item.name}</h4>
                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="text-red-500 hover:text-red-600"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    {item.size && <span>Size: {item.size}</span>}
                    {item.color && <span> | Color: {item.color}</span>}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                      >
                        <FaMinus size={10} />
                      </button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>
                    <div className="text-blue-600 font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="px-5 py-4 border-t space-y-3">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span className="text-blue-600">${total.toFixed(2)}</span>
            </div>
            <button className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center gap-2">
              Proceed to Checkout <FaArrowRight size={14} />
            </button>
            <button
              className="w-full py-2 border border-red-300 text-red-500 rounded hover:bg-red-50"
              onClick={() => dispatch(clearCart())}
            >
              <FaTrash size={12} className="inline mr-1" /> Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
