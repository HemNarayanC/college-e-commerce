// src/pages/auth/LoginModal.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/auth/authActions";

const LoginModal = ({ onClose, onLoginSuccess }) => {
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  console.log("LoginModal rendered", { loading, error, isAuthenticated });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) return;
     console.log({ email, password }); 
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      setEmail("");
      setPassword("");
    }
  }, [isAuthenticated]);

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-xs flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
          aria-label="Close modal"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Sign In
        </h2>

        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">
            {typeof error === "string"
              ? error
              : error?.message || "Something went wrong"}
          </div>
        )}

        <form onSubmit={handleLogin} noValidate>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-indigo-600 hover:text-indigo-800"
              >
                Forgot Password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="********"
              required
            />
          </div>

          <div className="mb-6 flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-2xl hover:bg-indigo-700 transition flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-white animate-spin mr-2 fill-white"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Spinner paths here */}
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          <span>Don't have an account? </span>
          <Link
            to="/register"
            className="text-indigo-600 hover:text-indigo-800"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
