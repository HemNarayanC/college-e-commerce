import { useEffect, useState } from "react";
import CartHeader from "./cartHeader";
import EmptyCart from "./EmptyCart";
import CartItem from "./cartItem";
import CartSummary from "./cartSummary";
import { getCart, clearCart } from "../../api/cartApi";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setItemCount } from "../../redux/cart/cartSlice";

const CartSidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.auth_token);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

const fetchCart = async () => {
  if (!token) return;
  try {
    setLoading(true);
    const data = await getCart(token);
    setCartItems(data || []);
    const count = (data || []).reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );
    dispatch(setItemCount(count));
  } catch (error) {
    console.error("Failed to fetch cart:", error);
    toast.error("Could not load cart. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const handleClearCart = async () => {
    try {
      await clearCart(token);
      toast.info("Cart cleared.");
      fetchCart();
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear cart.");
    }
  };

    useEffect(() => {
    if (!token) {
      setCartItems([]);
      dispatch(setItemCount(0));
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (isOpen) {
      fetchCart();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Use price from item or fallback to productId.price
  const total = cartItems.reduce((sum, item) => {
    const price = item?.price ?? item?.productId?.price ?? 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  const itemCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white shadow-lg z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <CartHeader onClose={onClose} />

          <div className="flex-1 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                Loading cart...
              </div>
            ) : cartItems.length === 0 ? (
              <EmptyCart onClose={onClose} />
            ) : (
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {cartItems.map((item, index) => {
                    // console.log(item);
                    return (
                      <CartItem
                        key={`${item._id}-${item.variantId || ""}`}
                        item={item}
                        isLast={index === cartItems.length - 1}
                        onCartChange={fetchCart}
                        token={token}
                      />
                    );
                  })}
                </div>

                <CartSummary
                  total={total}
                  onClearCart={handleClearCart}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
