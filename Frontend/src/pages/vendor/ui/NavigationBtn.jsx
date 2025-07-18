import { FaArrowLeft, FaArrowRight, FaCheckCircle } from "react-icons/fa";

const NavigationButton = ({
  currentStep,
  prevStep,
  nextStep,
  isStepComplete,
  termsAccepted,
  commissionAccepted,
}) => {
  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#e2e8e0]">
      {/* Back Button */}
      {currentStep > 1 ? (
        <button
          type="button"
          onClick={prevStep}
          className="inline-flex items-center gap-2 bg-[#f0f3ec] hover:bg-[#e3e8dc] text-[#486e40] px-5 py-2.5 rounded-xl font-medium transition-all duration-200"
        >
          <FaArrowLeft className="w-4 h-4" />
          Previous Step
        </button>
      ) : (
        <div></div>
      )}

      {/* Next or Submit */}
      {currentStep < 4 ? (
        <button
          type="button"
          onClick={nextStep}
          disabled={!isStepComplete(currentStep)}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 transform ${
            isStepComplete(currentStep)
              ? "bg-gradient-to-r from-[#64973f] to-[#486e40] text-white hover:scale-105"
              : "bg-[#e0e7da] text-gray-400 cursor-not-allowed"
          }`}
        >
          Next Step
          <FaArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="submit"
          disabled={!termsAccepted || !commissionAccepted}
          className={`inline-flex items-center gap-2 px-7 py-3 rounded-xl font-medium transition-all duration-200 transform ${
            termsAccepted && commissionAccepted
              ? "bg-gradient-to-r from-[#64973f] to-[#486e40] text-white hover:scale-105"
              : "bg-[#e0e7da] text-gray-400 cursor-not-allowed"
          }`}
        >
          <FaCheckCircle className="w-5 h-5" />
          Complete Registration
        </button>
      )}
    </div>
  );
};

export default NavigationButton;
