import { FaImage, FaStore, FaUpload, FaPalette } from "react-icons/fa";

const StoreBrandingStep = ({
  logoPreview,
  handleLogoUpload,
  bannerPreview,
  handleBannerUpload,
  comfortTheme,
  setComfortTheme,
  themeOptions,
}) => {
  return (
    <div className="space-y-8 text-[#486e40] font-sans">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-[#e8dcf2] rounded-xl flex items-center justify-center">
          <FaImage className="w-6 h-6 text-[#9e6fc2]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Store Branding</h2>
          <p className="text-[#8F9779]">Upload your logo, banner and choose your store theme</p>
        </div>
      </div>

      {/* Logo Upload */}
      <div className="bg-[#f8f5f2] rounded-2xl p-5">
        <h3 className="text-lg font-semibold mb-4">Store Logo *</h3>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-28 h-28 bg-white rounded-2xl border-2 border-dashed border-[#cbd5b3] flex items-center justify-center overflow-hidden group hover:border-[#64973f] transition-colors duration-200">
            {logoPreview ? (
              <img
                src={logoPreview || "/placeholder.svg"}
                alt="Logo Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <FaStore className="w-7 h-7 text-[#a3a3a3] mx-auto mb-1" />
                <p className="text-xs text-[#a3a3a3]">No logo</p>
              </div>
            )}
          </div>

          <div className="flex-1">
            <label className="inline-flex items-center gap-2 bg-[#64973f] hover:bg-[#5a8737] text-white px-5 py-2.5 rounded-xl font-medium cursor-pointer transition-all duration-200 transform hover:scale-105">
              <FaUpload className="w-4 h-4" />
              Upload Logo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
                required
              />
            </label>
            <p className="text-sm text-[#8F9779] mt-2 leading-snug">
              Recommended: 500x500px, Max 2MB <br />
              Formats: JPG, PNG, GIF
            </p>
          </div>
        </div>
      </div>

      {/* Banner Upload */}
      <div className="bg-[#f8f5f2] rounded-2xl p-5">
        <h3 className="text-lg font-semibold mb-4">Store Banner (Optional)</h3>
        <div className="space-y-4">
          <div className="w-full h-36 bg-white rounded-2xl border-2 border-dashed border-[#cbd5b3] flex items-center justify-center overflow-hidden group hover:border-[#64973f] transition-colors duration-200">
            {bannerPreview ? (
              <img
                src={bannerPreview || "/placeholder.svg"}
                alt="Banner Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <FaImage className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No banner uploaded</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-2 bg-[#64973f] hover:bg-[#5a8737] text-white px-5 py-2.5 rounded-xl font-medium cursor-pointer transition-all duration-200 transform hover:scale-105">
              <FaUpload className="w-4 h-4" />
              Upload Banner
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBannerUpload}
              />
            </label>
            <p className="text-sm text-[#8F9779]">Recommended: 1200x300px, Max 5MB</p>
          </div>
        </div>
      </div>

      {/* Theme Selection */}
      <div className="bg-[#f8f5f2] rounded-2xl p-5">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <FaPalette className="w-5 h-5 text-[#9e6fc2]" />
          Store Theme *
        </h3>
        <p className="text-sm text-[#8F9779] mb-4">Choose a theme that matches your brand</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {themeOptions.map((theme) => (
            <label
              key={theme.value}
              className={`cursor-pointer p-3 rounded-xl border-2 transition-all duration-200 ${
                comfortTheme === theme.value
                  ? "border-[#64973f] bg-[#ecf3e7]"
                  : "border-[#d4d4d4] hover:border-[#a3a3a3] bg-white"
              }`}
            >
              <input
                type="radio"
                name="comfortTheme"
                value={theme.value}
                checked={comfortTheme === theme.value}
                onChange={(e) => setComfortTheme(e.target.value)}
                className="sr-only"
                required
              />
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full ${theme.color}`}></div>
                <span className="font-medium text-[#486e40]">{theme.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreBrandingStep;
