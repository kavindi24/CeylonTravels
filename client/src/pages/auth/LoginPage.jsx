import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { 
  FaEye, 
  FaEyeSlash, 
  FaGoogle, 
  FaFacebookF, 
  FaTwitter,
  FaUser,
  FaEnvelope,
  FaLock
} from "react-icons/fa";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email address";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;
  setIsSubmitting(true);

  try {
    // --- 1) Try ADMIN Login ---
    
    const adminRes = await axios.post("/api/admins/login", formData);

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("authToken", adminRes.data.token);
    storage.setItem("userRole", "admin");
    storage.setItem("userId", adminRes.data.admin.id);
    storage.setItem("userName", adminRes.data.admin.name);

    window.dispatchEvent(new Event("storage"));
    navigate("/dashboard/admin");
    return; // STOP here if admin login succeeded

  } catch (adminErr) {
    console.log("Not an admin → trying user login...");
  }

  // --- 2) Try USER Login ---
  try {
    const userRes = await axios.post("/api/users/login", formData);
    const user = userRes.data.user;

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("authToken", userRes.data.token);
    storage.setItem("userRole", user.role);
    storage.setItem("userId", user.id);
    storage.setItem("userName", user.username);

    window.dispatchEvent(new Event("storage"));
    navigate("/dashboard/customer");
    return;

  } catch (userErr) {
    alert("Invalid email or password");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div 
      className="auth-page min-vh-100 d-flex align-items-center justify-content-center py-4"
      style={{ background: 'linear-gradient(135deg, #edecf1 0%, #fafafa 100%)' }}
    >
      <div className="card shadow-lg rounded-4 overflow-hidden border-0 w-100"
        style={{ maxWidth: "950px" }}
      >
        <div className="row g-0">
          {/* Left side - Welcome Section */}
          <div className="col-md-5 d-none d-md-flex align-items-center justify-content-center text-white"
            style={{ 
              background: 'linear-gradient(135deg, rgba(1,17,90,0.85) 0%, rgba(7,23,243,0.85) 100%)',
              padding: '2rem'
            }}
          >
            <div className="text-center p-4">
              <FaUser className="mb-4" style={{ fontSize: '3.5rem', opacity: 0.9 }} />
              <h3 className="fw-bold mb-3">Welcome Back</h3>
              <p className="small mb-4" style={{ lineHeight: '1.6' }}>
                Sign in to your Ceylon Travels account to continue planning your next adventure in beautiful Sri Lanka.
              </p>
              <div className="mt-5 pt-3">
                <p className="small mb-2">Don't have an account?</p>
                <Link to="/register" className="btn btn-outline-light fw-semibold px-4 rounded-pill">
                  Sign Up Now
                </Link>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="col-md-7 bg-white">
            <div className="p-4 p-md-5">
              <div className="text-center mb-4">
                <div className="bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center rounded-circle mb-3" 
                  style={{ width: '70px', height: '70px' }}>
                  <FaUser className="text-primary" style={{ fontSize: '1.8rem' }} />
                </div>
                <h3 className="fw-bold text-dark mb-1">Sign In</h3>
                <p className="text-muted">Welcome back to Ceylon Travels</p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <FaEnvelope className="text-muted" />
                    </span>
                    <input
                      type="email"
                      name="email"
                      className={`form-control border rounded-end-4 form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="email@example.com"
                      value={formData.email}
                      required
                      onChange={handleChange}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <FaLock className="text-muted" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className={`form-control border form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="********"
                      value={formData.password}
                      required
                      onChange={handleChange}
                    />
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary border-start-0 rounded-end-4"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      id="rememberMe"
                    />
                    <label className="form-check-label small" htmlFor="rememberMe">Remember me</label>
                  </div>
                  <Link to="/forgot-password" className="text-decoration-none small text-primary">
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit */}
                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-primary rounded-pill py-2 fw-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center mt-4">
                <div className="small text-muted mb-2">Or sign in with</div>
                <div className="d-flex justify-content-center gap-3">
                  <button className="btn btn-outline-primary rounded-circle p-2 d-flex align-items-center justify-content-center">
                    <FaGoogle />
                  </button>
                  <button className="btn btn-outline-primary rounded-circle p-2 d-flex align-items-center justify-content-center">
                    <FaFacebookF />
                  </button>
                  <button className="btn btn-outline-primary rounded-circle p-2 d-flex align-items-center justify-content-center">
                    <FaTwitter />
                  </button>
                </div>
              </div>

              <p className="text-center mt-4 mb-0 small d-md-none">
                Don't have an account?{" "}
                <Link to="/register" className="text-decoration-none fw-semibold">Sign Up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        .form-control, .form-select {
          color: #212529 !important;
        }

        .form-control:focus, .form-select:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }

        .input-group-text {
          background-color: #f8f9fa !important;
          border-color: #ced4da !important;
        }

        .form-control-lg, .form-select-lg {
          padding: 0.75rem 1rem;
          font-size: 1rem;
        }

        .btn-outline-secondary {
          border-color: #ced4da;
        }

        .btn-outline-secondary:hover {
          background-color: #f8f9fa;
          border-color: #adb5bd;
        }

        .rounded-4 {
          border-radius: 0.8rem !important;
        }
        
        .rounded-end-4 {
          border-top-right-radius: 0.8rem !important;
          border-bottom-right-radius: 0.8rem !important;
        }
        
        .border-start-0 {
          border-left: 0 !important;
        }
        
        .border-end-0 {
          border-right: 0 !important;
        }
      `}</style>
    </div>
  );
}

export default LoginPage;