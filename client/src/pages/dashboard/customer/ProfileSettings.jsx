// src/pages/dashboard/customer/ProfileSettings.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaSave,
  FaCheckCircle,
  FaExclamationCircle,
  FaUserEdit
} from "react-icons/fa";

function ProfileSettings() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    country: "",
    fullName: "",
    dateOfBirth: "",
    address: "",
    bio: "",
    avatar: ""
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      if (!token) {
        alert("Please login first.");
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({
          ...res.data,
          fullName: res.data.fullName || "",
          dateOfBirth: res.data.dateOfBirth || "",
          address: res.data.address || "",
          bio: res.data.bio || "",
          avatar: res.data.avatar || ""
        });
        setErrors({});
      } catch (err) {
        console.error("Fetch user error:", err);
        alert(err.response?.data?.message || "Failed to load user info. Please login again.");
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!user.username.trim()) {
      newErrors.username = "Username is required";
    }
    
    if (user.phone && !/^[+]?[1-9][\d]{0,15}$/.test(user.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    try {
      setUpdating(true);
      const res = await axios.put(
        "http://localhost:5000/api/users/update-profile",
        {
          username: user.username,
          phone: user.phone,
          country: user.country,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccessMessage("Profile updated successfully!");
      setUser(res.data.user);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Update profile error:", err);
      alert(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-settings-page">
      <div className="container py-5">
        {/* Header */}
        <div className="row mb-5">
          <div className="col">
            <h1 className="fw-bold display-5 mb-2">Profile Settings</h1>
            <p className="text-muted">Manage your account information and preferences</p>
          </div>
        </div>

        <div className="row">
          {/* Sidebar Navigation */}
          <div className="col-lg-3 mb-4">
            <div className="profile-sidebar card border-0 shadow-sm rounded-3">
              <div className="card-body p-4">
                {/* Profile Summary */}
                <div className="profile-summary text-center mb-4">
                  <div className="avatar-container position-relative mx-auto mb-3">
                    <div className="avatar-circle">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.username} 
                          className="avatar-image"
                        />
                      ) : (
                        <div className="avatar-placeholder">
                          <FaUser className="text-white" size={40} />
                        </div>
                      )}                    
                    </div>
                  </div>
                  <h5 className="fw-bold mb-1">{user.fullName || user.username}</h5>
                  <p className="text-muted mb-0">{user.email}</p>
                  <div className="d-flex justify-content-center gap-2 mt-2">
                    <span className="badge bg-primary">{user.country || "Unknown"}</span>
                    <span className="badge bg-success">Active</span>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="profile-nav">
                  <button
                    className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
                    onClick={() => setActiveTab("profile")}
                  >
                    <FaUser className="me-3" />
                    Personal Info
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            {successMessage && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                <FaCheckCircle className="me-2" />
                {successMessage}
                <button type="button" className="btn-close" onClick={() => setSuccessMessage("")}></button>
              </div>
            )}

            <div className="profile-content card border-0 shadow-sm rounded-3">
              <div className="card-body p-4">
                {/* Personal Info Tab */}
                {activeTab === "profile" && (
                  <form onSubmit={handleUpdateProfile}>
                    <div className="profile-section mb-4">
                      <h4 className="fw-bold mb-4">
                        <FaUserEdit className="me-2" />
                        Personal Information
                      </h4>

                      <div className="row g-4">
                        {/* Username */}
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label fw-semibold">
                              <FaUser className="me-2 text-primary" />
                              Username *
                            </label>
                            <input
                              type="text"
                              name="username"
                              value={user.username}
                              onChange={handleChange}
                              className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                              placeholder="Enter username"
                               style={{ color: "black", borderColor: "lightgray" }} 
                            />
                            {errors.username && (
                              <div className="invalid-feedback d-flex align-items-center">
                                <FaExclamationCircle className="me-2" />
                                {errors.username}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Email */}
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label fw-semibold">
                              <FaEnvelope className="me-2 text-primary" />
                              Email Address
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={user.email}
                              className="form-control bg-light"
                              disabled
                              style={{ color: "gray", borderColor: "lightgray" }}
                            />
                            <small className="text-muted">Email cannot be changed</small>
                          </div>
                        </div>

                        {/* Phone */}
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label fw-semibold">
                              <FaPhone className="me-2 text-primary" />
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={user.phone}
                              onChange={handleChange}
                              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                              placeholder="Enter phone number"
                               style={{ color: "black", borderColor: "lightgray" }}                             />
                            {errors.phone && (
                              <div className="invalid-feedback d-flex align-items-center">
                                <FaExclamationCircle className="me-2" />
                                {errors.phone}
                              </div>
                            )}
                          </div>
                        </div>


                        {/* Country */}
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label fw-semibold">
                              <FaGlobe className="me-2 text-primary" />
                              Country
                            </label>
                            <input
                              type="text"
                              name="country"
                              value={user.country}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Enter your country"
                              style={{ color: "black", borderColor: "lightgray" }}                             />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end gap-3">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => navigate(-1)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={updating}
                      >
                        <FaSave className="me-2" />
                        {updating ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .profile-settings-page {
          background: #f8f9fa;
          min-height: calc(100vh - 76px);
        }

        .profile-sidebar {
          position: sticky;
          top: 100px;
        }

        .avatar-container {
          width: 120px;
          height: 120px;
        }

        .avatar-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          background: linear-gradient(135deg, #00796b, #004d40);
          position: relative;
          box-shadow: 0 4px 15px rgba(0, 121, 107, 0.3);
        }

        .avatar-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #200079ff, #17004dff);
        }

        .avatar-upload-btn {
          position: absolute;
          bottom: 5px;
          right: 5px;
          background: white;
          color: #00796b;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid #00796b;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .avatar-upload-btn:hover {
          background: #00796b;
          color: white;
          transform: scale(1.1);
        }

        .profile-nav {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .profile-nav .nav-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: #495057;
          text-align: left;
          transition: all 0.3s ease;
          cursor: pointer;
          font-weight: 500;
        }

        .profile-nav .nav-item:hover {
          background: rgba(0, 121, 107, 0.1);
          color: #001279ff;
          transform: translateX(5px);
        }

        .profile-nav .nav-item.active {
          background: linear-gradient(135deg, #000279ff, #00014dff);
          color: white;
          box-shadow: 0 4px 15px rgba(0, 121, 107, 0.2);
        }

        .profile-nav .nav-item.active:hover {
          transform: none;
        }

        .profile-content .card {
          min-height: 500px;
        }

        .form-label {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          color: #495057;
        }

        .form-control {
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 12px;
          transition: all 0.3s ease;
          color: #212529;
        }

        .form-control:focus {
          border-color: #00796b;
          box-shadow: 0 0 0 0.2rem rgba(0, 121, 107, 0.25);
          color: #212529;
        }

        .form-control:disabled {
          background-color: #f8f9fa;
          color: #6c757d;
        }

        .is-invalid {
          border-color: #dc3545;
        }

        .invalid-feedback {
          display: flex;
          align-items: center;
          margin-top: 5px;
          font-size: 0.875rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #001679ff, #00054dff);
          border: none;
          padding: 10px 24px;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 121, 107, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-outline-secondary {
          border: 1px solid #6c757d;
          color: #6c757d;
          padding: 10px 24px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .btn-outline-secondary:hover {
          background: #6c757d;
          color: white;
          transform: translateY(-2px);
        }

        .password-requirements {
          border-left: 3px solid #00796b;
        }

        .password-requirements li {
          margin-bottom: 5px;
        }

        .alert-success {
          border: none;
          border-radius: 8px;
          background: linear-gradient(135deg, #d4edda, #c3e6cb);
          color: #155724;
          box-shadow: 0 4px 15px rgba(0, 121, 107, 0.1);
        }

        .badge {
          font-size: 0.8rem;
          padding: 5px 10px;
          border-radius: 20px;
          font-weight: 500;
        }

        textarea.form-control {
          resize: none;
        }

        /* Responsive Design */
        @media (max-width: 992px) {
          .profile-sidebar {
            position: static;
            margin-bottom: 2rem;
          }
        }

        @media (max-width: 768px) {
          .avatar-container {
            width: 100px;
            height: 100px;
          }
          
          .avatar-circle {
            width: 100px;
            height: 100px;
          }
          
          .profile-nav .nav-item {
            padding: 10px 12px;
            font-size: 0.9rem;
          }
          
          .form-control {
            padding: 10px;
          }
        }

        @media (max-width: 576px) {
          .d-flex.justify-content-end.gap-3 {
            flex-direction: column;
            gap: 10px !important;
          }
          
          .btn-primary,
          .btn-outline-secondary {
            width: 100%;
          }
        }

        /* Animations */
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .profile-content {
          animation: slideIn 0.5s ease;
        }
      `}</style>
    </div>
  );
}

export default ProfileSettings;