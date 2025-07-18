import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import orderService from "../services/orderService.js";

const approveVendor = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;
    const { status } = req.body; // get status from request body

    if (!status) {
      return res.status(400).json({ message: "Status is required." });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ message: "Vendor not found." });

    // Update vendor status
    vendor.status = status;
    await vendor.save();

    // If status is approved, promote user role
    if (status === "approved") {
      const user = await User.findById(vendor.userId);
      if (user && user.role === "customer") {
        user.role = "vendor";
        await user.save();
      }
    }

    res.status(200).json({ message: `Vendor status updated to ${status}.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const confirmDelivery = async (req, res) => {
  try {
    const { orderId, productId, vendorId } = req.body;

    const updatedOrder = await orderService.confirmDeliveryAndReleasePayout(
      orderId,
      productId,
      vendorId
    );

    console.log("updated order", updatedOrder)

    res.status(200).json({
      message: "Delivery confirmed and payout released.",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { approveVendor, confirmDelivery };
