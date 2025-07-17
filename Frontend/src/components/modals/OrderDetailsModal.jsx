import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaDownload, FaTimes } from "react-icons/fa";
import { updateOrderStatus, confirmDelivery } from "../../api/ordersApi";
import { useSelector } from "react-redux";

const OrderDetailsModal = ({
  isOpen,
  order,
  onClose,
  onStatusUpdate,
  showToast,
}) => {
  console.log("Order details", order);

  const token = useSelector((state) => state.auth.auth_token);
  const user = useSelector((state) => state.auth.user);
  const userRole = user.role;
  console.log("User role", userRole);

  const [itemStatuses, setItemStatuses] = useState({});

  // Initialize itemStatuses from order.items on open or change
  useEffect(() => {
    if (order?.items) {
      const statuses = {};
      order.items.forEach((item) => {
        statuses[item._id] = item.itemStatus || order.status || "pending";
      });
      setItemStatuses(statuses);
    }
  }, [order, isOpen]);

  if (!isOpen || !order) return null;

  const statusBadgeClass = {
    delivered: "bg-green-100 text-green-800",
    processing: "bg-yellow-100 text-yellow-800",
    shipped: "bg-purple-100 text-purple-800",
    cancelled: "bg-red-100 text-red-800",
    default: "bg-gray-100 text-gray-800",
  };

  const handleStatusChange = (itemId, newStatus) => {
    setItemStatuses((prev) => ({ ...prev, [itemId]: newStatus }));
  };

  const handleUpdateClick = async (itemId) => {
    const newStatus = itemStatuses[itemId];
    const item = order.items.find((i) => i._id === itemId);
    if (!item) return;

    if (newStatus === item.itemStatus) {
      showToast?.("Please select a different status to update");
      return;
    }

    try {
      await updateOrderStatus(
        {
          orderId: order.orderId,
          productId: item.productId._id,
          newStatus,
        },
        token
      );

      showToast?.(`Item status updated to "${newStatus}"`);
      onStatusUpdate();
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error("Error updating item status:", error);
      showToast?.("Failed to update item status");
    }
  };

  // Admin confirm delivery handler
  const handleConfirmDelivery = async (productId, vendorId) => {
    try {
      await confirmDelivery(
        {
          orderId: order._id,
          productId,
          vendorId,
        },
        token
      );
      showToast?.("Delivery confirmed for item");
      onStatusUpdate();
    } catch (error) {
      console.error("Error confirming delivery:", error);
      showToast?.("Failed to confirm delivery");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 overflow-y-auto"
      onClick={onClose} // Close modal on backdrop click
    >
      <div
        className="bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:max-w-3xl sm:w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal on inner click
      >
        {/* Header */}
        <div className="bg-gray-50 px-5 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Order Info & Items Table - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Order Info */}
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Order ID</p>
                <p className="font-medium text-gray-900">
                  #{order.orderId || order?._id}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Order Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Customer</p>
                <p className="font-medium text-gray-900">
                  {order.user?.name || order.userId?.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Payment Method</p>
                <p className="font-medium text-gray-900">
                  {order.paymentMethod}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">Overall Status</p>
                <span
                  className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    statusBadgeClass[order.status] || statusBadgeClass.default
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Items Table or Confirm Delivery based on role */}
          {userRole === "vendor" && (
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-3">
                Items & Status
              </h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.productId?.name}{" "}
                          <span className="ml-1 text-xs text-gray-500">
                            ({item.variant?.color})
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          Rs. {item.price.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          <select
                            className="w-full border border-gray-300 rounded-md p-1.5 text-xs focus:ring-blue-500 focus:border-blue-500"
                            value={itemStatuses[item._id] || "pending"}
                            onChange={(e) =>
                              handleStatusChange(item._id, e.target.value)
                            }
                          >
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered" disabled>
                              Delivered
                            </option>
                            <option value="pending" disabled>
                              Pending
                            </option>
                            <option value="paid" disabled>
                              Paid
                            </option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleUpdateClick(item._id)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                          >
                            <FaCheckCircle className="mr-1" /> Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-2 text-right text-sm font-medium text-gray-900"
                      >
                        Total:
                      </td>
                      <td
                        colSpan={2}
                        className="px-4 py-2 text-sm font-medium text-gray-900"
                      >
                        Rs. {order.totalAmount.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {userRole === "admin" && (
            <div className="p-4">
              <h4 className="text-lg font-semibold mb-3">
                Confirm Delivery per Item
              </h4>
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor ID
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <tr key={item._id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.productId?.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {item.vendorId}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {item.itemStatus}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <button
                          onClick={() =>
                            handleConfirmDelivery(
                              item.productId._id,
                              item.vendorId
                            )
                          }
                          disabled={item.itemStatus === "delivered"}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded disabled:opacity-50"
                        >
                          Confirm Delivery
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Shipping Address */}
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <h4 className="text-base font-semibold text-gray-900 mb-2">
              Shipping Address
            </h4>
            <p className="text-sm text-gray-600">
              {order.shippingAddress?.line1}, {order.shippingAddress?.city},{" "}
              {order.shippingAddress?.zip}
            </p>
          </div>

          {/* Download Invoice Button */}
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                showToast?.("Invoice downloaded");
                onClose();
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
            >
              <FaDownload className="mr-2" /> Download Invoice
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-5 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
