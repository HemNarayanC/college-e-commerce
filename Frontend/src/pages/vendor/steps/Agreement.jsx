import { FaFileAlt, FaStar } from "react-icons/fa";

const AgreementStep = ({
  commissionRate,
  commissionAccepted,
  setCommissionAccepted,
  termsAccepted,
  setTermsAccepted,
}) => {
  return (
    <div className="space-y-8 text-[#486e40] font-sans">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
          <FaFileAlt className="w-6 h-6 text-yellow-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Seller Agreement</h2>
          <p className="text-[#8F9779]">Review and accept our terms to complete registration</p>
        </div>
      </div>

      {/* Commission Info */}
      <div className="bg-[#f8f5f2] rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaStar className="w-5 h-5 text-yellow-500" />
          Commission Structure
        </h3>

        <div className="bg-[#ecf3e7] border border-[#c3dac3] rounded-xl p-4 mb-4">
          <p className="text-sm font-medium text-[#486e40]">
            <strong>Your Commission Rate:</strong> {(commissionRate * 100).toFixed(1)}% per sale
          </p>
          <p className="text-xs text-[#7c8c73] mt-1">
            This rate applies to all your sales and will be deducted before payouts.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-[#486e40]">
            <thead>
              <tr className="border-b border-gray-300 text-left">
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Commission</th>
                <th className="py-3 px-4 font-semibold">Listing Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                ["Electronics", "8%", "$0.50"],
                ["Fashion", "12%", "$0.30"],
                ["Home & Garden", "10%", "$0.40"],
                ["Beauty & Health", "15%", "$0.25"],
                ["Other Categories", "10%", "$0.35"],
              ].map(([cat, com, fee], i) => (
                <tr key={i} className="hover:bg-white transition-colors duration-150">
                  <td className="py-3 px-4">{cat}</td>
                  <td className="py-3 px-4 font-medium">{com}</td>
                  <td className="py-3 px-4">{fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={commissionAccepted}
              onChange={() => setCommissionAccepted(!commissionAccepted)}
              className="w-5 h-5 mt-1 accent-[#64973f] border-gray-300 rounded focus:outline-none focus:ring-0"
              required
            />
            <span className="text-sm">
              I understand and agree to the commission structure and fee schedule. Commissions will be deducted from sales before payouts.
            </span>
          </label>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="bg-[#f8f5f2] rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Terms & Conditions</h3>

        <div className="bg-white rounded-xl p-4 max-h-60 overflow-y-auto text-sm text-[#4a4a4a] space-y-3 border border-gray-200">
          {[
            ["Seller Eligibility", "Sellers must be at least 18 years old and have legal capacity to enter binding contracts."],
            ["Product Listings", "All products must comply with marketplace policies and applicable laws. Prohibited items include counterfeit goods and illegal products."],
            ["Seller Responsibilities", "Sellers are responsible for product descriptions, inventory management, order fulfillment, and customer service."],
            ["Payment Processing", "MultiVendor processes payments on behalf of sellers. Payouts made according to schedule, less applicable fees."],
            ["Returns and Refunds", "Sellers must comply with marketplace return policy. Disputes handled through our resolution process."],
            ["Account Status", "Your account will start with 'pending' status and be reviewed for approval. We reserve the right to suspend accounts for policy violations."],
            ["Tax Responsibilities", "Sellers are responsible for complying with all applicable tax laws in their jurisdiction."],
            ["Policy Updates", "Terms may be updated. Continued platform use constitutes acceptance of changes."]
          ].map(([title, content], i) => (
            <p key={i}>
              <strong>{i + 1}. {title}:</strong> {content}
            </p>
          ))}
        </div>

        <div className="mt-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={() => setTermsAccepted(!termsAccepted)}
              className="w-5 h-5 mt-1 accent-[#64973f] border-gray-300 rounded focus:outline-none focus:ring-0"
              required
            />
            <span className="text-sm">
              I have read, understood, and agree to the Terms & Conditions, Privacy Policy, and Seller Guidelines of Cozy Comfort Marketplace.
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AgreementStep;
