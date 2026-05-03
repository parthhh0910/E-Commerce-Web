import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", address: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:8081/api"}/auth/register`, form);
      setSuccess("Account created! Redirecting to login…");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split">
      {/* Banner */}
      <div className="auth-split__banner">
        <div className="auth-split__logo">🛒 HiTeckKart</div>
        <p className="auth-split__tagline">Join millions of happy shoppers today</p>
        <ul className="auth-split__perks">
          <li><span>🎁</span> Exclusive member discounts</li>
          <li><span>🚚</span> Free delivery on ₹500+</li>
          <li><span>🔒</span> Secure & private account</li>
          <li><span>⭐</span> Earn reward points on every order</li>
        </ul>
      </div>

      {/* Form */}
      <div className="auth-split__form-side">
        <div className="auth-box">
          <h2>Create Account</h2>
          <p>Sign up for free and start shopping</p>

          {error && <div className="alert alert-danger py-2" style={{ fontSize: "0.88rem" }}>{error}</div>}
          {success && <div className="alert alert-success py-2" style={{ fontSize: "0.88rem" }}>{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label>Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required />
            </div>
            <div className="auth-input-group">
              <label>Email address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
            </div>
            <div className="auth-input-group">
              <label>Password</label>
              <input
                type={showPw ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password"
                style={{ paddingRight: 40 }}
                required
              />
              <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(s => !s)}>
                <i className={`bi ${showPw ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>
            <div className="auth-input-group">
              <label>Phone (optional)</label>
              <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
            </div>
            <div className="auth-input-group">
              <label>Address (optional)</label>
              <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Your delivery address" />
            </div>

            <button type="submit" className="auth-btn-primary" disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm" role="status"></span> Creating account…</> : "Create Account"}
            </button>
          </form>

          <p className="mt-4 text-center" style={{ fontSize: "0.88rem" }}>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
