
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Login from "../components/login/Login";
import Signup from "../components/login/Signup";
import "../css/Auth.css";

const AuthPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  if (user) {
    return (
      <div className="auth-page">
        <div className="auth-message">
          <h2>You are logged in as {user.username}</h2>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
          
          {showLogoutConfirm && (
            <div className="logout-confirm">
              <p>Are you sure you want to log out?</p>
              <div className="confirm-buttons">
                <button onClick={confirmLogout}>Yes, Logout</button>
                <button onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-toggle-container">
        <div className="auth-toggle">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>
      </div>
      {isLogin ? <Login /> : <Signup />}
    </div>
  );
};

export default AuthPage;
