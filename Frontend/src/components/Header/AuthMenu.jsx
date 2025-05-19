import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

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
        <button onClick={toggleDropdown} className="flex flex-col items-center cursor-pointer">
          <FaUserCircle />
          <span className="text-xs mt-1">Account</span>
        </button>
        {isOpen && (
          <div className="absolute right-0 top-full w-48 bg-white shadow-lg rounded-md z-10">
            <div className="py-1">
              <Link
                to="#"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                My Profile
              </Link>
              <Link
                to={"#"}
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                Carts
              </Link>
              <Link
                to="#"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                Wishlist
              </Link>
              <Link
                to="#"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                Settings
              </Link>
              <hr className="my-1" />
              <Link
                to="#"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
                onClick=""
              >
                Logout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthMenu;
