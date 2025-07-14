import { FaSearch, FaBell, FaStore } from "react-icons/fa";
import TopHeader from "../Header/TopHeader";
import { useState, useRef, useEffect } from "react";
import AuthMenu from "../Header/AuthMenu";
import { Link } from "react-router-dom";

const DashboardHeader = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    setNotifications([
      {
        id: 1,
        title: "New Order Received",
        message: "Order #12345 has been placed",
        time: "2 min ago",
        isRead: false,
      },
      {
        id: 2,
        title: "Low Stock Alert",
        message: "Gaming Mouse is running low on stock",
        time: "15 min ago",
        isRead: false,
      },
    ]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-[#FBF9F7] relative right-1 z-50">
      <TopHeader />

      <div className="container mx-auto px-4 py-4 flex items-center justify-between space-x-6">
        <Link to="/" className="flex items-center space-x-3 text-[#6D9886]">
          <FaStore className="text-2xl" />
          <span className="text-2xl font-bold">NivaSa</span>
          <span className="text-sm font-semibold text-[#8F9779] uppercase ml-4">Dashboard</span>
        </Link>

        <div className="flex-1 max-w-xl relative">
          <input
            type="text"
            className="w-full pl-4 pr-10 py-2 text-sm outline-none bg-white border border-[#E1C699] text-[#2C2C2C] rounded-md"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="absolute right-0 top-0 h-full px-3 text-white bg-[#6D9886] rounded-r-md cursor-pointer">
            <FaSearch />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative p-2 rounded-lg text-[#486e40] hover:text-[#64973f] hover:bg-[#486e40]/10 transition-all duration-200"
              aria-haspopup="listbox"
              aria-expanded={showNotifications}
              aria-label="Notifications"
            >
              <FaBell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#64973f] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div
                className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-[#8F9779]/20 z-50"
                role="listbox"
                aria-label="Notifications list"
              >
                <div className="p-4 border-b border-[#8F9779]/20 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-[#486e40]">Notifications</h3>
                  <span className="text-sm text-[#8F9779]">{unreadCount} unread</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-[#8F9779]/10 hover:bg-[#f8f5f2] cursor-pointer ${
                        !notification.isRead ? "bg-[#64973f]/5" : ""
                      }`}
                      role="option"
                      aria-selected={!notification.isRead}
                    >
                      <p className="text-sm font-medium text-[#486e40]">{notification.title}</p>
                      <p className="text-sm text-[#8F9779] mt-1">{notification.message}</p>
                      <p className="text-xs text-[#8F9779] mt-2">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-[#8F9779]/20">
                  <button className="w-full text-center text-sm text-[#64973f] hover:text-[#486e40] font-medium">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <AuthMenu />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
