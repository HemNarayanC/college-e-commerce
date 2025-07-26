import React, { useEffect, useState } from "react";

const ProfileSettings = ({ user }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        profileImage: user.profileImage || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const showToast = (msg) => alert(msg); // Replace with your real toast logic

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Profile Settings</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      <div className="flex items-start space-x-6 mb-8">
        <img
          className="h-24 w-24 rounded-full object-cover"
          src={formData.profileImage || "/default-avatar.png"}
          alt="Profile"
        />
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">{formData.name}</h3>
          <p className="text-sm text-gray-500">
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)} since{" "}
            {new Date(user.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
            })}
          </p>
        </div>
        <button
          onClick={() => showToast("Change photo clicked")}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Change Photo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          id="name"
          label="Full Name"
          value={formData.name}
          onChange={handleChange}
        />
        <InputField
          id="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <InputField
          id="phone"
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
        />
        <InputField
          id="profileImage"
          label="Profile Image URL"
          type="text"
          value={formData.profileImage}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end mt-8 space-x-3">
        <button
          onClick={() => showToast("Changes discarded")}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => showToast("Profile saved successfully")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

const InputField = ({ id, label, type = "text", value, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
    />
  </div>
);

export default ProfileSettings;
