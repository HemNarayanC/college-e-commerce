import { FaTruck, FaUndo, FaShieldAlt } from "react-icons/fa"

const ShippingInfo = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-[#8F9779]/20">
      <div className="flex items-center gap-3">
        <FaTruck className="w-5 h-5 text-[#64973f]" />
        <div>
          <div className="font-medium text-[#486e40] text-sm">Free Shipping</div>
          <div className="text-xs text-[#8F9779]">Orders over $50</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <FaUndo className="w-5 h-5 text-[#64973f]" />
        <div>
          <div className="font-medium text-[#486e40] text-sm">30-Day Returns</div>
          <div className="text-xs text-[#8F9779]">Easy returns</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <FaShieldAlt className="w-5 h-5 text-[#64973f]" />
        <div>
          <div className="font-medium text-[#486e40] text-sm">2-Year Warranty</div>
          <div className="text-xs text-[#8F9779]">Full coverage</div>
        </div>
      </div>
    </div>
  )
}

export default ShippingInfo
