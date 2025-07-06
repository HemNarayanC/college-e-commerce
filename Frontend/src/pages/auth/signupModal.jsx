import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/auth/authActions";
import { clearRegisterSuccess } from "../../redux/auth/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { EMAIL_REGEX, PHONE_REGEX } from "../../constants/regex";
import SuccessModal from "../../components/modals/SuccessModal";

const SignupModal = ({ onClose, onSwitchToLogin }) => {
  const dispatch = useDispatch();
  const { loading, error, registerSuccess } = useSelector(
    (state) => state.auth
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validateFields = () => {
    const errors = {};
    let hasError = false;

    if (!name.trim()) {
      errors.name = "Name is required";
      hasError = true;
    } else if (name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
      hasError = true;
    }

    if (!email.trim()) {
      errors.email = "Email is required";
      hasError = true;
    } else if (!EMAIL_REGEX.test(email)) {
      errors.email = "Please enter a valid email address";
      hasError = true;
    }

    if (!phone.trim()) {
      errors.phone = "Phone number is required";
      hasError = true;
    } else if (!PHONE_REGEX.test(phone)) {
      errors.phone = "Phone number is invalid";
      hasError = true;
    }

    if (!password) {
      errors.password = "Password is required";
      hasError = true;
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
      hasError = true;
    }

    if (password && confirmPassword && password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      hasError = true;
    }

    setFieldErrors(errors);
    return !hasError;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!validateFields()) return;
    dispatch(registerUser({ name, email, phone, password }));
  };

  useEffect(() => {
    if (registerSuccess) {
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setFieldErrors({});
      dispatch(clearRegisterSuccess());
      setShowSuccessModal(true);
    }
  }, [registerSuccess, dispatch]);

  return (
    <>
      {!showSuccessModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
              aria-label="Close modal"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-[#486e40] mb-6 text-center">
              Create Account
            </h2>

            {error && (
              <div className="mb-4 text-red-600 text-sm text-center">
                {typeof error === "string"
                  ? error
                  : error?.message || "Something went wrong"}
              </div>
            )}

            <form onSubmit={handleRegister} noValidate>
              {[
                {
                  id: "name",
                  label: "Name",
                  value: name,
                  setter: setName,
                  error: fieldErrors.name,
                  placeholder: "Enter your full name",
                },
                {
                  id: "email",
                  label: "Email Address",
                  value: email,
                  setter: setEmail,
                  error: fieldErrors.email,
                  placeholder: "you@example.com",
                  type: "email",
                },
                {
                  id: "phone",
                  label: "Phone Number",
                  value: phone,
                  setter: setPhone,
                  error: fieldErrors.phone,
                  placeholder: "Enter phone with country code",
                  type: "tel",
                },
              ].map(
                ({
                  id,
                  label,
                  value,
                  setter,
                  error,
                  placeholder,
                  type = "text",
                }) => (
                  <div className="mb-4" key={id}>
                    <label
                      htmlFor={id}
                      className="block text-sm font-medium text-[#64973f] mb-1"
                    >
                      {label}
                    </label>
                    <input
                      id={id}
                      type={type}
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className={`w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none text-sm placeholder-[#8F9779] ${
                        error ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder={placeholder}
                      required
                    />
                    {error && (
                      <p className="text-red-600 text-xs mt-1">{error}</p>
                    )}
                  </div>
                )
              )}

              {[
                {
                  id: "password",
                  label: "Password",
                  value: password,
                  setter: setPassword,
                  show: showPassword,
                  setShow: setShowPassword,
                  error: fieldErrors.password,
                  placeholder: "Enter your password",
                },
                {
                  id: "confirmPassword",
                  label: "Confirm Password",
                  value: confirmPassword,
                  setter: setConfirmPassword,
                  show: showConfirmPassword,
                  setShow: setShowConfirmPassword,
                  error: fieldErrors.confirmPassword,
                  placeholder: "Confirm your password",
                },
              ].map(
                ({
                  id,
                  label,
                  value,
                  setter,
                  show,
                  setShow,
                  error,
                  placeholder,
                }) => (
                  <div className="mb-4 relative" key={id}>
                    <label
                      htmlFor={id}
                      className="block text-sm font-medium text-[#64973f] mb-1"
                    >
                      {label}
                    </label>
                    <input
                      id={id}
                      type={show ? "text" : "password"}
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className={`w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none text-sm placeholder-[#8F9779] ${
                        error ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder={placeholder}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShow((prev) => !prev)}
                      className="absolute right-4 top-9 text-[#64973f] text-sm"
                      tabIndex={-1}
                      aria-label={show ? "Hide password" : "Show password"}
                    >
                      {show ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    {error && (
                      <p className="text-red-600 text-xs mt-1">{error}</p>
                    )}
                  </div>
                )
              )}

              <button
                type="submit"
                className="w-full bg-[#64973f] text-white py-2 px-4 rounded-2xl hover:bg-[#688d4f] transition flex items-center justify-center shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="w-5 h-5 text-white animate-spin mr-2 fill-white"
                      viewBox="0 0 100 101"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        stroke="currentColor"
                        strokeWidth="10"
                      />
                    </svg>
                    Creating account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-[#8F9779]">
              <span>Already have an account? </span>
              <button
                className="text-[#64973f] hover:text-[#688d4f] font-semibold"
                onClick={onSwitchToLogin}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <SuccessModal
          title={"Account Created Successfully"}
          message="Your account has been successfully created. You can now sign in and start using our services."
          onClose={() => {
            setShowSuccessModal(false);
            onClose();
          }}
        />
      )}
    </>
  );
};

export default SignupModal;
