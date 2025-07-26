import { FaShieldAlt, FaExclamationCircle } from "react-icons/fa";

const VerificationStep = ({
  governmentId,
  setGovernmentId,
  businessLicense,
  setBusinessLicense,
  taxRegistration,
  setTaxRegistration,
}) => {
  return (
    <div className="space-y-6 font-sans text-[#486e40]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <FaShieldAlt className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Business Verification</h2>
          <p className="text-[#8F9779]">Enter official identification numbers below</p>
        </div>
      </div>

      {/* Secure Info Banner */}
      <div className="bg-[#ecf3e7] border border-[#c3dac3] rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <FaExclamationCircle className="w-5 h-5 text-[#64973f] mt-0.5" />
          <div>
            <p className="text-sm font-medium text-[#486e40]">Your information is secure</p>
            <p className="text-sm text-[#7c8c73] mt-1">
              These details are encrypted and stored safely for verification purposes only.
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-5">
        {/* Government ID */}
        <div>
          <label className="block font-semibold text-sm mb-1">
            Government ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={governmentId}
            onChange={(e) => setGovernmentId(e.target.value)}
            placeholder="Enter your Government ID number"
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-0 focus:border-[#64973f] transition"
            required
          />
        </div>

        {/* Business License */}
        <div>
          <label className="block font-semibold text-sm mb-1">
            Business License Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={businessLicense}
            onChange={(e) => setBusinessLicense(e.target.value)}
            placeholder="Enter your Business License number"
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-0 focus:border-[#64973f] transition"
            required
          />
        </div>

        {/* Tax Registration */}
        <div>
          <label className="block font-semibold text-sm mb-1">
            Tax Registration ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={taxRegistration}
            onChange={(e) => setTaxRegistration(e.target.value)}
            placeholder="Enter your Tax Registration ID"
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-0 focus:border-[#64973f] transition"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default VerificationStep;
