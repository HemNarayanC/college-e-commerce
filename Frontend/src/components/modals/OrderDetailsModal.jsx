import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaDownload } from "react-icons/fa";

const OrderDetailsModal = ({ isOpen, order, onClose, onStatusUpdate, showToast }) => {
  const [selectedStatus, setSelectedStatus] = useState(order?.status || "");

  // Reset selectedStatus when order changes or modal opens
  useEffect(() => {
    if (order?.status) {
      setSelectedStatus(order.status);
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const statusBadgeClass = {
    delivered: "bg-green-100 text-green-800",
    processing: "bg-yellow-100 text-yellow-800",
    shipped: "bg-purple-100 text-purple-800",
    cancelled: "bg-red-100 text-red-800",
    default: "bg-gray-100 text-gray-800",
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleUpdateClick = () => {
    if (selectedStatus === order.status) {
      showToast?.("Please select a different status to update");
      return;
    }
    onStatusUpdate(order._id, selectedStatus);
    showToast?.(`Order status updated to "${selectedStatus}"`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      onClick={onClose} // Close modal on backdrop click
    >
      <div
        className="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-2xl sm:w-full"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal on inner click
      >
        <div className="bg-white px-6 pt-5 pb-6 sm:p-6 sm:pb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Order Details</h3>
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                statusBadgeClass[order.status] || statusBadgeClass.default
              }`}
            >
              {order.status}
            </span>
          </div>

          {/* Order Info */}
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="text-sm font-medium text-gray-900">#{order.orderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="text-sm font-medium text-gray-900">{order.user?.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment</p>
                <p className="text-sm font-medium text-gray-900">{order.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Items</h4>
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.productId?.name}{" "}
                        <span className="ml-1 text-xs text-gray-500">
                          ({item.variant?.color})
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        Rs. {item.price.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      Total:
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      Rs. {order.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Shipping + Status Update */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h4>
              <p className="text-sm text-gray-600">
                {order.shippingAddress?.line1}, {order.shippingAddress?.city},{" "}
                {order.shippingAddress?.zip}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Update Order Status</h4>
              <select
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                value={selectedStatus}
                onChange={handleStatusChange}
              >
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <div className="mt-4 flex gap-2 flex-wrap">
                <button
                  onClick={handleUpdateClick}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <FaCheckCircle className="mr-1.5" /> Update Status
                </button>
                <button
                  onClick={() => {
                    showToast?.("Invoice downloaded");
                    onClose();
                  }}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <FaDownload className="mr-1.5" /> Download Invoice
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            onClick={onClose}
            className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
