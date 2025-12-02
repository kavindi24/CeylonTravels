import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import axios from 'axios';
import { 
  FaEye, 
  FaEyeSlash, 
  FaUserPlus, 
  FaGoogle, 
  FaFacebookF, 
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaGlobe
} from 'react-icons/fa';

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    country: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Full name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.country) {
      newErrors.country = 'Country is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // inside RegisterPage component
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;
  setIsSubmitting(true);

  try {
    const res = await axios.post('/api/users/register', formData);

    console.log('✅ Registered:', res.data);
    alert('🎉 Registration successful! Redirecting to Login...');

    // Redirect to login page
    navigate('/login');

  } catch (err) {
    console.error('❌ Register error:', err.response?.data || err.message);
    alert(err.response?.data?.message || 'Server error. Try again later.');
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
              <FaUserPlus className="mb-4" style={{ fontSize: '3.5rem', opacity: 0.9 }} />
              <h3 className="fw-bold mb-3">Join Ceylon Travels</h3>
              <p className="small mb-4" style={{ lineHeight: '1.6' }}>
                Create your account to access exclusive travel deals and personalized recommendations for your next adventure in Sri Lanka.
              </p>
              <div className="mt-5 pt-3">
                <p className="small mb-2">Already have an account?</p>
                <Link to="/login" className="btn btn-outline-light fw-semibold px-4 rounded-pill">
                  Sign In Now
                </Link>
              </div>
            </div>
          </div>

          {/* Right side - Registration Form */}
          <div className="col-md-7 bg-white">
            <div className="p-4 p-md-5">
              <div className="text-center mb-4">
                <div className="bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center rounded-circle mb-3" 
                  style={{ width: '70px', height: '70px' }}>
                  <FaUserPlus className="text-primary" style={{ fontSize: '1.8rem' }} />
                </div>
                <h3 className="fw-bold text-dark mb-1">Create Account</h3>
                <p className="text-muted">Join Ceylon Travels today</p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Username */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <FaUser className="text-muted" />
                    </span>
                    <input
                      type="text"
                      name="username"
                      className={`form-control border rounded-end-4 form-control-lg ${errors.username ? 'is-invalid' : ''}`}
                      placeholder="John Doe"
                      value={formData.username}
                      required
                      onChange={handleChange}
                    />
                    {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                  </div>
                </div>

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
                  <div className="form-text">Must be at least 8 characters</div>
                </div>

                <div className="row">
                  {/* Phone */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Phone Number</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <FaPhone className="text-muted" />
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        className={`form-control border rounded-end-4 form-control-lg ${errors.phone ? 'is-invalid' : ''}`}
                        placeholder="+94xxxxxxxxx"
                        value={formData.phone}
                        required
                        onChange={handleChange}
                      />
                      {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>
                  </div>

                  {/* Country */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Country</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <FaGlobe className="text-muted" />
                      </span>
                      <select
                        name="country"
                        className={`form-control border rounded-end-4 form-control-lg ${errors.country ? 'is-invalid' : ''}`}
                        value={formData.country}
                        required
                        onChange={handleChange}
                      >
                        <option value="">Select Country</option>
                        <option value="Sri Lanka">Sri Lanka</option>
                        <option value="India">India</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.country && <div className="invalid-feedback">{errors.country}</div>}
                    </div>
                  </div>
                </div>


                 

                {/* Terms and Conditions */}
                <div className="form-check mb-4">
                  <input className="form-check-input" type="checkbox" id="termsCheck" required />
                  <label className="form-check-label small text-muted" htmlFor="termsCheck">
                    I agree to the <a href="/terms" className="text-decoration-none">Terms and Conditions</a>
                  </label>
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
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <FaUserPlus className="me-2" /> Create Account
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center mt-4">
                <div className="small text-muted mb-2">Or register with</div>
                <div className="d-flex justify-content-center gap-3">
                  <button className="btn btn-outline-primary rounded-circle p-2 d-flex align-items-center justify-content-center">
                    <FaGoogle />
                  </button>
                  <button className="btn btn-outline-primary rounded-circle p-2 d-flex align-items-center justify-content-center">
                    <FaFacebookF />
                  </button>

                </div>
              </div>

              <p className="text-center mt-4 mb-0 small d-md-none">
                Already have an account?{" "}
                <Link to="/login" className="text-decoration-none fw-semibold">Sign In</Link>
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

export default RegisterPage;