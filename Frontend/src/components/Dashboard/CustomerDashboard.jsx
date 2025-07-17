import { useEffect, useState } from "react";
import {
  FaShoppingBag,
  FaHeart,
  FaStar,
  FaBell,
  FaUser,
  FaBox,
  FaEye,
  FaTrash,
  FaPlus,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { getUserDashboard } from "../../api/userDashboardApi";
import { getVendorDashboardData } from "../../api/vendorDashboardApi";

const mockCustomerData = {
  wishlist: [
    {
      _id: "prod5",
      name: "Gaming Laptop",
      price: 1299.99,
      image: "/placeholder.svg?height=200&width=200",
      vendor: "TechStore Pro",
    },
    {
      _id: "prod6",
      name: "Mechanical Keyboard",
      price: 159.99,
      image: "/placeholder.svg?height=200&width=200",
      vendor: "Gaming Hub",
    },
  ],
};

const CustomerDashboard = () => {
  const token = useSelector((state) => state.auth.auth_token);
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDashboard = async () => {
      try {
        // const res = await getUserOrderHistory(token);
        const response = await getUserDashboard(token);

        //fetching orders
        const orders = response.orders;
        console.log("Orders of User1 = ", response);
        setOrders(orders);

        const notifications = response.notifications;
        // console.log("Notifications of User1 = ", notifications);
        setNotifications(notifications);

        const reviews = response.reviews;
        // console.log("Reviews of User1", reviews);
        setReviews(reviews);
      } catch (err) {
        setError("Failed to load User Dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUserDashboard();
  }, [token]);

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "text-green-700 bg-green-50 border border-green-200";
      case "shipped":
        return "text-blue-700 bg-blue-50 border border-blue-200";
      case "pending":
        return "text-yellow-700 bg-yellow-50 border border-yellow-200";
      case "cancelled":
        return "text-red-700 bg-red-50 border border-red-200";
      default:
        return "text-gray-700 bg-gray-50 border border-gray-200";
    }
  };

  const tabs = [
    { id: "overview", name: "Overview", icon: FaUser },
    { id: "orders", name: "My Orders", icon: FaShoppingBag },
    { id: "wishlist", name: "Wishlist", icon: FaHeart },
    { id: "reviews", name: "My Reviews", icon: FaStar },
    { id: "notifications", name: "Notifications", icon: FaBell },
  ];

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6 p-1 border border-[#8F9779]/30">
          <nav className="flex space-x-2 overflow-x-auto scrollbar-thin scrollbar-thumb-[#64973f]/60 scrollbar-track-transparent">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap select-none
            ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-[#486e40] to-[#64973f] text-white shadow-md"
                : "text-[#486e40] hover:text-[#64973f] hover:bg-[#F2E7D5]"
            }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center space-x-4">
                <img
                  src={user.profileImage || "/placeholder.svg"}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user.name}
                  </h2>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-gray-600 text-sm">{user.phone}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                icon={FaShoppingBag}
                title="Total Orders"
                value={orders.length}
                color="bg-gradient-to-r from-blue-500 to-blue-600"
              />
              <StatCard
                icon={FaHeart}
                title="Wishlist Items"
                value={mockCustomerData.wishlist.length}
                color="bg-gradient-to-r from-red-500 to-red-600"
              />
              <StatCard
                icon={FaStar}
                title="Reviews Written"
                value={reviews.length}
                color="bg-gradient-to-r from-yellow-500 to-yellow-600"
              />
              <StatCard
                icon={FaBell}
                title="Unread Notifications"
                value={notifications.filter((n) => !n.isRead).length}
                color="bg-gradient-to-r from-purple-500 to-purple-600"
              />
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Recent Orders
              </h3>

              {loading ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : error ? (
                <p className="text-sm text-red-500">{error}</p>
              ) : orders.length === 0 ? (
                <p className="text-sm text-gray-500">No orders found.</p>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 3).map((order) => (
                    <div
                      key={order._id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <FaBox className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            Order #{order._id}
                          </p>
                          <p className="text-xs text-gray-600">
                            {new Date(order.orderDate).toLocaleDateString()} •{" "}
                            {order.items.length} items
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-sm">
                          Rs. {order.totalAmount}
                        </p>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab == "orders" &&
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6 hover:shadow-lg transition-shadow"
            >
              {/* Order Header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-5">
                <div className="flex items-center space-x-4 mb-3 md:mb-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                    <FaBox className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 break-words">
                      Order #{order._id}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Placed on{" "}
                      <time dateTime={order.orderDate}>
                        {new Date(order.orderDate).toLocaleDateString()}
                      </time>{" "}
                      Payment:{" "}
                      <span className="capitalize">{order.paymentMethod}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    Rs. {order.totalAmount}
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-gray-200 pt-5">
                <h5 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Items
                </h5>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center bg-gray-50 rounded-lg p-3 space-x-4"
                    >
                      <img
                        src={item.productId?.images?.[0] || "/placeholder.svg"}
                        alt={item.productId?.name || "Product Image"}
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {item.productId?.name || "Unnamed Product"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Color:{" "}
                          <span className="capitalize">
                            {item.variant?.color || "N/A"}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-gray-900 whitespace-nowrap">
                        Rs. {item.price}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping and Actions */}
              <div className="border-t border-gray-200 pt-5 mt-6 flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="mb-4 md:mb-0">
                  <h5 className="text-lg font-semibold text-gray-900 mb-1">
                    Shipping Address
                  </h5>
                  <p className="text-gray-700 text-sm max-w-md">
                    {order.shippingAddress.line1}, {order.shippingAddress.city}{" "}
                    {order.shippingAddress.zip}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
                    <FaEye className="w-4 h-4 mr-2" />
                    Track Order
                  </button>
                  {order.status === "delivered" && (
                    <button className="flex items-center bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
                      <FaStar className="w-4 h-4 mr-2" />
                      Write Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

        {/* Wishlist Tab */}
        {activeTab === "wishlist" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900">My Wishlist</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCustomerData.wishlist.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="text-base font-bold text-gray-900 mb-2">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      by {item.vendor}
                    </p>
                    <p className="text-lg font-bold text-gray-900 mb-4">
                      Rs. {item.price}
                    </p>
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg hover:shadow-md transition-all duration-200 text-sm">
                        <FaPlus className="w-3 h-3 mr-1 inline" />
                        Add to Cart
                      </button>
                      <button className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm">
                        <FaTrash className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900">My Reviews</h2>
            </div>

            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={review?.productId?.images?.[0] || "/placeholder.svg"}
                      alt={review?.productId?.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-base font-bold text-gray-900">
                          {review?.productId?.name || "Product Name"}
                        </h4>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                        {review.comment}
                      </p>
                      <p className="text-xs text-gray-500">
                        Reviewed on{" "}
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
            </div>

            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    notification.isRead
                      ? "bg-white border-gray-200"
                      : "bg-blue-50 border-blue-200 shadow-md"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`p-2 rounded-lg ${
                        notification.isRead ? "bg-gray-100" : "bg-blue-100"
                      }`}
                    >
                      <FaBell
                        className={`w-4 h-4 ${
                          notification.isRead
                            ? "text-gray-400"
                            : "text-blue-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {notification.title}
                      </h4>
                      <p className="text-gray-700 mb-2 text-sm leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {notification.createdAt}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
