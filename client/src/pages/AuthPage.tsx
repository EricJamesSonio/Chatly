
import React, { useState } from "react";
import Login from "../components/login/Login";
import Signup from "../components/login/Signup";
import "../css/Auth.css"; // reuse same styles

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true); // ✅ default = Login

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

      {/* Render correct component */}
      {isLogin ? <Login /> : <Signup />}
    </div>
  );
};

export default AuthPage;
