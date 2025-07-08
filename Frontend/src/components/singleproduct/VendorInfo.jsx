import { FaStar, FaStore, FaMapMarkerAlt } from "react-icons/fa"

const VendorInfo = ({ vendor }) => {
  if (!vendor) return null

  return (
    <div className="bg-[#f8f5f2] rounded-xl p-4 border border-[#8F9779]/10">
      <div className="flex items-center gap-4">
        <img
          src={vendor.storeLogo || "/placeholder.svg"}
          alt={vendor.businessName}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <h4 className="font-semibold text-[#486e40]">{vendor.businessName}</h4>
          <div className="flex items-center gap-2 text-sm text-[#8F9779]">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(vendor.ratingAvg || 0) ? "text-yellow-400" : "text-[#8F9779]/30"
                  }`}
                />
              ))}
            </div>
            <span>{vendor.ratingAvg?.toFixed(1) || "0.0"}</span>
            <span>•</span>
            <FaMapMarkerAlt className="w-3 h-3" />
            <span>
              {vendor.address?.city || "Unknown"}, {vendor.address?.province || ""}
            </span>
          </div>
        </div>
        <button className="bg-[#64973f] hover:bg-[#486e40] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
          <FaStore className="w-4 h-4" />
          Visit Store
        </button>
      </div>
    </div>
  )
}

export default VendorInfo
