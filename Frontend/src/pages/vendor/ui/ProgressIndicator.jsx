import { FaCheck } from "react-icons/fa";

const ProgressIndicator = ({ steps, currentStep }) => {
  return (
    <div className="mb-12">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          <div className="flex items-center justify-between relative">
            {/* Progress Line Background */}
            <div className="absolute top-5 left-0 w-full h-1 bg-[#dfe7dc] rounded-full">
              <div
                className="h-full bg-gradient-to-r from-[#64973f] to-[#486e40] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>

            {/* Steps */}
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              const isAccessible = currentStep >= step.number;

              return (
                <div key={step.number} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? "bg-gradient-to-r from-[#64973f] to-[#486e40] text-white shadow-md"
                        : isActive
                        ? "bg-[#64973f] text-white shadow-md scale-110"
                        : isAccessible
                        ? "bg-white text-[#486e40] border-2 border-[#b5c7a9] shadow-sm"
                        : "bg-[#f0f3ec] text-gray-400 border-2 border-[#e0e7da]"
                    }`}
                  >
                    {isCompleted ? (
                      <FaCheck className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="mt-3 text-center max-w-24">
                    <span
                      className={`text-sm font-semibold block ${
                        isActive
                          ? "text-[#486e40]"
                          : isCompleted
                          ? "text-[#64973f]"
                          : "text-[#8F9779]"
                      }`}
                    >
                      {step.title}
                    </span>
                    <span className="text-xs text-[#8F9779] mt-1 block">
                      {step.description}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
