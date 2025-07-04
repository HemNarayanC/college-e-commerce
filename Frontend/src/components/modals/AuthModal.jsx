import React, { useState } from "react";
import SignupModal from "../../pages/auth/signupModal";
import LoginModal from "../../pages/auth/loginModal";

const AuthModal = ({ onClose, onAuthSuccess }) => {
  const [view, setView] = useState("login");

  const closeAll = () => {
    setView("login");
    onClose();
  };

  return (
    <>
      {view === "login" && (
        <LoginModal
          onClose={closeAll}
          onLoginSuccess={onAuthSuccess}
          onSwitchToSignup={() => setView("signup")}
        />
      )}
      {view === "signup" && (
        <SignupModal
          onClose={closeAll}
          onRegisterSuccess={onAuthSuccess}
          onSwitchToLogin={() => setView("login")}
        />
      )}
    </>
  );
};

export default AuthModal;
