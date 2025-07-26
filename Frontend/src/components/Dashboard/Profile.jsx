import { useState, useEffect } from "react"
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaShieldAlt,
  FaBell,
  FaGlobe,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa"
import { useSelector } from "react-redux"
import dayjs from "dayjs"

const ProfilePage = () => {
  // Get user data from Redux store
  const user = useSelector((state) => state.auth.user)
  console.log("User Data for Profile ==> ", user)

  // Local state for tab, editing, password toggle
  const [activeTab, setActiveTab] = useState("personal")
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Profile data state initialized dynamically from user or fallback defaults
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "", // Not available in user, keep empty or fetch later
    bio: "", // Not available in user, keep empty or fetch later
    avatar:
      user?.profileImage ||
      "/placeholder.svg?height=120&width=120",
    company: "", // Not available, optional
    website: "", // Not available, optional
    timezone: "", // Not available, optional
    language: "", // Not available, optional
  })

  // Notification preferences - could be fetched/saved later
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: true,
    orderUpdates: true,
    profileVisibility: "public",
  })

  // Update profileData if user changes in store (e.g. after fetch)
  useEffect(() => {
    setProfileData((prev) => ({
      ...prev,
      name: user?.name || prev.name,
      email: user?.email || prev.email,
      phone: user?.phone || prev.phone,
      avatar:
        user?.profileImage ||
        prev.avatar,
    }))
  }, [user])

  // Save handler (stub)
  const handleSave = () => {
    setIsEditing(false)
    // Save logic here (e.g. API call)
  }

  // Cancel handler (stub)
  const handleCancel = () => {
    setIsEditing(false)
    // Reset logic if needed (e.g. reload from user)
    setProfileData({
      ...profileData,
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      avatar:
        user?.profileImage ||
        "/placeholder.svg?height=120&width=120",
    })
  }

  // Format date (member since)
  const memberSince = user?.createdAt
    ? dayjs(user.createdAt).format("MMM YYYY")
    : "N/A"

  // Role display mapping
  const roleLabel = {
    admin: "Administrator",
    vendor: "Vendor",
    customer: "Customer",
  }

  return (
    <div className="min-h-screen bg-[#f8f5f2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#486e40] mb-2">My Profile</h1>
          <p className="text-[#8F9779]">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <nav className="bg-white rounded-xl shadow-lg border border-[#8F9779]/20 p-6 sticky top-8">
            {/* Profile Card */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-4">
                <img
                  src={profileData.avatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#64973f]/20 mx-auto"
                />
                <button className="absolute bottom-0 right-0 bg-[#64973f] text-white p-2 rounded-full hover:bg-[#486e40] transition-colors">
                  <FaCamera className="w-3 h-3" />
                </button>
              </div>
              <h2 className="text-xl font-bold text-[#486e40] mb-1">{profileData.name || "N/A"}</h2>
              <p className="text-[#8F9779] mb-4">{profileData.email || "N/A"}</p>
              <div className="flex justify-center space-x-2">
                <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-gradient-to-r from-[#486e40] to-[#64973f] text-white">
                  {roleLabel[user?.role] || "Customer"}
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[#8F9779]">Member Since</span>
                <span className="text-[#486e40] font-medium">{memberSince}</span>
              </div>
              {/* You can replace these static stats with real data if available */}
              <div className="flex justify-between">
                <span className="text-[#8F9779]">Total Orders</span>
                <span className="text-[#486e40] font-medium">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8F9779]">Reviews Written</span>
                <span className="text-[#486e40] font-medium">12</span>
              </div>
            </div>

            {/* Tabs List */}
            <ul className="mt-10 space-y-4">
              {[
                { id: "personal", label: "Personal Information", icon: <FaUser /> },
                { id: "security", label: "Security Settings", icon: <FaShieldAlt /> },
                { id: "notifications", label: "Notification Preferences", icon: <FaBell /> },
              ].map(({ id, label, icon }) => (
                <li key={id}>
                  <button
                    onClick={() => {
                      setActiveTab(id)
                      setIsEditing(false) // reset editing on tab change
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-[#486e40] font-semibold transition-colors
                    ${
                      activeTab === id
                        ? "bg-[#64973f] text-white shadow"
                        : "hover:bg-[#d4e2c7]"
                    }`}
                  >
                    <span className="text-lg">{icon}</span>
                    <span>{label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Tab Content */}
          <main className="lg:col-span-3 space-y-6">
            {activeTab === "personal" && (
              <div className="bg-white rounded-xl shadow-lg border border-[#8F9779]/20 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-[#486e40]">Personal Information</h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 bg-[#64973f] text-white px-4 py-2 rounded-lg hover:bg-[#486e40] transition-colors"
                    >
                      <FaEdit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 bg-[#64973f] text-white px-4 py-2 rounded-lg hover:bg-[#486e40] transition-colors"
                      >
                        <FaSave className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center space-x-2 bg-[#8F9779] text-white px-4 py-2 rounded-lg hover:bg-[#486e40] transition-colors"
                      >
                        <FaTimes className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#486e40] mb-2">
                      <FaUser className="w-4 h-4 inline mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-lg bg-[#f8f5f2] text-[#486e40] placeholder-[#8F9779] focus:ring-2 focus:ring-[#64973f] border-0 disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#486e40] mb-2">
                      <FaEnvelope className="w-4 h-4 inline mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({ ...profileData, email: e.target.value })
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-lg bg-[#f8f5f2] text-[#486e40] placeholder-[#8F9779] focus:ring-2 focus:ring-[#64973f] border-0 disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#486e40] mb-2">
                      <FaPhone className="w-4 h-4 inline mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({ ...profileData, phone: e.target.value })
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-lg bg-[#f8f5f2] text-[#486e40] placeholder-[#8F9779] focus:ring-2 focus:ring-[#64973f] border-0 disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#486e40] mb-2">
                      <FaGlobe className="w-4 h-4 inline mr-2" />
                      Website
                    </label>
                    <input
                      type="url"
                      value={profileData.website}
                      onChange={(e) =>
                        setProfileData({ ...profileData, website: e.target.value })
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-lg bg-[#f8f5f2] text-[#486e40] placeholder-[#8F9779] focus:ring-2 focus:ring-[#64973f] border-0 disabled:opacity-60"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#486e40] mb-2">
                      <FaMapMarkerAlt className="w-4 h-4 inline mr-2" />
                      Address
                    </label>
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) =>
                        setProfileData({ ...profileData, address: e.target.value })
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-lg bg-[#f8f5f2] text-[#486e40] placeholder-[#8F9779] focus:ring-2 focus:ring-[#64973f] border-0 disabled:opacity-60"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#486e40] mb-2">Bio</label>
                    <textarea
                      rows={4}
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-lg bg-[#f8f5f2] text-[#486e40] placeholder-[#8F9779] focus:ring-2 focus:ring-[#64973f] border-0 disabled:opacity-60"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="bg-white rounded-xl shadow-lg border border-[#8F9779]/20 p-6">
                <h3 className="text-xl font-semibold text-[#486e40] mb-6">
                  <FaShieldAlt className="w-5 h-5 inline mr-2" />
                  Security Settings
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#486e40] mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter current password"
                        className="w-full px-4 py-3 rounded-lg bg-[#f8f5f2] text-[#486e40] placeholder-[#8F9779] focus:ring-2 focus:ring-[#64973f] border-0 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8F9779] hover:text-[#486e40]"
                      >
                        {showPassword ? (
                          <FaEyeSlash className="w-4 h-4" />
                        ) : (
                          <FaEye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#486e40] mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 rounded-lg bg-[#f8f5f2] text-[#486e40] placeholder-[#8F9779] focus:ring-2 focus:ring-[#64973f] border-0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#486e40] mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 rounded-lg bg-[#f8f5f2] text-[#486e40] placeholder-[#8F9779] focus:ring-2 focus:ring-[#64973f] border-0"
                    />
                  </div>

                  <button className="bg-[#64973f] text-white px-6 py-3 rounded-lg hover:bg-[#486e40] transition-colors">
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-white rounded-xl shadow-lg border border-[#8F9779]/20 p-6">
                <h3 className="text-xl font-semibold text-[#486e40] mb-6">
                  <FaBell className="w-5 h-5 inline mr-2" />
                  Notification Preferences
                </h3>

                <div className="space-y-4">
                  {Object.entries(preferences).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <p className="text-[#486e40] font-medium">
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        </p>
                        <p className="text-sm text-[#8F9779]">
                          {key === "emailNotifications" &&
                            "Receive notifications via email"}
                          {key === "pushNotifications" &&
                            "Receive push notifications on your device"}
                          {key === "marketingEmails" &&
                            "Receive promotional emails and offers"}
                          {key === "orderUpdates" && "Get updates about your orders"}
                          {key === "profileVisibility" && "Control who can see your profile"}
                        </p>
                      </div>
                      {key !== "profileVisibility" ? (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) =>
                              setPreferences({ ...preferences, [key]: e.target.checked })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-[#8F9779]/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#64973f]"></div>
                        </label>
                      ) : (
                        <select
                          value={value}
                          onChange={(e) =>
                            setPreferences({ ...preferences, [key]: e.target.value })
                          }
                          className="px-3 py-2 rounded-lg bg-[#f8f5f2] text-[#486e40] focus:ring-2 focus:ring-[#64973f] border-0"
                        >
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                          <option value="friends">Friends Only</option>
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
