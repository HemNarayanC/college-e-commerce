import { FaCheck, FaStar, FaPlus, FaMapMarkerAlt, FaClock } from "react-icons/fa"

const VendorProfile = ({ vendor, onFollow, isFollowing, totalProducts, totalFollowers }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const yearsActive = Math.floor((now - date) / (1000 * 60 * 60 * 24 * 365))
    return yearsActive
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { bg: "bg-[#64973f]/10", text: "text-[#486e40]", label: "Verified" },
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
      banned: { bg: "bg-red-100", text: "text-red-800", label: "Suspended" },
    }

    const config = statusConfig[status] || statusConfig.pending
    return (
      <span className={`${config.bg} ${config.text} text-sm px-3 py-1 rounded-full flex items-center gap-1`}>
        <FaCheck className="text-xs" />
        {config.label}
      </span>
    )
  }

  return (
    <section className="container mx-auto px-4 -mt-24 relative z-10 mb-8">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-[#8F9779]/10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <div className="flex-shrink-0">
            <img
              src={vendor.storeLogo || "/placeholder.svg"}
              alt={`${vendor.businessName} Logo`}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-[#486e40]">{vendor.businessName}</h1>
                  {getStatusBadge(vendor.status)}
                  {vendor.isFeatured && (
                    <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">Featured</span>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < Math.floor(vendor.ratingAvg) ? "text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-[#8F9779] font-medium">
                    {vendor.ratingAvg?.toFixed(1)} ({totalFollowers} reviews)
                  </span>
                </div>
              </div>

              <button
                onClick={onFollow}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                  isFollowing
                    ? "bg-[#8F9779]/10 text-[#486e40] hover:bg-[#8F9779]/20"
                    : "bg-[#64973f] text-white hover:bg-[#688d4f] shadow-lg hover:shadow-xl"
                }`}
              >
                {isFollowing ? <FaCheck /> : <FaPlus />}
                {isFollowing ? "Following" : "Follow Store"}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 max-w-md mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#64973f]">{totalProducts}</div>
                <div className="text-sm text-[#8F9779]">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#64973f]">{totalFollowers}</div>
                <div className="text-sm text-[#8F9779]">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#64973f]">{formatDate(vendor.createdAt)}</div>
                <div className="text-sm text-[#8F9779]">Years active</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#8F9779]/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-[#486e40] mb-3">About {vendor.businessName}</h3>
              <p className="text-[#8F9779] leading-relaxed">{vendor.businessDescription || "No description provided."}</p>
              <div className="mt-4">
                <p className="text-sm text-[#8F9779]">
                  <strong className="text-[#486e40]">Contact:</strong> {vendor.email}
                </p>
                <p className="text-sm text-[#8F9779]">
                  <strong className="text-[#486e40]">Commission Rate:</strong>{" "}
                  {(vendor.commissionRate * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-[#486e40] mb-2">Location</h4>
                <p className="text-[#8F9779] flex items-start gap-2">
                  <FaMapMarkerAlt className="text-[#64973f] mt-1 flex-shrink-0" />
                  <span>
                    {vendor.address?.city}, {vendor.address?.province} {vendor.address?.postalCode}
                  </span>
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-[#486e40] mb-2">Business Hours</h4>
                <div className="text-[#8F9779] flex items-start gap-2">
                  <FaClock className="text-[#64973f] mt-1 flex-shrink-0" />
                  <div>
                    <div>Monday - Friday: 9AM - 6PM</div>
                    <div>Saturday: 10AM - 4PM</div>
                    <div>Sunday: Closed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VendorProfile
