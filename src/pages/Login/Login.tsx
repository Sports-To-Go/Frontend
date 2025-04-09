import React, { useState } from "react";
import "./Login.scss";
import { NavLink } from "react-router-dom";
import Logo from "../../components/Logo/Logo";
import Footer from "../../components/Footer/Footer";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import "../../styles/global.scss";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });
  };

  return (
    <div className="login-page">
      {/* Logo at top-left */}
      <div className="login-logo-wrapper">
        <Logo />
      </div>

      <div className="login-container">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Please login to your account</p>

        {/* Social login buttons */}
        <div className="social-login-buttons">
          <button className="social-button google">
            <FcGoogle className="social-icon" />
            Continue with Google
          </button>
          <button className="social-button apple">
            <FaApple className="social-icon" />
            Continue with Apple
          </button>
        </div>

        <div className="divider">or</div>

        {/* Email/password login */}
        <form onSubmit={handleLogin} className="login-form">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <label>Password</label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="toggle-password"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <p className="login-footer">
          Don’t have an account? <NavLink to="/register">Register</NavLink>
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
