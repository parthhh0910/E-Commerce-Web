import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import AppContext from "../Context/Context";

const Login = () => {
  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:8081/api"}/auth/login`, form);
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split">
      {/* Banner */}
      <div className="auth-split__banner">
        <div className="auth-split__logo">🛒 HiTeckKart</div>
        <p className="auth-split__tagline">India's #1 destination for premium tech products</p>
        <ul className="auth-split__perks">
          <li><span>✓</span> 50M+ happy customers</li>
          <li><span>✓</span> Free delivery on ₹500+</li>
          <li><span>✓</span> 10-day easy returns</li>
          <li><span>✓</span> Secure & trusted payments</li>
        </ul>
      </div>

      {/* Form */}
      <div className="auth-split__form-side">
        <div className="auth-box">
          <h2>Welcome back 👋</h2>
          <p>Sign in to your HiTeckKart account</p>

          {error && <div className="alert alert-danger py-2" style={{ fontSize: "0.88rem" }}>{error}</div>}

          <form onSubmit={handleSubmit}>
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
                placeholder="Your password"
                style={{ paddingRight: 40 }}
                required
              />
              <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(s => !s)}>
                <i className={`bi ${showPw ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>

            <button type="submit" className="auth-btn-primary" disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm" role="status"></span> Signing in…</> : "Sign In"}
            </button>
          </form>

          <p className="mt-4 text-center" style={{ fontSize: "0.88rem" }}>
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
