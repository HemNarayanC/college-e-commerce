import { verifyKhaltiTransaction } from "../services/khaltiService.js";
import orderService from "../services/orderService.js";
const createOrder = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { paymentMethod, khaltiToken, totalAmount } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User not found." });
    }

    if (!paymentMethod) {
      return res.status(400).json({ error: "Payment method is required." });
    }

    if (paymentMethod === "khalti") {
      if (!khaltiToken || !totalAmount) {
        return res.status(400).json({ error: "Khalti token and amount required" });
      }

      const verification = await verifyKhaltiTransaction(khaltiToken, totalAmount);
      if (!verification.success) {
        return res.status(400).json({ error: "Khalti verification failed" });
      }
    }

    const order = await orderService.createOrder(userId, req.body);

    return res.status(201).json({
      message: "Order placed successfully.",
      order,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ error: "Internal Server Error" });
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
    const vendorId = req.user.vendorId; // Assuming auth middleware sets req.user
    const { orderId, productId, newStatus } = req.body;

    const validStatuses = ["processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(newStatus.toLowerCase().trim())) {
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
    console.error("Error in updateOrderItemStatusHandler:", err);
    res.status(500).json({ error: err.message });
  }
};

export { createOrder, getVendorOrders, updateOrderItemStatus };
