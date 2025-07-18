import { useEffect, useState } from "react";
import {
  FaDollarSign,
  FaBox,
  FaChartLine,
  FaUsers,
  FaExclamationTriangle,
  FaChartBar,
  FaEye,
  FaPlus,
  FaEdit,
  FaTrash,
  FaShoppingCart,
  FaArrowUp,
  FaArrowDown,
  FaSpinner,
  FaStar,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import AddProductModal from "../modals/AddProductModal";
import OrderDetailsModal from "../modals/OrderDetailsModal";
import { getVendorDashboardData } from "../../api/vendorDashboardApi";
import { deleteProduct, getProductsByVendor } from "../../api/productApi";
import { getVendorById } from "../../api/vendorApi";
import { getVendorOrders } from "../../api/ordersApi";

const VendorDashboard = () => {
  const token = useSelector((state) => state.auth.auth_token);
  const vendor = useSelector((state) => state.auth.vendor);
  const vendorId = vendor.id;
  console.log("Vendor ", vendor, token);

  const [activeTab, setActiveTab] = useState("overview");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [orderChanged, setOrderChanged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [profile, setProfile] = useState({});
  const [sales, setSales] = useState({});
  const [topProducts, setTopProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [productSaved, setProductSaved] = useState(false);
  const [payout, setPayout] = useState(0);
  const [orderVolume, setOrderVolume] = useState([]);

  const [orderDetailsModalOpen, setOrderDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setOrderDetailsModalOpen(true);
  };

  useEffect(() => {
    const fetchVendorDashboard = async () => {
      try {
        // Fetch dashboard data
        const dashboardResponse = await getVendorDashboardData(token);
        const dashboardData = dashboardResponse;
        console.log("Vendor Dashboard Response:", dashboardData);

        const orders = await getVendorOrders(token);
        console.log("Orders", orders);

        // Set dashboard data from API response
        setLowStock(dashboardData.lowStock || []);
        setSales(dashboardData.sales || {});
        setTopProducts(dashboardData.topProducts || []);
        setOrders(orders || []);
        setStats(dashboardData.stats || {});
        setPayout(dashboardData.payout || 0);
        setOrderVolume(dashboardData.orderVolume || []);

        // Fetch products separately if needed
        try {
          const productsResponse = await getProductsByVendor(vendorId);
          console.log("Products====>", productsResponse);
          setProducts(productsResponse.products);
        } catch (productError) {
          console.error("Failed to load products:", productError);
          // Use products from dashboard data if separate call fails
          setProducts([]);
        }

        // Fetch vendor profile separately if needed
        try {
          const profile = await getVendorById(vendorId);
          console.log("Vendor Profile", profile);
          setProfile(profile);
        } catch (error) {
          console.error("Failed to load vendor profile:", error);
          //   setProfile(vendor || {});
        }
      } catch (err) {
        console.error("Failed to load Vendor Dashboard:", err);
        setError("Failed to load Vendor Dashboard data.");
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    if (token && vendor) {
      fetchVendorDashboard();
    } else {
      setLoading(false);
      setError("Authentication required");
    }
  }, [token, vendor, vendorId, orderChanged, productSaved]);

  const growth =
    sales.lastMonth === 0
      ? sales.thisMonth === 0
        ? 0
        : 100
      : ((sales.thisMonth - sales.lastMonth) / sales.lastMonth) * 100;

  const isPositive = growth >= 0;

const handleDeleteClick = async (productId) => {
  try {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    await deleteProduct(productId, token);
    toast.success("Product deleted successfully.");
    setProducts((prevProducts) => prevProducts.filter(p => p._id !== productId));
  } catch (error) {
    toast.error(error.response?.data?.error || "Failed to delete product.");
  }
};

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
      case "delivered":
        return "text-green-700 bg-green-50 border border-green-200";
      case "pending":
      case "shipped":
      case "processing":
        return "text-yellow-700 bg-yellow-50 border border-yellow-200";
      case "inactive":
      case "cancelled":
        return "text-red-700 bg-red-50 border border-red-200";
      default:
        return "text-gray-700 bg-gray-50 border border-gray-200";
    }
  };

  const tabs = [
    { id: "overview", name: "Overview", icon: FaChartBar },
    { id: "products", name: "Products", icon: FaBox },
    { id: "orders", name: "Orders", icon: FaShoppingCart },
    { id: "analytics", name: "Analytics", icon: FaChartLine },
    { id: "profile", name: "Profile", icon: FaUsers },
  ];

  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change !== null && change !== undefined && (
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
        <p className="ml-4 text-lg text-gray-700">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6 p-1">
          <nav className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
                title="Lifetime Sales"
                value={`Rs. ${sales?.lifetime?.toLocaleString() || "0"}`}
                change={sales?.percentChangeYear}
                color="bg-gradient-to-r from-green-500 to-green-600"
              />
              <StatCard
                icon={FaChartLine}
                title="This Month Sales"
                value={`Rs. ${sales?.thisMonth?.toLocaleString() || "0"}`}
                change={sales?.percentChangeMonth}
                color="bg-gradient-to-r from-blue-500 to-blue-600"
              />
              <StatCard
                icon={FaBox}
                title="Total Products"
                value={products.length}
                color="bg-gradient-to-r from-purple-500 to-purple-600"
              />
              <StatCard
                icon={FaExclamationTriangle}
                title="Low Stock Items"
                value={lowStock.filter((p) => p.stock <= 5).length}
                color="bg-gradient-to-r from-red-500 to-red-600"
              />
            </div>
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Chart */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Daily Traffic (Last 7 Days)
                </h3>
                <div className="h-48 flex items-end space-x-2">
                  {/* Mock data for traffic */}
                  {[
                    { date: "2024-07-03", visits: 100 },
                    { date: "2024-07-04", visits: 150 },
                    { date: "2024-07-05", visits: 200 },
                    { date: "2024-07-06", visits: 250 },
                    { date: "2024-07-07", visits: 300 },
                    { date: "2024-07-08", visits: 350 },
                    { date: "2024-07-09", visits: 400 },
                  ].map((day, index) => (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div
                        className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg"
                        style={{ height: `${(day.visits / 100) * 100}%` }}
                      ></div>
                      <p className="text-xs text-gray-600 mt-2">
                        {day.date.split("-")[2]}
                      </p>
                      <p className="text-xs font-medium text-gray-900">
                        {day.visits}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Top Products */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Top Selling Products
                </h3>
                <div className="space-y-3">
                  {topProducts.slice(0, 3).map((product, index) => (
                    <div
                      key={product._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-base font-bold text-gray-400">
                          #{index + 1}
                        </span>
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {product.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-sm">
                          {product.totalSold} sold
                        </p>
                        <p className="text-xs text-gray-600">
                          {product.stock} in stock
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Recent Orders
              </h3>
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order._id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <FaShoppingCart className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            Order #{order.orderId}
                          </p>
                          <p className="text-xs text-gray-600">
                            {order.user?.name} —{" "}
                            {new Date(order.orderDate).toLocaleDateString()}
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
                    {/* Order Items Summary */}
                    <div className="ml-11 mt-2 space-y-1 text-sm text-gray-700">
                      {order.items.map((item) => (
                        <div
                          key={item._id}
                          className="flex justify-between items-center"
                        >
                          <span className="truncate max-w-xs">
                            {item.productId?.name || "Unnamed Product"}{" "}
                            <span className="text-gray-500 text-xs">
                              ({item.variant?.color})
                            </span>
                          </span>
                          <span className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => openOrderDetails(order)}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium flex items-center gap-1"
                      >
                        <FaEye className="w-3 h-3" /> View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Products Header */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <h2 className="text-xl font-bold text-gray-900">My Products</h2>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all duration-200 text-sm font-medium flex items-center"
                >
                  <FaPlus className="w-4 h-4 mr-2" />
                  Add New Product
                </button>
              </div>
            </div>

            {/* Low Stock Alert */}
            {products.filter((p) => p.stock <= 5).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <FaExclamationTriangle className="w-5 h-5 text-red-500" />
                  <h3 className="text-base font-medium text-red-800">
                    Low Stock Alert
                  </h3>
                </div>
                <p className="text-red-700 mt-2 text-sm">
                  You have {products.filter((p) => p.stock <= 5).length}{" "}
                  products running low on stock.
                </p>
              </div>
            )}

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
                      {/* <button
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1.5 rounded-md text-xs font-medium flex items-center justify-center space-x-1 whitespace-nowrap"
                        onClick={() => setIsAddModalOpen(true)}
                      >
                        <FaEye className="w-3 h-3" />
                        <span>View</span>
                      </button> */}
                      <button
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1.5 rounded-md text-xs font-medium flex items-center justify-center space-x-1 whitespace-nowrap"
                        onClick={() => {
                          setProductToEdit(product);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <FaEdit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                        {console.log("Deleting the product", product._id)}
                      {/* Delete Icon only, no button box */}
                      <FaTrash
                        onClick={() => handleDeleteClick(product._id)}
                        className="w-5 h-5 text-red-600 cursor-pointer hover:text-red-800"
                        title="Delete product"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          initialProductData={null} // For adding a new product
          onProductSaved={() => setProductSaved((prev) => !prev)}
        />

        {/* Edit Product Modal */}
        <AddProductModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setProductToEdit(null); // Clear product to edit on close
          }}
          initialProductData={productToEdit} // Pass the product data for editing
          onProductSaved={() => setProductSaved((prev) => !prev)}
        />

        {/* orders tab */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Order Management
              </h2>
              <p className="text-gray-600">
                Manage and track all customer orders.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
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
                    {orders.map((order) => (
                      <tr key={order.orderId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.orderId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {order.items.map((item, idx) => (
                            <div key={idx}>
                              {item.productId?.name}{" "}
                              <span className="text-gray-500 text-xs">
                                ({item.variant?.color})
                              </span>{" "}
                              x{item.quantity}
                            </div>
                          ))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Rs. {order.totalAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => openOrderDetails(order)}
                          >
                            <FaEdit className="w-4 h-4" />
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
        <OrderDetailsModal
          isOpen={orderDetailsModalOpen}
          order={selectedOrder}
          onClose={() => setOrderDetailsModalOpen(false)}
          onStatusUpdate={() => setOrderChanged((prev) => !prev)}
          showToast={toast}
        />
        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                icon={FaEye}
                title="Total Views"
                value={stats.totalViews}
                color="bg-gradient-to-r from-blue-500 to-blue-600"
              />
              <StatCard
                icon={FaUsers}
                title="Conversion Rate"
                value={`${stats.conversionRate}%`}
                color="bg-gradient-to-r from-green-500 to-green-600"
              />
              <StatCard
                icon={FaDollarSign}
                title="Avg Order Value"
                value={`Rs. ${stats.avgOrderValue}`}
                color="bg-gradient-to-r from-purple-500 to-purple-600"
              />
            </div>
            {/* Detailed Analytics */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Store Performance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-3">
                    Sales Breakdown
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 text-sm">This Month</span>
                      <span className="font-bold text-gray-900 text-sm">
                        Rs. {sales.thisMonth.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 text-sm">Last Month</span>
                      <span className="font-bold text-gray-900 text-sm">
                        Rs. {sales.lastMonth.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-600 text-sm">Growth</span>
                      <span
                        className={`font-bold text-sm flex items-center gap-1 ${
                          isPositive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isPositive ? <FaArrowUp /> : <FaArrowDown />}
                        {isNaN(growth) ? "--" : `${growth.toFixed(1)}%`}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-3">
                    Product Performance
                  </h4>
                  <div className="space-y-3">
                    {topProducts.map((product) => (
                      <div
                        key={product._id}
                        className="flex items-center justify-between bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt=""
                            className="w-8 h-8 rounded object-cover"
                          />
                          <span className="text-gray-700 text-sm font-medium">
                            {product.name}
                          </span>
                        </div>
                        <span className="font-semibold text-sm text-gray-900">
                          {product.totalSold} sold
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && profile && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT: Store Overview */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
              {/* Banner & Logo */}
              <div className="relative h-40 bg-gray-100">
                {profile.storeBanner && (
                  <img
                    src={profile.storeBanner || "/placeholder.svg"}
                    alt="Store Banner"
                    className="w-full h-full object-cover"
                  />
                )}
                {profile.storeLogo && (
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                    <img
                      src={profile.storeLogo || "/placeholder.svg"}
                      alt="Store Logo"
                      className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                    />
                  </div>
                )}
              </div>
              {/* Business Info */}
              <div className="pt-16 pb-6 px-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {profile.businessName}
                </h2>
                {profile.businessDescription && (
                  <p className="text-sm text-gray-500 mt-1">
                    {profile.businessDescription}
                  </p>
                )}
                <div className="mt-3 flex justify-center items-center gap-3 text-sm text-gray-600">
                  {profile.status && (
                    <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      {profile.status}
                    </span>
                  )}
                  <span>Rating: {profile.stats?.averageRating ?? 0}</span>
                </div>
              </div>
            </div>
            {/* RIGHT: Contact + Credentials */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Info + Credentials */}
              <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Contact & Credentials
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  {profile.email && (
                    <div>
                      <span className="block font-medium">Email</span>
                      <p>{profile.email}</p>
                    </div>
                  )}
                  {profile.phone && (
                    <div>
                      <span className="block font-medium">Phone</span>
                      <p>{profile.phone}</p>
                    </div>
                  )}
                  {profile.businessLicense && (
                    <div>
                      <span className="block font-medium">
                        Business License
                      </span>
                      <p>{profile.businessLicense}</p>
                    </div>
                  )}
                  {profile.taxRegistration && (
                    <div>
                      <span className="block font-medium">
                        Tax Registration
                      </span>
                      <p>{profile.taxRegistration}</p>
                    </div>
                  )}
                  {profile.governmentId && (
                    <div>
                      <span className="block font-medium">Government ID</span>
                      <p>{profile.governmentId}</p>
                    </div>
                  )}
                  {profile.comfortTheme && (
                    <div>
                      <span className="block font-medium">Comfort Theme</span>
                      <p>{profile.comfortTheme}</p>
                    </div>
                  )}
                </div>
              </div>
              {/* Address + Store Stats */}
              <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Address & Store Stats
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  {profile.address?.city && (
                    <div>
                      <span className="block font-medium">City</span>
                      <p>{profile.address.city}</p>
                    </div>
                  )}
                  {profile.address?.province && (
                    <div>
                      <span className="block font-medium">Province</span>
                      <p>{profile.address.province}</p>
                    </div>
                  )}
                  {profile.address?.postalCode && (
                    <div>
                      <span className="block font-medium">Postal Code</span>
                      <p>{profile.address.postalCode}</p>
                    </div>
                  )}
                  <div>
                    <span className="block font-medium">Products</span>
                    <p>{profile.stats?.productCount ?? 0}</p>
                  </div>
                  <div>
                    <span className="block font-medium">Reviews</span>
                    <p>{profile.stats?.reviewCount ?? 0}</p>
                  </div>
                  <div>
                    <span className="block font-medium">Avg. Rating</span>
                    <p>{profile.stats?.averageRating ?? 0}</p>
                  </div>
                </div>
              </div>
              {/* Edit Button */}
              <div className="text-right">
                <button className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium">
                  <FaEdit className="inline w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
