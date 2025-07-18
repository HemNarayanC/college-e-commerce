import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaShoppingCart,
  FaHeart,
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
  FaDashcube,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/auth/authSlice";
import AuthModal from "../modals/AuthModal";
import { clearItemCount } from "../../redux/cart/cartSlice";
import { HOME_ROUTE, PROFILE_SETTINGS, USER_PROFILE } from "../../constants/routes";

const AuthMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const menuRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearItemCount());
    setIsOpen(false);
    navigate(HOME_ROUTE)
  };

  return (
    <div ref={menuRef} className="relative">
      {user ? (
        <div className="relative group">
          <button
            onClick={toggleDropdown}
            className="flex flex-col items-center cursor-pointer"
          >
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle className="w-5 h-5" />
            )}
            <span className="text-xs mt-1">
              {user.name?.split(" ")[0] || "Account"}
            </span>
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full w-48 bg-white shadow-lg rounded-md z-40">
              <div className="py-1">
                <Link
                  to={USER_PROFILE}
                  className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 space-x-2"
                >
                  <FaUser className="text-gray-600" />
                  <span>My Profile</span>
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 space-x-2"
                >
                  <FaDashcube className="text-gray-600" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to={PROFILE_SETTINGS}
                  className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <FaCog className="text-gray-600" />
                  <span>Settings</span>
                </Link>

                <hr className="my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center px-4 py-2 text-sm hover:bg-gray-100 space-x-2"
                >
                  <FaSignOutAlt className="text-gray-600" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <button
            onClick={() => setShowAuthModal(true)}
            className="flex flex-col items-center cursor-pointer"
          >
            <FaUserCircle className="w-5 h-5" />
            <span className="text-xs mt-1">Sign In</span>
          </button>

          {showAuthModal && (
            <AuthModal onClose={() => setShowAuthModal(false)} />
          )}
        </>
      )}
    </div>
  );
};

export default AuthMenu;
