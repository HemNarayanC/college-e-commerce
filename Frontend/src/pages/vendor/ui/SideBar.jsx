import { FaCheck, FaExclamationCircle } from "react-icons/fa";

const Sidebar = ({ steps, currentStep }) => {
  return (
    <div className="w-full lg:w-1/3">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Registration Progress
        </h3>
        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.number} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep > step.number
                    ? "bg-green-100 text-green-600"
                    : currentStep === step.number
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {currentStep > step.number ? (
                  <FaCheck className="w-4 h-4" />
                ) : (
                  step.number
                )}
              </div>
              <div>
                <p
                  className={`text-sm font-medium ${
                    currentStep >= step.number
                      ? "text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Account Status Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Account Status
          </h4>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-2">
              <FaExclamationCircle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">
                Pending Approval
              </span>
            </div>
            <p className="text-xs text-yellow-700 mt-1">
              Your account will be reviewed within 2-3 business days after
              submission.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Need Help?
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            Our support team is here to help you through the registration
            process.
          </p>
          <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
