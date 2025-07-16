import User from "../models/User.js";
import {
  initiateKhaltiPayment,
  verifyKhaltiTransaction,
} from "../services/khaltiService.js";

export const initiatePayment = async (req, res) => {
  try {
    const { amount, products } = req.body;

    if (!amount || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const dbUser = await User.findById(req.user.userId);

    if (!dbUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = {
      _id: dbUser._id,
      name: dbUser.name,
      email: dbUser.email,
      phone: dbUser.phone,
    };

    const result = await initiateKhaltiPayment({ amount, products, user });

    res.status(200).json(result);
  } catch (error) {
    console.error("Khalti initiate error:", error.message);
    res.status(500).json({ error: "Failed to initiate payment" });
  }
};

export const verifyPayment = async (req, res) => {
  console.log("the query is", req.query)
  try {
    const { token, amount } = req.query;

    if (!token || !amount) {
      return res.status(400).json({ error: "Token and amount required" });
    }

    const result = await verifyKhaltiTransaction(token, amount);
    console.log("Result is ", result)
    res.status(200).json(result);
  } catch (error) {
    console.error("Khalti verification error:", error.message);
    res.status(500).json({ error: "Failed to verify payment" });
  }
};
