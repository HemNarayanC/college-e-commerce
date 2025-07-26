import { useState } from "react"
import {
  FaCog,
  FaPalette,
  FaBell,
  FaShieldAlt,
  FaGlobe,
  FaDatabase,
  FaDownload,
  FaTrash,
  FaMoon,
  FaSun,
  FaVolumeUp,
  FaLock,
  FaKey,
  FaUserShield,
} from "react-icons/fa"

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("appearance") // <-- active tab state

  const [settings, setSettings] = useState({
    theme: "light",
    language: "en",
    timezone: "UTC-5",
    currency: "USD",
    notifications: {
      email: true,
      push: false,
      desktop: true,
      sound: true,
    },
    privacy: {
      profileVisibility: "public",
      showEmail: false,
      showPhone: false,
      allowMessages: true,
    },
    security: {
      twoFactor: false,
      loginAlerts: true,
      sessionTimeout: 30,
    },
    data: {
      analytics: true,
      cookies: true,
      tracking: false,
    },
  })

  const handleSettingChange = (category, setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }))
  }

  const handleDirectChange = (setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  const ToggleSwitch = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-11 h-6 bg-[#8F9779]/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#64973f]"></div>
    </label>
  )

  const tabs = [
    { id: "appearance", name: "Appearance", icon: FaPalette },
    { id: "notifications", name: "Notifications", icon: FaBell },
    { id: "privacy", name: "Privacy", icon: FaShieldAlt },
    { id: "security", name: "Security", icon: FaLock },
    { id: "language", name: "Language & Region", icon: FaGlobe },
    { id: "data", name: "Data & Storage", icon: FaDatabase },
  ]

  return (
    <div className="min-h-screen bg-[#f8f5f2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#486e40] mb-2">Settings</h1>
          <p className="text-[#8F9779]">Customize your experience and manage your preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-[#8F9779]/20 p-4">
              <nav className="space-y-2">
                {tabs.map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                        isActive
                          ? "bg-[#64973f] text-white"
                          : "text-[#486e40] hover:bg-[#f8f5f2]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Appearance */}
            {activeTab === "appearance" && (
              <div className="bg-white rounded-xl shadow-lg border border-[#8F9779]/20 p-6">
                <h3 className="text-xl font-semibold text-[#486e40] mb-6">
                  <FaPalette className="w-5 h-5 inline mr-2" />
                  Appearance
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#486e40] mb-3">Theme</label>
                    <div className="grid grid-cols-3 gap-4">
                      {["light", "dark", "auto"].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => handleDirectChange("theme", theme)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            settings.theme === theme
                              ? "border-[#64973f] bg-[#64973f]/10"
                              : "border-[#8F9779]/20 hover:border-[#64973f]/50"
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            {theme === "light" && <FaSun className="w-6 h-6 text-[#64973f]" />}
                            {theme === "dark" && <FaMoon className="w-6 h-6 text-[#64973f]" />}
                            {theme === "auto" && <FaCog className="w-6 h-6 text-[#64973f]" />}
                            <span className="text-sm font-medium text-[#486e40] capitalize">{theme}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#486e40] mb-3">Font Size</label>
                    <select
                      value="medium"
                      className="w-full px-4 py-3 rounded-lg bg-[#f8f5f2] text-[#486e40] focus:ring-2 focus:ring-[#64973f] border-0"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <div className="bg-white rounded-xl shadow-lg border border-[#8F9779]/20 p-6">
                <h3 className="text-xl font-semibold text-[#486e40] mb-6">
                  <FaBell className="w-5 h-5 inline mr-2" />
                  Notifications
                </h3>

                <div className="space-y-4">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {key === "sound" && <FaVolumeUp className="w-4 h-4 text-[#64973f]" />}
                        <div>
                          <p className="text-[#486e40] font-medium">
                            {key.charAt(0).toUpperCase() + key.slice(1)} Notifications
                          </p>
                          <p className="text-sm text-[#8F9779]">
                            {key === "email" && "Receive notifications via email"}
                            {key === "push" && "Receive push notifications on mobile"}
                            {key === "desktop" && "Show desktop notifications"}
                            {key === "sound" && "Play sound for notifications"}
                          </p>
                        </div>
                      </div>
                      <ToggleSwitch
                        checked={value}
                        onChange={(e) => handleSettingChange("notifications", key, e.target.checked)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy */}
            {activeTab === "privacy" && (
              <div className="bg-white rounded-xl shadow-lg border border-[#8F9779]/20 p-6">
                <h3 className="text-xl font-semibold text-[#486e40] mb-6">
                  <FaShieldAlt className="w-5 h-5 inline mr-2" />
                  Privacy
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#486e40] mb-2">Profile Visibility</label>
                    <select
                      value={settings.privacy.profileVisibility}
                      onChange={(e) => handleSettingChange("privacy", "profileVisibility", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-[#f8f5f2] text-[#486e40] focus:ring-2 focus:ring-[#64973f] border-0"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="friends">Friends Only</option>
                    </select>
                  </div>

                  {["showEmail", "showPhone", "allowMessages"].map((key) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <p className="text-[#486e40] font-medium">
                          {key === "showEmail" && "Show Email Address"}
                          {key === "showPhone" && "Show Phone Number"}
                          {key === "allowMessages" && "Allow Direct Messages"}
                        </p>
                        <p className="text-sm text-[#8F9779]">
                          {key === "showEmail" && "Display your email on your public profile"}
                          {key === "showPhone" && "Display your phone number on your profile"}
                          {key === "allowMessages" && "Allow other users to send you messages"}
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={settings.privacy[key]}
                        onChange={(e) => handleSettingChange("privacy", key, e.target.checked)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === "security" && (
              <div className="bg-white rounded-xl shadow-lg border border-[#8F9779]/20 p-6">
                <h3 className="text-xl font-semibold text-[#486e40] mb-6">
                  <FaLock className="w-5 h-5 inline mr-2" />
                  Security
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FaKey className="w-4 h-4 text-[#64973f]" />
                      <div>
                        <p className="text-[#486e40] font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-[#8F9779]">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <ToggleSwitch
                      checked={settings.security.twoFactor}
                      onChange={(e) => handleSettingChange("security", "twoFactor", e.target.checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FaUserShield className="w-4 h-4 text-[#64973f]" />
                      <div>
                        <p className="text-[#486e40] font-medium">Login Alerts</p>
                        <p className="text-sm text-[#8F9779]">Get notified of new login attempts</p>
                      </div>
                    </div>
                    <ToggleSwitch
                      checked={settings.security.loginAlerts}
                      onChange={(e) => handleSettingChange("security", "loginAlerts", e.target.checked)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#486e40] mb-2">Session Timeout</label>
                    <select
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleSettingChange("security", "sessionTimeout", Number.parseInt(e.target.value))}
                      className="w-full px-4 py-3 rounded-lg bg-[#f8f5f2] text-[#486e40] focus:ring-2 focus:ring-[#64973f] border-0"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                      <option value={0}>Never</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Language & Region */}
            {activeTab === "language" && (
              <div className="bg-white rounded-xl shadow-lg border border-[#8F9779]/20 p-6">
                <h3 className="text-xl font-semibold text-[#486e40] mb-6">
                  <FaGlobe className="w-5 h-5 inline mr-2" />
                  Language & Region
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#486e40] mb-2">Language</label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleDirectChange("language", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-[#f8f5f2] text-[#486e40] focus:ring-2 focus:ring-[#64973f] border-0"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#486e40] mb-2">Timezone</label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => handleDirectChange("timezone", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-[#f8f5f2] text-[#486e40] focus:ring-2 focus:ring-[#64973f] border-0"
                    >
                      <option value="UTC-8">Pacific Time (PT)</option>
                      <option value="UTC-5">Eastern Time (ET)</option>
                      <option value="UTC+0">Greenwich Mean Time (GMT)</option>
                      <option value="UTC+1">Central European Time (CET)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#486e40] mb-2">Currency</label>
                    <select
                      value={settings.currency}
                      onChange={(e) => handleDirectChange("currency", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-[#f8f5f2] text-[#486e40] focus:ring-2 focus:ring-[#64973f] border-0"
                    >
                      <option value="USD">US Dollar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                      <option value="GBP">British Pound (GBP)</option>
                      <option value="JPY">Japanese Yen (JPY)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Data & Storage */}
            {activeTab === "data" && (
              <div className="bg-white rounded-xl shadow-lg border border-[#8F9779]/20 p-6">
                <h3 className="text-xl font-semibold text-[#486e40] mb-6">
                  <FaDatabase className="w-5 h-5 inline mr-2" />
                  Data & Storage
                </h3>

                <div className="space-y-6">
                  {Object.entries(settings.data).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <p className="text-[#486e40] font-medium">
                          {key === "analytics" && "Analytics Data"}
                          {key === "cookies" && "Cookies"}
                          {key === "tracking" && "Usage Tracking"}
                        </p>
                        <p className="text-sm text-[#8F9779]">
                          {key === "analytics" && "Allow collection of usage analytics"}
                          {key === "cookies" && "Enable cookies for better experience"}
                          {key === "tracking" && "Track usage for personalization"}
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={value}
                        onChange={(e) => handleSettingChange("data", key, e.target.checked)}
                      />
                    </div>
                  ))}

                  <div className="border-t border-[#8F9779]/20 pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button className="flex items-center justify-center space-x-2 bg-[#64973f] text-white px-6 py-3 rounded-lg hover:bg-[#486e40] transition-colors">
                        <FaDownload className="w-4 h-4" />
                        <span>Download My Data</span>
                      </button>
                      <button className="flex items-center justify-center space-x-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors">
                        <FaTrash className="w-4 h-4" />
                        <span>Delete Account</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
