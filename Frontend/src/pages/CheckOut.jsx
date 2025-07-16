import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getProductById } from "../api/productApi";
import { initiateKhalti, placeOrder, verifyKhalti } from "../api/ordersApi";
import {
  FaArrowLeft,
  FaCreditCard,
  FaTruck,
  FaCheck,
  FaShieldAlt,
  FaStore,
  FaBox,
  FaSpinner,
  FaEnvelope,
  FaLock,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCheckCircle,
  FaTag,
} from "react-icons/fa";
import { getUserProfile } from "../api/userApi";

// Khalti Payment Button
const KhaltiButton = ({ amount, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <button
      onClick={handlePay}
      disabled={isProcessing}
      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
    >
      {isProcessing ? (
        <div className="flex items-center justify-center gap-3">
          <FaSpinner className="animate-spin text-xl" />
          <span>Processing Payment...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-3">
          <FaCreditCard className="text-xl" />
          <span>Pay Rs. {amount.toLocaleString()} with Khalti</span>
        </div>
      )}
    </button>
  );
};

const CheckoutPage = () => {
  const token = useSelector((state) => state.auth.auth_token);
  const { state } = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [checkoutType, setCheckoutType] = useState("single");
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod");
  const [userProfile, setUserProfile] = useState(null);

  // Form data for shipping and contact info
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const paymentMethods = [
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: FaTruck,
      color: "bg-slate-600",
    },
    {
      id: "khalti",
      name: "Khalti",
      icon: FaCreditCard,
      color: "bg-purple-600",
    },
  ];

  useEffect(() => {
    const init = async () => {
      try {
        // Cart-based checkout
        if (state?.from === "cart" && state?.cartData?.length > 0) {
          setCheckoutType("cart");
          const checkoutItems = state.cartData.map((item) => {
            const productData = item.productId || item.product;
            let variant = null;
            if (item.variantId && productData.variants) {
              variant = productData.variants.find(
                (v) => v._id === item.variantId
              );
            }
            return {
              product: productData,
              variant,
              quantity: item.quantity,
              price: variant?.price || productData.price,
              cartId: item._id,
            };
          });
          setProducts(checkoutItems);
        }
        // Buy Now checkout
        else if (state?.productId) {
          setCheckoutType("single");
          const { productId, variantId, quantity } = state;
          if (!productId || !quantity || quantity < 1) return navigate("/");
          const productData = await getProductById(productId);
          let variant = null;
          if (variantId && productData.variants) {
            variant = productData.variants.find((v) => v._id === variantId);
          }
          setProducts([
            {
              product: productData,
              variant,
              quantity,
              price: variant?.price || productData.price,
            },
          ]);
        } else {
          navigate("/");
        }
      } catch (err) {
        console.error("Checkout error:", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [state, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await getUserProfile(token);
        setUserProfile(user);

        setFormData((prev) => ({
          ...prev,
          email: user?.email || "",
          fullName: user?.name || "",
          phone: user?.phone || "",
        }));
      } catch (error) {
        console.log("Error in fetching user profile", error);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (method) => {
    setOrderProcessing(true);
    try {
      const shippingAddress = {
        line1: formData.address,
        city: formData.city,
        zip: formData.zipCode,
      };

      const items = products.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
        variant: item.variant?.color ? { color: item.variant.color } : null,
      }));

      const totalAmount = products.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      let payload = {
        items,
        paymentMethod: method,
        shippingAddress,
        totalAmount,
      };

      if (method === "khalti") {
        const khaltiProducts = products.map((item) => ({
          identity: item.product._id.toString(),
          name: item.product.name,
          total_price: item.price * item.quantity,
          quantity: item.quantity,
          unit_price: item.price,
        }));

        console.log("Khalti initiate payload:", {
          amount: totalAmount,
          products: khaltiProducts,
        });

        const { pidx, payment_url } = await initiateKhalti(
          { amount: totalAmount, products: khaltiProducts },
          token
        );

        // ✅ Store info in localStorage for verification page
        localStorage.setItem("khaltiPidx", pidx);
        localStorage.setItem("khaltiAmount", totalAmount); // convert to paisa
        localStorage.setItem("auth_token", token);

        // ✅ Redirect user to Khalti payment page
        window.location.href = payment_url;
        return; // stop here, verification will happen on return_url
      }

      // For other payment methods
      await placeOrder(payload, token);
      setShowSuccess(true);
    } catch (err) {
      alert(err.message || "Order failed. Try again.");
    } finally {
      setOrderProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handlePlaceOrder(selectedPaymentMethod);
  };

  const totalAmount = products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = products.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = 0;
  const finalTotal = totalAmount + shipping;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Loading Checkout
          </h2>
          <p className="text-slate-600">
            Please wait while we prepare your order...
          </p>
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
          <FaBox className="text-5xl text-slate-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            No Items Found
          </h2>
          <p className="text-slate-600 mb-6">
            Your checkout is empty. Please add items to continue.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheck className="text-3xl text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. You'll receive a confirmation email
            shortly.
          </p>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Order #</span>
              <span className="font-semibold">
                ORD-2025-{Math.random().toString(36).substr(2, 6).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Total Paid</span>
              <span className="font-semibold text-green-600">
                Rs. {finalTotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Estimated Delivery</span>
              <span className="font-semibold">3-5 business days</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/orders")}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors mb-3"
          >
            Track Your Order
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <FaArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Secure Checkout
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <FaEnvelope className="text-blue-600 text-sm" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Contact Information
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none text-sm transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+977 98XXXXXXXX"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none text-sm transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <FaTruck className="text-green-600 text-sm" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Shipping Address
                  </h2>
                </div>

                <div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="John"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none text-sm transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Main Street"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none text-sm transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Kathmandu"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none text-sm transition-all"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State/Province
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Bagmati"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none text-sm transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="44600"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none text-sm transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <FaCreditCard className="text-purple-600 text-sm" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Payment Method
                  </h2>
                </div>

                {/* Payment Method Selection */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {paymentMethods.map((method) => {
                    const IconComponent = method.icon;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={`p-4 border-2 rounded-xl transition-all hover:border-blue-300 cursor-pointer ${
                          selectedPaymentMethod === method.id
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 ${method.color} rounded-lg flex items-center justify-center mb-2`}
                          >
                            <IconComponent className="text-white text-lg" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {method.name}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Payment Method Details */}
                {selectedPaymentMethod === "khalti" && (
                  <div className="text-center py-8">
                    <FaCreditCard className="text-4xl text-purple-400 mb-4 mx-auto" />
                    <p className="text-gray-600">
                      You'll be redirected to Khalti to complete your payment
                      securely.
                    </p>
                  </div>
                )}

                {selectedPaymentMethod === "cod" && (
                  <div className="text-center py-8">
                    <FaTruck className="text-4xl text-slate-400 mb-4 mx-auto" />
                    <p className="text-gray-600">
                      Pay with cash when your order is delivered to your
                      doorstep.
                    </p>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-24">
              <h3 className="text-xl font-semibold mb-6 text-gray-900">
                Order Summary
              </h3>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {products.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="relative">
                      <img
                        src={
                          item.product.images?.[0] ||
                          "/placeholder.svg?height=64&width=64"
                        }
                        alt={item.product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {item.product.name}
                      </h4>
                      {item.variant?.color && (
                        <p className="text-sm text-purple-600 mb-1">
                          Color: {item.variant.color}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        {item.product.categoryId?.name && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {item.product.categoryId.name}
                          </span>
                        )}
                        {item.product.vendorId?.businessName && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {item.product.vendorId.businessName}
                          </span>
                        )}
                      </div>
                      <p className="text-lg font-bold text-blue-600">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    type="button"
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    <FaTag className="inline mr-2" />
                    Apply
                  </button>
                </div>
              </div>

              {/* Order Total */}
              <div className="border-t border-gray-200 pt-6 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>Rs. {totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span>Rs. {finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Complete Order Button */}
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={orderProcessing}
                className={`w-full mt-6 py-4 px-6 rounded-xl font-semibold text-white transition-all ${
                  orderProcessing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                }`}
              >
                {orderProcessing ? (
                  <div className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <FaLock className="mr-2" />
                    Complete Order - Rs. {finalTotal.toLocaleString()}
                  </div>
                )}
              </button>

              {/* Security Badges */}
              <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <FaShieldAlt className="mr-1 text-green-500" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center">
                  <FaCcVisa className="mr-1" />
                  <span>Visa</span>
                </div>
                <div className="flex items-center">
                  <FaCcMastercard className="mr-1" />
                  <span>Mastercard</span>
                </div>
                <div className="flex items-center">
                  <FaCcPaypal className="mr-1" />
                  <span>PayPal</span>
                </div>
              </div>

              {/* Money Back Guarantee */}
              <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center text-green-700">
                  <FaCheckCircle className="mr-3 text-lg" />
                  <div>
                    <p className="font-semibold">30-Day Money Back Guarantee</p>
                    <p className="text-sm text-green-600">
                      Shop with confidence
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
