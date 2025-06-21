import orderService from "../services/orderService.js";

const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId; // from auth middleware (ensure token contains `id`)
    const orderData = req.body;

    const order = await orderService.createOrder(userId, orderData);

    res.status(201).json({
      message: "Order placed successfully.",
      order,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.user.vendorId; // Extracted from authenticated vendor token
    const vendorOrders = await orderService.fetchVendorOrders(vendorId);

    res.status(200).json(vendorOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOrderItemStatus = async (req, res) => {
  try {
    const vendorId = req.user.vendorId; // From auth middleware
    const { orderId, productId, newStatus } = req.body;

    const validStatuses = ["pending", "paid", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedOrder = await orderService.updateOrderItemStatus(
      vendorId,
      orderId,
      productId,
      newStatus
    );

    res.status(200).json({
      message: "Item status updated successfully",
      order: updatedOrder,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export { createOrder, getVendorOrders, updateOrderItemStatus };
