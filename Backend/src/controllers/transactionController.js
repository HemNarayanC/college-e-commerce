import Transaction from "../models/Transaction.js";

export const saveCODTransaction = async (req, res) => {
  try {
    const { userId, orderId, amount, productIdentities, productNames } = req.body;

    if (!userId || !orderId || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create new transaction with status "Completed" for COD
    const transaction = new Transaction({
      userId,
      orderId,
      amount,
      status: "COD",
      productIdentities,
      productNames,
    });

    await transaction.save();

    return res.status(201).json({
      message: "COD transaction saved successfully",
      transaction,
    });
  } catch (error) {
    console.error("Error saving COD transaction:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
