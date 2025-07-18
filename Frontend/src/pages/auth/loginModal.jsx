import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, loginVendor } from "../../redux/auth/authActions";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginModal = ({ onClose, onLoginSuccess, onSwitchToSignup }) => {
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState("customer");
  const [roleError, setRoleError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

 const handleLogin = async (e) => {
    e.preventDefault();
    setRoleError("");

    if (!email || !password) return;

    const credentials = { email, password, rememberMe };

    try {
      let result;

      if (loginType === "vendor") {
        result = await dispatch(loginVendor(credentials)).unwrap();
      } else {
        result = await dispatch(
          loginUser({
            ...credentials,
            expectedRole: loginType === "admin" ? "admin" : "customer",
          })
        ).unwrap();
      }

      // Debug logs for full user object and roles
      console.log("Login successful, user data:", result.user);

      // Handle both `role` or `roles` arrays (backend might send either)
      const roles = Array.isArray(result.user.role)
        ? result.user.role
        : Array.isArray(result.user.roles)
        ? result.user.roles
        : [];

      console.log("Roles array used for validation:", roles);

      const expectedRole = loginType === "admin" ? "admin" : "customer";

      // Role validation except for vendor login
      if (loginType !== "vendor" && !roles.includes(expectedRole)) {
        setRoleError("Invalid role. Please use the correct portal.");
        return;
      }

      // Clear inputs and errors
      setEmail("");
      setPassword("");
      setRoleError("");

      // Redirect based on role
      if (roles.includes("admin") || roles.includes("vendor")) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }

      onLoginSuccess?.();

    } catch (err) {
      // console.log("Roles array used for validation:", roles);

      // console.error("Login failed:", err);
      // setRoleError(typeof err === "string" ? err : err.message || "Login failed");
    }
  };


  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="flex justify-center mb-6">
          {["customer", "vendor", "admin"].map((type) => (
            <button
              key={type}
              onClick={() => setLoginType(type)}
              className={`px-4 py-2 border ${
                loginType === type
                  ? "bg-[#64973f] text-white"
                  : "bg-gray-100 text-[#486e40] hover:bg-gray-200"
              } ${
                type === "customer"
                  ? "rounded-l-xl"
                  : type === "admin"
                  ? "rounded-r-xl"
                  : ""
              }`}
            >
              {type === "customer"
                ? "User"
                : type === "vendor"
                ? "Business"
                : "Admin"}
            </button>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-[#486e40] mb-6 text-center capitalize">
          {loginType} Sign In
        </h2>

        {(error || roleError) && (
          <div className="mb-3 text-red-600 text-sm text-center">
            {roleError || (typeof error === "string" ? error : error?.message || "Something went wrong")}
          </div>
        )}

        <form onSubmit={handleLogin} noValidate>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#64973f] mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none text-sm placeholder-[#8F9779]"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="mb-4 relative">
            <div className="flex justify-between items-center mb-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#64973f]"
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-[#64973f] hover:text-[#688d4f]"
              >
                Forgot Password?
              </Link>
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none text-sm placeholder-[#8F9779]"
              placeholder="********"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-9 text-[#64973f] text-sm"
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="mb-6 flex items-center">
            <input
              id="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-[#64973f] focus:outline-none border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-[#8F9779]">
              Remember me
            </label>
          </div>

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
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {loginType !== "admin" && (
          <div className="mt-4 text-center text-sm text-[#8F9779]">
            <span>Don’t have an account? </span>
            <button
              className="text-[#64973f] hover:text-[#688d4f] font-semibold"
              onClick={onSwitchToSignup}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
