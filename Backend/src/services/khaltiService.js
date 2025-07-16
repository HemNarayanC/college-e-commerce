import axios from "axios";
import Transaction from "../models/Transaction.js";

const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;
const KHALTI_BASE_URL = "https://dev.khalti.com/api/v2/epayment";

export const initiateKhaltiPayment = async ({ amount, products, user }) => {
  const purchaseOrderId = `PO-${Date.now()}`;
  const amountPaisa = Math.round(amount * 100);
  console.log("User is ", user);

  const payload = {
    return_url: "http://localhost:3000/payment/success",
    website_url: "http://localhost:3000",
    amount: amountPaisa,
    purchase_order_id: purchaseOrderId,
    purchase_order_name: products.map((p) => p.name).join(", "),
    customer_info: {
      name: user.name || "Unknown",
      email: user.email || "unknown@example.com",
      phone: user.phone || "0000000000",
    },
    product_details: products.map((p) => ({
      identity: p.identity.toString(),
      name: p.name,
      total_price: Math.round(p.total_price * 100),
      quantity: p.quantity || 1,
      unit_price: Math.round(p.unit_price * 100 || p.total_price * 100),
    })),
  };

  // Call Khalti API to initiate payment
  const response = await axios.post(`${KHALTI_BASE_URL}/initiate/`, payload, {
    headers: {
      Authorization: `Key ${KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  });

  console.log("khalti initiation response", response.data);

  const { pidx } = response.data;

  // Create and save transaction document in MongoDB
  const txn = new Transaction({
    userId: user._id,
    amount: amountPaisa,
    status: "Created",
    token: null,
    transactionIdx: pidx,
    productIdentities: products.map((p) => p.identity.toString()),
    productNames: products.map((p) => p.name),
    purchaseOrderId,
    khaltiUser: {
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });

  await txn.save(); // Save transaction document

  return {
    pidx,
    payment_url: response.data.payment_url,
    transactionId: txn._id,
  };
};

export const verifyKhaltiTransaction = async (token, amount) => {
  const amountPaisa = Number(amount);
  console.log("verification received", amountPaisa, token);

  const response = await axios.post(
    "https://dev.khalti.com/api/v2/epayment/lookup/",
    { pidx: token },
    {
      headers: {
        Authorization: `Key ${KHALTI_SECRET_KEY}`,
      },
    }
  );

  console.log("khalti verification response", response.data);

  const data = response.data;

  // Check payment status first
  if (data.status !== "Completed") {
    // If payment not completed, throw an error or return failure response
    throw new Error(`Payment status is ${data.status}, verification failed`);
  }

  // If payment is completed, extract idx and user info
  const idx = data.pidx || data.transaction_id || null;
  const user = data.user || {};

  if (!idx) {
    throw new Error("Transaction ID missing in Khalti response");
  }

  // Update transaction in DB
  const txn = await Transaction.findOneAndUpdate(
    { transactionIdx: idx },
    {
      token,
      status: "Completed",
    },
    { new: true }
  );

  if (!txn) {
    throw new Error("Transaction not found for verification");
  }

  return {
    success: true,
    transaction: txn,
    referenceId: idx,
  };
};
