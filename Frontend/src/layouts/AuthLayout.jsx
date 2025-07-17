import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthModal from "../components/modals/AuthModal";

const AuthLayout = () => {
  const isAuthenticated = useSelector((state) => state.auth.auth_token);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      setShowModal(true); // Show modal if not logged in
    }
  }, [isAuthenticated]);

  const handleClose = () => {
    setShowModal(false);
    navigate(-1); // Go back to the previous page
  };

  const handleLoginSuccess = () => {
    setShowModal(false);
  };

  if (!isAuthenticated) {
    return (
      <>
        {showModal && (
          <AuthModal
            onClose={handleClose}
          />
        )}
      </>
    );
  }

  return <Outlet />;
};

export default AuthLayout;
