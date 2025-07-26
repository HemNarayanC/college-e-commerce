import { FaLock, FaCreditCard, FaTrash } from "react-icons/fa"
import { useSelector } from "react-redux"

const CartSummary = ({ total, onClearCart, navigate, token }) => {
  const itemCount = useSelector((state) => state.cartCount.itemCount)
  const shipping = total > 100 ? 0 : 9.99

  const handleProceedToCheckout = () => {
    // Navigate to checkout without state (cart checkout)
    navigate("/checkout")
  }

  return (
    <div className="border-t bg-white p-4 space-y-3">
      {/* Price Breakdown */}
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal ({itemCount} items)</span>
          <span className="font-medium">Rs. {total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className={`font-medium ${shipping === 0 ? "text-[#486e40]" : ""}`}>
            {shipping === 0 ? "FREE" : `${shipping.toFixed(2)}`}
          </span>
        </div>
        {shipping === 0 && <div className="text-xs text-[#486e40] font-medium">Free shipping on orders over $100!</div>}
      </div>

      {/* Final Total
      <div className="border-t pt-2">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Total</span>
          <span className="text-lg font-bold text-[#64973f]">${finalTotal.toFixed(2)}</span>
        </div>
      </div> */}

      {/* Buttons */}
      <div className="space-y-2">
        <button
          onClick={handleProceedToCheckout}
          className="w-full bg-[#64973f] hover:bg-[#688d4f] text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <FaCreditCard className="text-sm" />
          Proceed to Checkout
        </button>
        <button
          onClick={onClearCart}
          className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
        >
          <FaTrash className="text-sm" />
          Clear Cart
        </button>
      </div>

      {/* Secure Checkout */}
      <div className="flex items-center justify-center gap-1 text-xs text-[#8F9779]">
        <FaLock className="text-xs" />
        Secure checkout
      </div>
    </div>
  )
}

export default CartSummary
