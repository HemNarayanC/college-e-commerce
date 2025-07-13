import {
  FaStore,
  FaImage,
  FaFileAlt,
  FaCheckCircle,
} from "react-icons/fa";

// Step Components
import BusinessInfoStep from "./steps/BusinessInfo";
import StoreBrandingStep from "./steps/StoreBranding";
import VerificationStep from "./steps/Verification";
import AgreementStep from "./steps/Agreement";

// UI Components
import ProgressIndicator from "./ui/ProgressIndicator";
import NavigationButton from "./ui/NavigationBtn";
import Sidebar from "./ui/SideBar";
import Modal from "./ui/Modal";

// Hook
import useVendorRegistrationForm from "../../hooks/useVendorRegistration";

// Constants
import { BUSINESS_TYPES, THEME_OPTIONS } from "../../constants/vendorRegistration";

// Validation helpers
const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
const validatePostalCode = (code) => /^\d{4,6}$/.test(code);

const steps = [
  { number: 1, title: "Business Info", icon: FaStore, description: "Tell us about your business" },
  { number: 2, title: "Store Branding", icon: FaImage, description: "Upload your logo and banner" },
  { number: 3, title: "Verification", icon: FaFileAlt, description: "Verify your business documents" },
  { number: 4, title: "Agreement", icon: FaCheckCircle, description: "Review and accept terms" },
];

const VendorRegistration = () => {
  const {
    formData,
    currentStep,
    updateFormData,
    nextStep,
    prevStep,
    isStepComplete,
    handleSubmit,
    modal,
    closeModal,
  } = useVendorRegistrationForm();

  const handleImageUpload = (e, previewField, fileField) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData(fileField, file);
      const reader = new FileReader();
      reader.onload = (event) => updateFormData(previewField, event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BusinessInfoStep
            {...formData}
            setBusinessName={(v) => updateFormData("businessName", v)}
            setBusinessDescription={(v) => updateFormData("businessDescription", v)}
            setEmail={(v) => updateFormData("email", v)}
            setPhone={(v) => updateFormData("phone", v)}
            setBusinessType={(v) => updateFormData("businessType", v)}
            setCity={(v) => updateFormData("city", v)}
            setProvince={(v) => updateFormData("province", v)}
            setPostalCode={(v) => updateFormData("postalCode", v)}
            businessTypes={BUSINESS_TYPES}
            validateEmail={validateEmail}
            validatePostalCode={validatePostalCode}
          />
        );
      case 2:
        return (
          <StoreBrandingStep
            logoPreview={formData.logoPreview}
            handleLogoUpload={(e) => handleImageUpload(e, "logoPreview", "logoFile")}
            bannerPreview={formData.bannerPreview}
            handleBannerUpload={(e) => handleImageUpload(e, "bannerPreview", "bannerFile")}
            comfortTheme={formData.comfortTheme}
            setComfortTheme={(v) => updateFormData("comfortTheme", v)}
            themeOptions={THEME_OPTIONS}
          />
        );
      case 3:
        return (
          <VerificationStep
            governmentId={formData.governmentId}
            setGovernmentId={(v) => updateFormData("governmentId", v)}
            businessLicense={formData.businessLicense}
            setBusinessLicense={(v) => updateFormData("businessLicense", v)}
            taxRegistration={formData.taxRegistration}
            setTaxRegistration={(v) => updateFormData("taxRegistration", v)}
          />
        );
      case 4:
        return (
          <AgreementStep
            commissionRate={formData.commissionRate}
            commissionAccepted={formData.commissionAccepted}
            setCommissionAccepted={(v) => updateFormData("commissionAccepted", v)}
            termsAccepted={formData.termsAccepted}
            setTermsAccepted={(v) => updateFormData("termsAccepted", v)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f2] py-16 font-sans text-[#486e40]">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#64973f] text-white px-5 py-2 rounded-full text-base font-semibold mb-4 tracking-wide shadow-sm">
            <FaStore className="w-5 h-5" />
            Vendor Registration
          </div>
          <h1 className="text-5xl font-extrabold font-serif mb-3 leading-tight">
            Join Our Cozy Marketplace
          </h1>
          <p className="text-lg max-w-3xl mx-auto text-[#8F9779] tracking-wide">
            Start selling your products with warmth and care. Complete the
            registration process to bring your comfort brand to life.
          </p>
        </div>

        {/* Progress Bar */}
        <ProgressIndicator
          steps={steps}
          currentStep={currentStep}
          activeColor="#64973f"
          inactiveColor="#cbd5b3"
        />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Container */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8">
                <form onSubmit={handleSubmit}>
                  {renderCurrentStep()}

                  <NavigationButton
                    currentStep={currentStep}
                    prevStep={prevStep}
                    nextStep={nextStep}
                    isStepComplete={isStepComplete}
                    termsAccepted={formData.termsAccepted}
                    commissionAccepted={formData.commissionAccepted}
                  />
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <Sidebar steps={steps} currentStep={currentStep} />
        </div>
      </div>

      {/* Modal */}
      <Modal {...modal} onClose={closeModal} />
    </div>
  );
};

export default VendorRegistration;
