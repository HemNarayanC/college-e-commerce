import {
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

const BusinessInfoStep = ({
  businessName,
  setBusinessName,
  businessDescription,
  setBusinessDescription,
  email,
  setEmail,
  phone,
  setPhone,
  businessType,
  setBusinessType,
  city,
  setCity,
  province,
  setProvince,
  postalCode,
  setPostalCode,
  businessTypes,
  validateEmail,
  validatePostalCode,
}) => {
  return (
    <div className="space-y-6 text-[#486e40] font-sans">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-[#d3e3c7] rounded-xl flex items-center justify-center">
          <FaBuilding className="w-6 h-6 text-[#64973f]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#486e40]">Business Information</h2>
          <p className="text-[#8f9779]">Tell us about your business to get started</p>
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Name */}
        <div className="col-span-2">
          <label className="block text-sm font-semibold mb-1">Business Name *</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full px-4 py-2.5 border border-[#cbd5b3] rounded-xl focus:outline-none"
            placeholder="Enter your business name"
            required
          />
        </div>

        {/* Business Description */}
        <div className="col-span-2">
          <label className="block text-sm font-semibold mb-1">Business Description *</label>
          <textarea
            value={businessDescription}
            onChange={(e) => setBusinessDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 border border-[#cbd5b3] rounded-xl focus:outline-none resize-none"
            placeholder="Describe what your business does..."
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold mb-1">Email Address *</label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#a3ad87]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none ${
                email && !validateEmail(email)
                  ? "border-red-300"
                  : "border-[#cbd5b3]"
              }`}
              placeholder="your@email.com"
              required
            />
          </div>
          {email && !validateEmail(email) && (
            <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold mb-1">Phone Number *</label>
          <div className="relative">
            <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#a3ad87]" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-[#cbd5b3] rounded-xl focus:outline-none"
              placeholder="+1 (555) 123-4567"
              required
            />
          </div>
        </div>

        {/* Business Category */}
        <div className="col-span-2">
          <label className="block text-sm font-semibold mb-1">Business Category *</label>
          <select
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className="w-full px-4 py-2.5 border border-[#cbd5b3] rounded-xl bg-white focus:outline-none"
            required
          >
            <option value="">Select Business Category</option>
            {businessTypes.map((type, idx) => (
              <option key={idx} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Address Section Title */}
        <div className="col-span-2">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-[#486e40]">
            <FaMapMarkerAlt className="w-5 h-5 text-[#64973f]" />
            Business Address
          </h3>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold mb-1">City *</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-2.5 border border-[#cbd5b3] rounded-xl focus:outline-none"
            placeholder="City"
            required
          />
        </div>

        {/* Province/State */}
        <div>
          <label className="block text-sm font-semibold mb-1">Province/State *</label>
          <input
            type="text"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="w-full px-4 py-2.5 border border-[#cbd5b3] rounded-xl focus:outline-none"
            placeholder="Province or State"
            required
          />
        </div>

        {/* Postal Code */}
        <div className="col-span-2">
          <label className="block text-sm font-semibold mb-1">Postal Code *</label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none ${
              postalCode && !validatePostalCode(postalCode)
                ? "border-red-300"
                : "border-[#cbd5b3]"
            }`}
            placeholder="12345 or 123456"
            pattern="[0-9]{5,6}"
            required
          />
          {postalCode && !validatePostalCode(postalCode) && (
            <p className="text-red-500 text-xs mt-1">Postal code must be 5-6 digits</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessInfoStep;
