import { useState } from "react";
import { useSelector } from "react-redux";
import { DEFAULT_FORM_DATA } from "../constants/vendorRegistration";
import { registerVendor } from "../api/vendorApi";
import { EMAIL_REGEX } from "../constants/regex";

const useVendorRegistrationForm = () => {
  const token = useSelector((state) => state.auth.auth_token);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(1);
  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
    success: false,
  });

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const isValidEmail = (email) => EMAIL_REGEX.test(email);

  const isStepComplete = (step) => {
    switch (step) {
      case 1:
        return (
          formData.businessName &&
          formData.businessDescription &&
          formData.email &&
          formData.phone &&
          formData.businessType &&
          formData.city &&
          formData.province &&
          formData.postalCode
        );
      case 2:
        return (
          formData.logoFile && formData.bannerFile && formData.comfortTheme
        );
      case 3:
        return (
          formData.governmentId &&
          formData.businessLicense &&
          formData.taxRegistration
        );
      case 4:
        return formData.commissionAccepted && formData.termsAccepted;
      default:
        return false;
    }
  };

  const resetForm = () => {
    setFormData(DEFAULT_FORM_DATA);
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(formData.email)) {
      return setModal({
        open: true,
        title: "Invalid Email",
        message: "Please enter a valid email address.",
        success: false,
      });
    }

    const payload = new FormData();
    payload.append("businessName", formData.businessName);
    payload.append("businessDescription", formData.businessDescription);
    payload.append("email", formData.email.trim().toLowerCase());
    payload.append("phone", formData.phone);
    payload.append("businessType", formData.businessType);
    payload.append("comfortTheme", formData.comfortTheme);
    payload.append("governmentId", formData.governmentId);
    payload.append("businessLicense", formData.businessLicense);
    payload.append("taxRegistration", formData.taxRegistration);
    payload.append("commissionRate", String(formData.commissionRate));
    payload.append("isFeatured", String(formData.isFeatured));

    const address = {
      city: formData.city,
      province: formData.province,
      postalCode: formData.postalCode,
    };
    payload.append("address", JSON.stringify(address));

    if (formData.logoFile) {
      payload.append("storeLogo", formData.logoFile);
    }
    if (formData.bannerFile) {
      payload.append("storeBanner", formData.bannerFile);
    }

    try {
      const response = await registerVendor(payload, token);
      setModal({
        open: true,
        title: "Success",
        message: response.message || "Vendor registered successfully.",
        success: true,
      });
      resetForm();
    } catch (error) {
      setModal({
        open: true,
        title: "Error",
        message:
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Something went wrong.",
        success: false,
      });
    }
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, open: false }));
  };

  return {
    formData,
    currentStep,
    setCurrentStep,
    updateFormData,
    nextStep,
    prevStep,
    isStepComplete,
    resetForm,
    handleSubmit,
    modal,
    closeModal,
  };
};

export default useVendorRegistrationForm;