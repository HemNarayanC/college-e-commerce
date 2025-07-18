import React, { useEffect, useState, useRef } from "react";
import { placeOrder, verifyKhalti } from "../api/ordersApi";
import { useNavigate } from "react-router-dom";
import { SHOP_ROUTE } from "../constants/routes";

const Spinner = () => (
  <div className="w-10 h-10 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin mx-auto" />
);

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying your payment...");
  const [referenceId, setReferenceId] = useState(null);
  const hasPlacedOrder = useRef(false);

  useEffect(() => {
    const verifyAndPlaceOrder = async () => {
      const token = localStorage.getItem("auth_token");
      const pidx = localStorage.getItem("khaltiPidx");
      const amount = localStorage.getItem("khaltiAmount");
      const storedItems = localStorage.getItem("khaltiItems");
      const storedShipping = localStorage.getItem("khaltiShipping");

      if (!token || !pidx || !amount || !storedItems || !storedShipping) {
        setStatus("error");
        setMessage("Missing payment or order information.");
        return;
      }

      try {
        const orderItems = JSON.parse(storedItems);
        const shippingAddress = JSON.parse(storedShipping);
        const data = await verifyKhalti(pidx, amount, token);

        if (
          data.transaction?.status === "Completed" &&
          !hasPlacedOrder.current
        ) {
          hasPlacedOrder.current = true;

          const orderPayload = {
            items: orderItems,
            shippingAddress,
            totalAmount: parseFloat(amount),
            paymentMethod: "khalti",
            paymentStatus: "paid",
            paymentInfo: {
              provider: "Khalti",
              pidx,
              referenceId: data.referenceId,
            },
            khaltiToken: pidx,
          };

          await placeOrder(orderPayload, token);

          setReferenceId(data.referenceId);
          setStatus("success");
          setMessage("Your payment and order were successful!");
          setTimeout(() => {
            navigate(SHOP_ROUTE);
          }, 2000);
        } else {
          setStatus("pending");
          setMessage(
            "Your payment is still pending. Please check again later."
          );
        }
      } catch (err) {
        setStatus("error");
        setMessage(
          err?.response?.data?.error ||
            err.message ||
            "Something went wrong while verifying payment."
        );
      } finally {
        localStorage.removeItem("khaltiPidx");
        localStorage.removeItem("khaltiAmount");
        localStorage.removeItem("khaltiItems");
        localStorage.removeItem("khaltiShipping");
        localStorage.removeItem("khaltiProducts");
      }
    };

    verifyAndPlaceOrder();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
        {status === "verifying" && (
          <>
            <Spinner />
            <p className="text-gray-600 mt-4">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <h2 className="text-2xl font-semibold text-green-600 mb-2">
              Payment Success
            </h2>
            <p className="text-gray-700">{message}</p>
            {referenceId && (
              <p className="text-sm text-gray-500 mt-1">Ref: {referenceId}</p>
            )}
            <a
              href="/customer/orders"
              className="mt-6 inline-block px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              View My Orders
            </a>
          </>
        )}

        {status === "pending" && (
          <>
            <h2 className="text-2xl font-semibold text-yellow-500 mb-2">
              Payment Pending
            </h2>
            <p className="text-gray-700">{message}</p>
            <a
              href="/customer/orders"
              className="mt-6 inline-block px-5 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            >
              Check Orders
            </a>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-2xl font-semibold text-red-600 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-700">{message}</p>
            <a
              href="/checkout"
              className="mt-6 inline-block px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Try Again
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
