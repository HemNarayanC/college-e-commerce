import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaShoppingCart,
  FaHeart,
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";

const AuthMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  /**
   * Handles the click event to toggle the dropdown menu.
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <div className="relative group">
        <button
          onClick={toggleDropdown}
          className="flex flex-col items-center cursor-pointer"
        >
          <FaUserCircle />
          <span className="text-xs mt-1">Account</span>
        </button>
        {isOpen && (
          <div className="absolute right-0 top-full w-48 bg-white shadow-lg rounded-md z-10">
            <div className="py-1">
              <Link
                to="#"
                className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 space-x-2"
              >
                <FaUser className="text-gray-600" />
                <span>My Profile</span>
              </Link>

              <Link
                to="#"
                className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 space-x-2"
              >
                <FaShoppingCart className="text-gray-600" />
                <span>Carts</span>
              </Link>

              <Link
                to="#"
                className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 space-x-2"
              >
                <FaHeart className="text-gray-600" />
                <span>Wishlist</span>
              </Link>

              <Link
                to="#"
                className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 space-x-2"
              >
                <FaCog className="text-gray-600" />
                <span>Settings</span>
              </Link>

              <hr className="my-1" />

              <Link
                to="#"
                className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 space-x-2"
                onClick={() => {
                  // add your logout logic here
                }}
              >
                <FaSignOutAlt className="text-gray-600" />
                <span>Logout</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthMenu;
