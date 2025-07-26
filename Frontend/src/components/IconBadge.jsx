import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCart } from "../api/cartApi";
import { setItemCount } from "../redux/cart/cartSlice";

const IconBadge = ({ icon, label, badgePosition, onClick }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.auth_token);
  const itemCount = useSelector((state) => state.cartCount.itemCount);

  useEffect(() => {
    const fetchCartCount = async () => {
      if (isAuthenticated && token) {
        try {
          const response = await getCart(token);
          console.log("Response for Icon Badge", response)
          const totalCount = response.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          dispatch(setItemCount(totalCount || 0));
        } catch (error) {
          console.error("Failed to fetch cart count:", error);
        }
      }
    };

    fetchCartCount();
  }, [isAuthenticated, token, dispatch]);

  return (
    <div className="relative group">
      <button
        className="flex flex-col items-center cursor-pointer focus:outline-none"
        onClick={onClick}
      >
        {/* Icon */}
        <span>{icon}</span>

        {/* Badge Count */}
        {itemCount > 0 && (
          <span
            className={`absolute -top-3 ${badgePosition} bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center`}
          >
            {itemCount}
          </span>
        )}

        {/* Label */}
        <span className="text-xs mt-1">{label}</span>
      </button>
    </div>
  );
};

export default IconBadge;
