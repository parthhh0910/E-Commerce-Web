import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import AppContext from "../Context/Context";

const Profile = () => {
  const { user, setUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "", address: user?.address || "", password: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (!user) navigate("/login"); }, [user, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:8081/api"}`}/auth/profile/${user.id}`, form);
      const updated = { ...user, ...res.data };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      setSuccess("Profile updated successfully!");
      setForm({ ...form, password: "" });
    } catch (err) {
      setError(err.response?.data || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  if (!user) return null;

  const initials = user.name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "U";

  return (
    <div className="container" style={{ maxWidth: 560, marginTop: 100, marginBottom: 60 }}>
      <div className="fk-cart-panel">
        {/* Avatar header */}
        <div className="profile-header">
          <div className="profile-avatar">{initials}</div>
          <h5 className="mb-0 fw-bold">{user.name}</h5>
          <p className="text-muted mb-2" style={{ fontSize: "0.88rem" }}>{user.email}</p>
          <div className="profile-quick-links">
            <Link to="/orders" className="profile-quick-link">
              <i className="bi bi-box-seam"></i> My Orders
            </Link>
            <Link to="/" className="profile-quick-link">
              <i className="bi bi-shop"></i> Shop
            </Link>
            <button className="profile-quick-link" style={{ border: "1.5px solid #dc3545", color: "#dc3545", cursor: "pointer", background: "none" }} onClick={handleLogout}>
              <i className="bi bi-box-arrow-right"></i> Logout
            </button>
          </div>
        </div>

        {/* Form */}
        <div style={{ padding: "16px 24px 24px" }}>
          {error && <div className="alert alert-danger py-2" style={{ fontSize: "0.88rem" }}>{error}</div>}
          {success && <div className="alert alert-success py-2" style={{ fontSize: "0.88rem" }}>{success}</div>}

          <form onSubmit={handleSubmit}>
            {[
              { label: "Full Name", name: "name", type: "text", required: true },
              { label: "Phone", name: "phone", type: "text" },
            ].map(field => (
              <div className="mb-3" key={field.name}>
                <label className="form-label fw-semibold" style={{ fontSize: "0.85rem" }}>{field.label}</label>
                <input
                  type={field.type}
                  className="form-control"
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  style={{ borderRadius: 10 }}
                />
              </div>
            ))}
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ fontSize: "0.85rem" }}>Address</label>
              <textarea className="form-control" name="address" rows={2} value={form.address} onChange={handleChange} style={{ borderRadius: 10 }} />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ fontSize: "0.85rem" }}>
                New Password <span className="text-muted fw-normal">(leave blank to keep current)</span>
              </label>
              <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} style={{ borderRadius: 10 }} />
            </div>
            <button type="submit" className="auth-btn-primary" disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm"></span> Saving…</> : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
