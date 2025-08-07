import React, { useState } from "react";
import "./LoginForm.css";
const baseURL = import.meta.env.VITE_API_URL;

export default function LoginForm({ onAuthSuccess }) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const toggleForm = () => {
    // Clear form fields and toggle mode
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    setIsSignup((prev) => !prev);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  function validateForm(formData, isSignup) {
    const { name, email, password, confirmPassword } = formData;

    // Basic checks
    if (!email || !password || (isSignup && (!name || !confirmPassword))) {
      return { valid: false, message: "All fields are required." };
    }

    // Password checks (only for signup)
    if (isSignup) {
      if (password !== confirmPassword) {
        return { valid: false, message: "Passwords do not match." };
      }

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,32}$/;
      if (!passwordRegex.test(password)) {
        return {
          valid: false,
          message:
            "Password must be 8–32 characters long and include uppercase, lowercase, number, and special character.",
        };
      }
    }

    return { valid: true };
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isSignup ? "/signup" : "/login";
    const payload = isSignup
      ? {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }
      : {
          email: formData.email,
          password: formData.password,
        };

    try {
      const result = validateForm(formData, isSignup);
      if (!result.valid) {
        alert(result.message);
        return;
      }

      const response = await fetch(`${baseURL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      // Save token in localStorage
      localStorage.setItem("token", data.access_token);

      onAuthSuccess();
      // Redirect to dashboard or resume form
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="login-page">
      <div className="auth-container">
        <div className="auth-left">
          <h1>Latex Powered Resume Builder</h1>
          <ul>
            <li>✨ Best alignment and layout</li>
            <li>🧠 Clean professional design</li>
            <li>⚡ Fast PDF generation</li>
          </ul>
          <img src="sample-resume.png" alt="Sample Resume" />
        </div>

        <div className="auth-right">
          <div className="form-transition-wrapper">
            {/* Front - Login */}
            <div className={`auth-card ${!isSignup ? "fade-in" : "fade-out"}`}>
              <h2>Login</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button type="submit" className="submit-button">
                  Login
                </button>
              </form>
              <p
                onClick={toggleForm}
                className="toggle-form"
                style={{ cursor: "pointer" }}
              >
                Don't have an account? Sign Up →
              </p>
            </div>

            {/* Back - Sign Up */}
            <div className={`auth-card ${isSignup ? "fade-in" : "fade-out"}`}>
              <h2>Sign Up</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button type="submit" className="submit-button">
                  Sign Up
                </button>
              </form>
              <p
                onClick={toggleForm}
                className="toggle-form"
                style={{ cursor: "pointer" }}
              >
                Already have an account? Login →
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
