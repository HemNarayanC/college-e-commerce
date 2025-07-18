import { useState, useEffect } from "react"
import {
  FaTimes,
  FaEdit,
  FaSave,
  FaStore,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaSpinner,
  FaCheck,
  FaExclamationTriangle,
  FaFileAlt,
  FaIdCard,
  FaBuilding,
  FaGlobe,
} from "react-icons/fa"
import { useSelector } from "react-redux"
import { getVendorById } from "../../api/vendorApi"
import { getUserById } from "../../api/userApi"

const VendorDetailsModal = ({ isOpen, onClose, vendorDetails, onVendorUpdated}) => {
  const token = useSelector((state) => state.auth.auth_token)
  const vendorId = vendorDetails?._id || null
  console.log("VendorDetailsModal vendor details:", vendorDetails)

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [vendor, setVendor] = useState({})
  const [associatedUser, setAssociatedUser] = useState({})

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    businessDescription: "",
    businessLicense: "",
    taxRegistration: "",
    governmentId: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    status: "pending",
    comfortTheme: "",
    website: "",
  })

  useEffect(() => {
    if (vendorId) {
      fetchVendor();
    }
  }, [vendorId]);

  const fetchVendor = async () => {
    try {
      setIsLoading(true);
      const data = await getVendorById(vendorId);
      console.log("Fetched vendor data:", data);
      setVendor(data);

      const associatedUser = await getUserById(data.userId, token);
      console.log("Associated user data:", associatedUser);
      setAssociatedUser(associatedUser);
    } catch (error) {
      console.error("Failed to load vendor:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // Initialize form data when modal opens or vendor changes
  useEffect(() => {
    if (isOpen && vendor) {
      setFormData({
        name: associatedUser.name || "",
        email: vendor.email || "",
        phone: vendor.phone || "",
        businessName: vendor.businessName || "",
        businessDescription: vendor.businessDescription || "",
        businessLicense: vendor.businessLicense || "",
        taxRegistration: vendor.taxRegistration || "",
        governmentId: vendor.governmentId || "",
        address: {
          city: vendor.address?.city || "",
          state: vendor.address?.province || "",
          zipCode: vendor.address?.postalCode || "",
          country: vendor.address?.country || "Nepal",
        },
        status: vendor.status || "pending",
        comfortTheme: vendor.comfortTheme || "",
        website: vendor.website || "",
      })
    }
  }, [isOpen, vendorId, vendor, associatedUser])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSave = async () => {
    setIsLoading(true)

    try {
      const result = await updateVendorDetails(vendor._id, formData, token)
      showToast?.(result.message)
      onVendorUpdated?.(result.vendor)
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update vendor:", error)
      showToast?.("Failed to update vendor details")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    // Reset form data to original vendor data
    setFormData({
      name: associatedUser.name || "",
      email: vendor.email || "",
      phone: vendor.phone || "",
      businessName: vendor.businessName || "",
      businessDescription: vendor.businessDescription || "",
      businessLicense: vendor.businessLicense || "",
      taxRegistration: vendor.taxRegistration || "",
      governmentId: vendor.governmentId || "",
      address: {
        street: vendor.address?.city || "",
        city: vendor.address?.city || "",
        state: vendor.address?.state || "",
        zipCode: vendor.address?.zipCode || "",
        country: vendor.address?.country || "Nepal",
      },
      status: vendor.status || "pending",
      comfortTheme: vendor.comfortTheme || "",
      website: vendor.website || "",
    })
    setIsEditing(false)
  }

  if (!isOpen || !vendor) return null

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-700 bg-green-50 border border-green-200"
      case "pending":
        return "text-yellow-700 bg-yellow-50 border border-yellow-200"
      case "rejected":
      case "suspended":
        return "text-red-700 bg-red-50 border border-red-200"
      default:
        return "text-gray-700 bg-gray-50 border border-gray-200"
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:max-w-6xl sm:w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#486e40] to-[#64973f] px-6 py-4 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <FaStore className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{vendor.businessName || "Vendor Details"}</h3>
                <p className="text-sm text-white/80">ID: {vendor._id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Status Actions */}
              {formData.status === "pending" && !isEditing && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusChange("active")}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
                    title="Approve Vendor"
                  >
                    <FaCheck className="w-3 h-3" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange("rejected")}
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
                    title="Reject Vendor"
                  >
                    <FaTimes className="w-3 h-3" />
                    Reject
                  </button>
                </div>
              )}

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                  title="Edit Vendor"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 p-6">
            {/* Left Column - Vendor Information */}
            <div className="xl:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FaStore className="text-[#486e40]" />
                    Basic Information
                  </h4>
                  {/* Status Badge */}
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(formData.status)}`}
                    >
                      {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#486e40] focus:border-transparent text-sm"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{formData.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#486e40] focus:border-transparent text-sm"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{formData.businessName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <FaEnvelope className="text-gray-500 w-3 h-3" />
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#486e40] focus:border-transparent text-sm"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{formData.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <FaPhone className="text-gray-500 w-3 h-3" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#486e40] focus:border-transparent text-sm"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{formData.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <FaGlobe className="text-gray-500 w-3 h-3" />
                      Website
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#486e40] focus:border-transparent text-sm"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {formData.website || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comfort Theme</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="comfortTheme"
                        value={formData.comfortTheme}
                        onChange={handleInputChange}
                        placeholder="e.g., Modern, Traditional, Minimalist"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#486e40] focus:border-transparent text-sm"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {formData.comfortTheme || "Not specified"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Description</label>
                  {isEditing ? (
                    <textarea
                      name="businessDescription"
                      value={formData.businessDescription}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#486e40] focus:border-transparent text-sm"
                      placeholder="Describe your business..."
                    />
                  ) : (
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {formData.businessDescription || "No description provided"}
                    </p>
                  )}
                </div>
              </div>

              {/* Business Credentials */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaFileAlt className="text-blue-600" />
                  Business Credentials
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <FaBuilding className="text-gray-500 w-3 h-3" />
                      Business License
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="businessLicense"
                        value={formData.businessLicense}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#486e40] focus:border-transparent text-sm"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {formData.businessLicense || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax Registration</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="taxRegistration"
                        value={formData.taxRegistration}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#486e40] focus:border-transparent text-sm"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {formData.taxRegistration || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <FaIdCard className="text-gray-500 w-3 h-3" />
                      Government ID
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="governmentId"
                        value={formData.governmentId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#486e40] focus:border-transparent text-sm"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {formData.governmentId || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-green-600" />
                  Business Address
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#486e40] focus:border-transparent text-sm"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {formData.address.street || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#486e40] focus:border-transparent text-sm"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {formData.address.city || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#486e40] focus:border-transparent text-sm"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {formData.address.state || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address.zipCode"
                        value={formData.address.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#486e40] focus:border-transparent text-sm"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {formData.address.zipCode || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#486e40] focus:border-transparent text-sm"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {formData.address.country || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {formData.status === "pending" && !isEditing && (
              <div className="flex items-center space-x-2 text-sm text-yellow-600">
                <FaExclamationTriangle className="w-4 h-4" />
                <span>This vendor is pending approval</span>
              </div>
            )}
          </div>
          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-4 py-2 bg-[#486e40] text-white rounded-md hover:bg-[#64973f] transition-colors text-sm font-medium flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin w-4 h-4" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorDetailsModal
