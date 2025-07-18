import { useState } from "react";
import {
  FaDollarSign,
  FaUsers,
  FaBox,
  FaChartLine,
  FaExclamationTriangle,
  FaChartBar,
  FaShoppingCart,
  FaStore,
  FaUserPlus,
  FaStar,
  FaTags,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaCheck,
  FaTimes,
  FaSearch,
  FaDownload,
  FaTimesCircle,
  FaCheckCircle,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import { getAdminDashboardData } from "../../api/adminDashboard";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import OrderDetailsModal from "../modals/OrderDetailsModal";
import { toast } from "react-toastify";
import CustomerDetailsModal from "../modals/CustomerDetailsModal";
import VendorDetailsModal from "../modals/VendorDetailsModal";
import { toggleCustomerStatus, updateVendorStatus } from "../../api/authApi";

const AdminDashboard = () => {
  const token = useSelector((state) => state.auth.auth_token);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [orderDetailsModalOpen, setOrderDetailsModalOpen] = useState(false);
  const [customerDetailsModalOpen, setCustomerDetailsModalOpen] =
    useState(false);
  const [vendorDetailsModalOpen, setVendorDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [orderChanged, setOrderChanged] = useState(false);
  const [customerDetailsChanged, setCustomerDetailsChanged] = useState(false);
  const [vendorDetailsChanged, setVendorDetailsChanged] = useState(false);
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function formatPercentageChange(change) {
    if (change === undefined || change === null) return null;
    const sign = change > 0 ? "+" : "";
    return `${sign}${change}%`;
  }

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setOrderDetailsModalOpen(true);
  };

  useEffect(() => {
    const fetchUserDashboard = async () => {
      try {
        const adminData = await getAdminDashboardData(token);
        console.log("Admin Dashboard Data ==>", adminData);

        const stats = adminData.stats;
        console.log("stats ==> ", stats);
        setStats(stats);

        const orders = adminData.orders;
        console.log("orders ==> ", orders);
        setOrders(orders);

        const customers = adminData.customers;
        console.log("customers ==> ", customers);
        setCustomers(customers);

        const vendors = adminData.vendors;
        console.log("Vendors ==> ", vendors);
        setVendors(vendors);

        const products = adminData.products;
        console.log("Products ==> ", products);
        setProducts(products);

        const categories = adminData.categories;
        console.log("Categories ==> ", categories);
        setCategories(categories);

        const reviews = adminData.reviews;
        console.log("Reviews ==> ", reviews);
        setReviews(reviews);
      } catch (error) {
        console.log("Error in fetching admin dashboard data", error);
      }
    };

    if (token) fetchUserDashboard();
  }, [token, orderChanged]);

  const [flagToggles, setFlagToggles] = useState({});

  const toggleFlagDropdown = (reviewId) => {
    setFlagToggles((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const handleUpdateVendorStatus = async (vendorId, status) => {
    setIsLoading(true);
    try {
      const { message } = await updateVendorStatus(vendorId, status, token);
      toast.success(message || `Vendor ${status} successfully!`);

      setVendors((prev) =>
        prev.map((vendor) =>
          vendor._id === vendorId ? { ...vendor, status } : vendor
        )
      );

      if (selectedVendor?._id === vendorId) {
        setSelectedVendor((prev) => ({ ...prev, status }));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || `Failed to ${status} vendor.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleCustomerStatus = async (customerId, currentStatus) => {
  const newStatus = !currentStatus; // toggle boolean

  try {
    await toggleCustomerStatus(customerId, newStatus, token);
    toast.success(`Customer status updated to ${newStatus ? "Active" : "Inactive"}`);

    // Immediately update local customers state to reflect change in UI
    setCustomers((prevCustomers) =>
      prevCustomers.map((cust) =>
        cust._id === customerId ? { ...cust, isActive: newStatus } : cust
      )
    );
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to update customer status.");
  }
};


  const getStatusColor = (status) => {
    switch (status) {
      case "active":
      case "delivered":
        return "text-green-700 bg-green-50 border border-green-200";
      case "pending":
      case "shipped":
        return "text-yellow-700 bg-yellow-50 border border-yellow-200";
      case "inactive":
      case "cancelled":
        return "text-red-700 bg-red-50 border border-red-200";
      case "paid":
        return "text-blue-700 bg-blue-50 border border-blue-200";
      default:
        return "text-gray-700 bg-gray-50 border border-gray-200";
    }
  };

  const tabs = [
    { id: "overview", name: "Overview", icon: FaChartBar },
    { id: "customers", name: "Customers", icon: FaUsers },
    { id: "vendors", name: "Vendors", icon: FaStore },
    { id: "orders", name: "Orders", icon: FaShoppingCart },
    { id: "products", name: "Products", icon: FaBox },
    { id: "categories", name: "Categories", icon: FaTags },
    { id: "reviews", name: "Reviews", icon: FaStar },
    { id: "analytics", name: "Analytics", icon: FaChartLine },
  ];

  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p
              className={`text-sm mt-2 ${
                change > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {change > 0 ? "+" : ""}
              {change}% from last month
            </p>
          )}
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
                ? "bg-gradient-to-r from-[#486e40] to-[#64973f] text-white shadow-lg"
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
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={FaDollarSign}
                title="Total Revenue"
                value={(stats?.lifetimeSales ?? 0)?.toLocaleString()}
                change={formatPercentageChange(stats?.revenuePercentageChange)}
                color="bg-gradient-to-r from-green-500 to-green-600"
              />

              <StatCard
                icon={FaUsers}
                title="Total Customers"
                value={(stats?.totalCustomers ?? 0).toLocaleString()}
                change={formatPercentageChange(
                  stats?.customersPercentageChange
                )}
                color="bg-gradient-to-r from-blue-500 to-blue-600"
              />
              <StatCard
                icon={FaStore}
                title="Active Vendors"
                value={(stats?.activeVendors ?? 0).toLocaleString()}
                change={formatPercentageChange(
                  stats?.activeVendorsPercentageChange
                )}
                color="bg-gradient-to-r from-purple-500 to-purple-600"
              />
              <StatCard
                icon={FaBox}
                title="Total Products"
                value={stats.totalProducts}
                color="bg-gradient-to-r from-orange-500 to-orange-600"
              />
            </div>

            {/* Charts and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Monthly Revenue
                </h3>
                <div className="h-48 flex items-end space-x-2">
                  {[45, 52, 48, 61, 55, 67].map((height, index) => (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div
                        className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg"
                        style={{ height: `${height}%` }}
                      ></div>
                      <p className="text-xs text-gray-600 mt-2">
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun"][index]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Recent Orders
                </h3>
                <div className="space-y-3">
                  {orders.slice(0, 4).map((order) => (
                    <div
                      key={order._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <FaShoppingCart className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            #{order._id}
                          </p>
                          <p className="text-xs text-gray-600">
                            {order.customerName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-sm">
                          ${order.totalAmount}
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
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  to="/customers/add"
                  className="flex flex-col items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:shadow-md transition-all duration-200"
                >
                  <FaUserPlus className="w-6 h-6 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-blue-900">
                    Add Customer
                  </span>
                </Link>

                <Link
                  to="/vendors/add"
                  className="flex flex-col items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:shadow-md transition-all duration-200"
                >
                  <FaStore className="w-6 h-6 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-green-900">
                    Add Vendor
                  </span>
                </Link>

                <Link
                  to="/categories/add"
                  className="flex flex-col items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:shadow-md transition-all duration-200"
                >
                  <FaTags className="w-6 h-6 text-purple-600 mb-2" />
                  <span className="text-sm font-medium text-purple-900">
                    Add Category
                  </span>
                </Link>

                <Link
                  to="/reports"
                  className="flex flex-col items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg hover:shadow-md transition-all duration-200"
                >
                  <FaChartLine className="w-6 h-6 text-orange-600 mb-2" />
                  <span className="text-sm font-medium text-orange-900">
                    View Reports
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === "customers" && (
          <div className="space-y-6">
            {/* Header with Search and Actions */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <h2 className="text-xl font-bold text-gray-900">
                  Customer Management
                </h2>
                <div className="flex space-x-3">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search customers..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all duration-200 text-sm font-medium">
                    <FaPlus className="w-4 h-4 mr-2 inline" />
                    Add Customer
                  </button>
                </div>
              </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Orders
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Spent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer) => (
                      <tr key={customer._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {customer.name.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {customer.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {customer._id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {customer.email}
                          </div>
                          <div className="text-xs text-gray-500">
                            {customer.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {customer.totalOrders}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Rs. {customer.totalSpent}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() =>
                              handleToggleCustomerStatus(
                                customer._id,
                                customer.isActive
                              )
                            }
                            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                              customer.isActive
                                ? "text-green-800 bg-green-100"
                                : "text-red-800 bg-red-100"
                            }`}
                            title="Toggle Customer Status"
                          >
                            {customer.isActive ? (
                              <>
                                <FaCheckCircle className="mr-1 w-4 h-4" />
                                Active
                              </>
                            ) : (
                              <>
                                <FaTimesCircle className="mr-1 w-4 h-4" />
                                Inactive
                              </>
                            )}
                          </button>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            className="text-green-600 hover:text-green-900"
                            onClick={() => {
                              setCustomerDetailsModalOpen(true);
                              setSelectedCustomer(customer);
                            }}
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <CustomerDetailsModal
          isOpen={customerDetailsModalOpen}
          onClose={() => setCustomerDetailsModalOpen(false)}
          customer={selectedCustomer}
          onCustomerUpdated={() =>
            setCustomerDetailsChanged(!customerDetailsChanged)
          }
        />

        {/* Vendors Tab */}
        {activeTab === "vendors" && (
          <div className="space-y-6">
            {/* Vendor Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                icon={FaStore}
                title="Total Vendors"
                value={stats.totalVendors}
                color="bg-gradient-to-r from-[#486e40] to-[#64973f]"
              />
              <StatCard
                icon={FaCheck}
                title="Active Vendors"
                value={stats.activeVendors}
                color="bg-gradient-to-r from-[#3b82f6] to-[#2563eb]" // blue gradient
              />
              <StatCard
                icon={FaExclamationTriangle}
                title="Pending Approval"
                value={stats.pendingVendors}
                color="bg-gradient-to-r from-yellow-400 to-yellow-500"
              />
            </div>

            {/* Vendors Table */}
            <div className="bg-white rounded-xl shadow-md border border-[#8F9779]/30 overflow-hidden">
              <div className="p-6 border-b border-[#8F9779]/30 flex justify-between items-center">
                <h3 className="text-lg font-bold text-[#486e40]">
                  Vendor Management
                </h3>
                <button className="bg-gradient-to-r from-[#486e40] to-[#64973f] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 text-sm font-medium flex items-center space-x-2">
                  <FaPlus className="w-4 h-4" />
                  <span>Add Vendor</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#8F9779]/30">
                  <thead className="bg-[#F2E7D5]">
                    <tr>
                      {[
                        "Vendor",
                        "Business",
                        "Products",
                        "Sales (Rs)",
                        "Status",
                        "Actions",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-semibold text-[#486e40] uppercase tracking-wider whitespace-nowrap"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#8F9779]/20">
                    {vendors.map((vendor) => (
                      <tr
                        key={vendor._id}
                        className="hover:bg-[#F2E7D5] transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-[#486e40] to-[#64973f] rounded-full flex items-center justify-center">
                              <FaStore className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-[#486e40]">
                                {vendor.name}
                              </div>
                              <div className="text-xs text-[#8F9779]">
                                {vendor.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#486e40] whitespace-nowrap">
                          {vendor.businessName}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#486e40] whitespace-nowrap">
                          {vendor.totalProducts}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-[#486e40] whitespace-nowrap">
                          {vendor.totalSales.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              vendor.status === "active"
                                ? "bg-green-100 text-green-800"
                                : vendor.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {vendor.status.charAt(0).toUpperCase() +
                              vendor.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                            {vendor.status === "pending" && (
                              <>
                                <button
                                  className="text-green-600 hover:text-green-900"
                                  title="Approve"
                                  onClick={() =>
                                    handleUpdateVendorStatus(
                                      vendor._id,
                                      "approved"
                                    )
                                  }
                                  disabled={isLoading}
                                >
                                  <FaCheck className="w-5 h-5" />
                                </button>
                                <button
                                  className="text-red-600 hover:text-red-900"
                                  title="Reject"
                                  onClick={() =>
                                    handleUpdateVendorStatus(
                                      vendor._id,
                                      "rejected"
                                    )
                                  }
                                  disabled={isLoading}
                                >
                                  <FaTimes className="w-5 h-5" />
                                </button>
                              </>
                            )}

                            {vendor.status === "approved" && (
                              <button
                                className="text-yellow-600 hover:text-yellow-900"
                                title="Suspend Vendor"
                                onClick={() =>
                                  handleUpdateVendorStatus(
                                    vendor._id,
                                    "suspended"
                                  )
                                }
                                disabled={isLoading}
                              >
                                <FaExclamationTriangle className="w-5 h-5" />
                              </button>
                            )}

                            {vendor.status === "suspended" && (
                              <button
                                className="text-green-600 hover:text-green-900"
                                title="Reactivate Vendor"
                                onClick={() =>
                                  handleUpdateVendorStatus(
                                    vendor._id,
                                    "approved"
                                  )
                                }
                                disabled={isLoading}
                              >
                                <FaCheck className="w-5 h-5" />
                              </button>
                            )}

                            <button
                              className="text-blue-600 hover:text-blue-900"
                              title="View"
                              onClick={() => {
                                setVendorDetailsModalOpen(true);
                                setSelectedVendor(vendor);
                              }}
                            >
                              <FaEye className="w-5 h-5" />
                            </button>

                            {/* <button
                              className="text-purple-600 hover:text-purple-900"
                              title="Edit"
                            >
                              <FaEdit className="w-5 h-5" />
                            </button> */}
                          </td>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <VendorDetailsModal
          isOpen={vendorDetailsModalOpen}
          onClose={() => setVendorDetailsModalOpen(false)}
          vendorDetails={selectedVendor}
          onVendorUpdated={() => setVendorDetailsChanged(!vendorDetailsChanged)}
        />

        {activeTab === "orders" && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                Order Management
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-indigo-600 font-semibold whitespace-nowrap">
                        {order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        <div className="font-medium">{order.userId?.name}</div>
                        <div className="text-xs text-gray-500">
                          {order.userId?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        <ul className="space-y-1">
                          {order.items.map((item) => (
                            <li key={item._id}>
                              <div className="font-semibold">
                                {item.productId?.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                Qty: {item.quantity}, Variant:{" "}
                                {item.variant?.color}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {order.paymentMethod}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        Rs. {order.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4">
                        {/* View */}
                        <button
                          onClick={() => openOrderDetails(order)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Order"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => openOrderDetails(order)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Order"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this order?"
                              )
                            ) {
                              handleDelete(order._id);
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Order"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <OrderDetailsModal
          isOpen={orderDetailsModalOpen}
          order={selectedOrder}
          onClose={() => setOrderDetailsModalOpen(false)}
          onStatusUpdate={() => setOrderChanged((prev) => !prev)}
          showToast={toast}
        />

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Products Header */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <h2 className="text-xl font-bold text-gray-900">
                  Product Management
                </h2>
                <div className="flex space-x-3">
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="">All Categories</option>
                    {categories
                      .filter((cat) => cat.isActive)
                      .map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                  </select>

                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all duration-200 text-sm font-medium flex items-center">
                    <FaDownload className="w-4 h-4 mr-2" />
                    Export
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-5 gap-4">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 w-full flex flex-col"
                  style={{ minWidth: 0 }} // prevent overflow on flex children
                >
                  <img
                    src={
                      product.images[0] ||
                      "/placeholder.svg?height=120&width=180"
                    }
                    alt={product.name}
                    className="w-full h-28 object-cover"
                  />
                  <div className="p-3 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate max-w-[65%]">
                        {product.name}
                      </h3>
                      {product.isFeatured && (
                        <span className="bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-600 mb-1 truncate">
                      by {product.vendorId.businessName}
                    </p>
                    <p className="text-[10px] text-gray-600 mb-2 truncate">
                      {product.categoryId.name}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-base font-bold text-gray-900">
                        Rs. {product.price}
                      </span>
                      <span
                        className={`text-xs font-semibold ${
                          product.stock <= 5 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {product.stock} in stock
                      </span>
                    </div>
                    <div className="flex space-x-2 mt-auto">
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1.5 rounded-md text-xs font-medium flex items-center justify-center space-x-1 whitespace-nowrap">
                        <FaEye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                      <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1.5 rounded-md text-xs font-medium flex items-center justify-center space-x-1 whitespace-nowrap">
                        <FaEdit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md border border-[#8F9779]/30 p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#486e40]">
                Category Management
              </h2>
              <button className="bg-gradient-to-r from-[#486e40] to-[#64973f] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 text-sm font-medium flex items-center">
                <FaPlus className="w-4 h-4 mr-2 inline" />
                Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="bg-white rounded-xl shadow-md border border-[#8F9779]/20 p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#486e40] to-[#64973f] rounded-xl flex items-center justify-center">
                      <FaTags className="w-5 h-5 text-white" />
                    </div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        category.status
                      )}`}
                    >
                      {category.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#486e40] mb-2">
                    {category.name}
                  </h3>
                  <p className="text-[#6D9886] mb-4">
                    {category.productCount} products
                  </p>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-[#64973f] text-white px-3 py-2 rounded-lg hover:bg-[#486e40] transition-colors text-sm flex items-center justify-center">
                      <FaEdit className="w-3 h-3 mr-1 inline" />
                      Edit
                    </button>
                    <button className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm flex items-center justify-center">
                      <FaTrash className="w-3 h-3" />
                    </button>
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
              <h2 className="text-xl font-bold text-gray-900">
                Review Management
              </h2>
            </div>

            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Reviewer Info */}
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {review.userId.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {review.userId.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {review.productId.name}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 ml-auto">
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

                      {/* Review Comment */}
                      <p className="text-gray-700 mb-3">{review.comment}</p>
                      <p className="text-sm text-gray-500">
                        Posted on {new Date(review.createdAt).toLocaleString()}
                      </p>

                      {/* Flags with Dropdown */}
                      {review.flags && review.flags.length > 0 && (
                        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-red-800 font-semibold flex items-center">
                              <FaExclamationTriangle className="w-4 h-4 mr-2" />
                              This review has been flagged (
                              {review.flags.length})
                            </p>
                            <button
                              onClick={() => toggleFlagDropdown(review._id)}
                              className="text-red-700 hover:underline text-sm font-medium flex items-center"
                            >
                              {flagToggles[review._id] ? (
                                <>
                                  Hide <FaChevronUp className="ml-1 w-3 h-3" />
                                </>
                              ) : (
                                <>
                                  View Flags{" "}
                                  <FaChevronDown className="ml-1 w-3 h-3" />
                                </>
                              )}
                            </button>
                          </div>

                          {flagToggles[review._id] && (
                            <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
                              {review.flags.map((flag) => (
                                <li key={flag._id}>
                                  {flag.reason} —{" "}
                                  <span className="text-gray-500 text-xs">
                                    {new Date(flag.createdAt).toLocaleString()}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 ml-4">
                      <button className="text-green-600 hover:text-green-900">
                        <FaCheck className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <FaTimes className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* Revenue Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Revenue Breakdown
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Vendor Earnings</span>
                    <span className="font-bold text-gray-900">
                      Rs.{" "}
                      {(
                        stats.lifetimeSales - stats.platformEarnings
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-gray-600">Platform Fees</span>
                    <span className="font-bold text-purple-600">
                      Rs. {stats.platformEarnings.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border-t-2 border-green-200">
                    <span className="text-gray-600 font-medium">
                      Total Revenue
                    </span>
                    <span className="font-bold text-green-600 text-lg">
                      Rs. {stats.lifetimeSales.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Platform Performance
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">10%</p>
                    <p className="text-sm text-gray-600">Commission Rate</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {stats.averageOrderValue.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Avg Order Value</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {stats.aovGrowth.toFixed(2)}%
                    </p>
                    <p className="text-sm text-gray-600">Monthly Growth</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">
                      {stats.customerRetentionRate}%
                    </p>
                    <p className="text-sm text-gray-600">Retention Rate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                System Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <FaBox className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.totalProducts}
                  </p>
                  <p className="text-sm text-gray-600">Total Products</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                  <FaUsers className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">
                    {stats.totalCustomers}
                  </p>
                  <p className="text-sm text-gray-600">Total Customers</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                  <FaShoppingCart className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.totalOrders}
                  </p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                  <FaStar className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-600">4.8</p>
                  <p className="text-sm text-gray-600">Average Rating</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
