const BUSINESS_TYPES = [
  "Retail Store",
  "Online Store",
  "Restaurant",
  "Service Provider",
  "Manufacturer",
  "Wholesaler",
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Beauty & Health",
  "Other",
];

const THEME_OPTIONS = [
  { value: "modern", label: "Modern", color: "bg-blue-500" },
  { value: "classic", label: "Classic", color: "bg-gray-600" },
  { value: "vibrant", label: "Vibrant", color: "bg-purple-500" },
  { value: "minimal", label: "Minimal", color: "bg-green-500" },
  { value: "elegant", label: "Elegant", color: "bg-pink-500" },
  { value: "bold", label: "Bold", color: "bg-red-500" },
];

const COMMISSION_RATES = [
  { category: "Electronics", rate: 8, listingFee: 0.5 },
  { category: "Fashion", rate: 12, listingFee: 0.3 },
  { category: "Home & Garden", rate: 10, listingFee: 0.4 },
  { category: "Beauty & Health", rate: 15, listingFee: 0.25 },
  { category: "Other Categories", rate: 10, listingFee: 0.35 },
];

const DEFAULT_FORM_DATA = {
  // Step 1: Business Information
  businessName: "",
  businessDescription: "",
  email: "",
  phone: "",
  businessType: "",
  city: "",
  province: "",
  postalCode: "",

  // Step 2: Store Branding
  logoPreview: "",
  bannerPreview: "",
  comfortTheme: "",

  // Step 3: Verification Documents
  governmentId: "",
  businessLicense: "",
  taxRegistration: "",

  // Step 4: Agreement
  commissionAccepted: false,
  termsAccepted: false,

  // Default values from schema
  commissionRate: 0.1,
  isFeatured: false,
}

export { BUSINESS_TYPES, THEME_OPTIONS, COMMISSION_RATES, DEFAULT_FORM_DATA };
