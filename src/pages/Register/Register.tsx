import React, { useState } from "react";
import "./Register.scss";
import { NavLink } from "react-router-dom";
import Logo from "../../components/Logo/Logo";
import Footer from "../../components/Footer/Footer";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import "../../styles/global.scss";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleregister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });
  };

  return (
    <div className="register-page">
      {/* Logo at top-left */}
      <div className="register-logo-wrapper">
        <Logo />
      </div>

      <div className="register-container">
        <h1 className="register-title">Create an account</h1>
        <p className="register-subtitle">Please register to your account</p>

        {/* Social register buttons */}
        <div className="social-register-buttons">
          <button className="social-button google">
            <FcGoogle className="social-icon" />
            Sign up with Google
          </button>
          <button className="social-button apple">
            <FaApple className="social-icon" />
            Sign up with Apple
          </button>
        </div>

        <div className="divider">or</div>

        {/* Email/password register */}
        <form onSubmit={handleregister} className="register-form">
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

          <button type="submit" className="register-button">
            Register
          </button>
        </form>

        <p className="register-footer">
          Already have an account? <NavLink to="/login">Sign into your account</NavLink>
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
