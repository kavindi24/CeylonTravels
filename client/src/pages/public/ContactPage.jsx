// src/pages/public/ContactPage.jsx
import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Contact form submitted:", formData);

      // TODO: Replace with Axios POST to /api/contact
      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page" style={{ backgroundColor: "#f9f9fb" }}>
      {/* Hero Section with Image */}
      <div className="hero-section position-relative overflow-hidden">
        <div 
          className="hero-background position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.7)"
          }}
        ></div>
        
        <div className="container position-relative py-5">
          <div className="row justify-content-center text-center py-5">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold text-white mb-4 hero-title">Get In Touch With Us</h1>
              <p className="lead text-light mb-4 hero-subtitle">
                Have questions about your next adventure? Our team is here to help you plan the perfect journey.
              </p>
              <div className="divider mx-auto" style={{ width: "80px", height: "4px", background: "linear-gradient(to right, #6366f1, #8b5cf6)", borderRadius: "2px" }}></div>
            </div>
          </div>
        </div>
        
        <div className="hero-wave position-absolute bottom-0 start-0 w-100">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
            <path fill="#f9f9fb" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-4">
          {/* Contact Info with Hover Effects */}
          <div className="col-lg-4">
            <div className="card shadow-sm h-100 p-4 border-1 rounded-4 contact-info-card">
              <h5 className="fw-bold mb-3 text-primary">Get in Touch</h5>
              <p className="text-muted small mb-4">
                Have questions? Reach out to us via phone, email, or visit us at our office.
              </p>
              <ul className="list-unstyled">
                <li className="mb-3 d-flex align-items-start contact-item">
                  <div className="icon-wrapper bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                    <FaPhoneAlt className="text-primary" />
                  </div>
                  <div>
                    <h6 className="fw-semibold mb-0">Phone</h6>
                    <span>+94 11 234 5678</span>
                  </div>
                </li>
                <li className="mb-3 d-flex align-items-start contact-item">
                  <div className="icon-wrapper bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                    <FaEnvelope className="text-primary" />
                  </div>
                  <div>
                    <h6 className="fw-semibold mb-0">Email</h6>
                    <span>info@ceylontravels.com</span>
                  </div>
                </li>
                <li className="d-flex align-items-start contact-item">
                  <div className="icon-wrapper bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                    <FaMapMarkerAlt className="text-primary" />
                  </div>
                  <div>
                    <h6 className="fw-semibold mb-0">Address</h6>
                    <span>123 Galle Road, Colombo, Sri Lanka</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form with Modern Styling */}
          <div className="col-lg-8">
            <div className="card shadow-sm p-4 border-1 rounded-4 form-card">
              <h5 className="fw-bold mb-4 text-primary">Send Us a Message</h5>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="form-control  border custom-input rounded-3"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="name" className="text-muted">Your Name</label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="form-control  border custom-input rounded-3"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="email" className="text-muted">Your Email</label>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-floating">
                      <input
                        type="text"
                        name="subject"
                        id="subject"
                        className="form-control border custom-input rounded-3"
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="subject" className="text-muted">Subject</label>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-floating">
                      <textarea
                        name="message"
                        id="message"
                        className="form-control border custom-input rounded-3"
                        placeholder="Leave your message here"
                        style={{ height: "150px" }}
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                      <label htmlFor="message" className="text-muted">Message</label>
                    </div>
                  </div>

                  <div className="col-12 text-end">
                    <button
                      type="submit"
                      className="btn btn-primary px-4 py-3 rounded-pill fw-semibold gradient-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Sending...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="me-2" /> Send Message
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section with Overlay */}
        <div className="mt-5 position-relative map-container rounded-4 overflow-hidden shadow-sm">
          <div className="map-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
            <div className="bg-white rounded-3 p-3 shadow">
              <h6 className="mb-0 fw-semibold">Our Location</h6>
            </div>
          </div>
          <iframe
            title="Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63319.2288!2d79.8419!3d6.9271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2594b09d8b3fb%3A0x6f1e1e1b5f5b3e2a!2sColombo!5e0!3m2!1sen!2slk!4v161234567890"
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          height: 450px;
        }
        
        .hero-title {
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);
          animation: fadeInUp 1s ease-out;
        }
        
        .hero-subtitle {
          text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.6);
          animation: fadeInUp 1.2s ease-out;
        }
        
        .hero-wave {
          z-index: 1;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .text-gradient {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .contact-info-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .contact-info-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
        }
        
        .contact-item {
          transition: transform 0.2s ease;
        }
        
        .contact-item:hover {
          transform: translateX(5px);
        }
        
        .form-card {
          background: linear-gradient(to bottom, #ffffff, #f9f9fb);
        }
        
        /* Enhanced input styling */
        .custom-input {
          border: 1px solid #e2e8f0;
          background-color: #fff;
          padding: 1rem 1.25rem;
          font-size: 0.95rem;
          color: #2d3748;
          transition: all 0.3s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
        }
        
        .custom-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15), 0 2px 6px rgba(99, 102, 241, 0.1);
          background-color: #fafbff;
          outline: none;
        }
        
        .custom-input:hover:not(:focus) {
          border-color: #cbd5e0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        /* Floating label styling */
        .form-floating > .form-control:focus ~ label,
        .form-floating > .form-control:not(:placeholder-shown) ~ label {
          color: #6366f1;
          font-weight: 500;
          transform: scale(0.85) translateY(-0.9rem) translateX(0.15rem);
        }
        
        .form-floating > label {
          color: #718096;
          padding: 1rem 1.25rem;
          transition: all 0.2s ease;
        }
        
        .gradient-btn {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border: none;
          transition: all 0.3s ease;
        }
        
        .gradient-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(99, 102, 241, 0.4);
        }
        
        .gradient-btn:disabled {
          opacity: 0.7;
        }
        
        .map-container {
          transition: all 0.3s ease;
        }
        
        .map-container:hover {
          box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
        }
        
        .map-overlay {
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .map-container:hover .map-overlay {
          opacity: 1;
        }
        
        .icon-wrapper {
          transition: transform 0.3s ease, background-color 0.3s ease;
        }
        
        .contact-item:hover .icon-wrapper {
          transform: scale(1.1);
          background-color: rgba(99, 102, 241, 0.2) !important;
        }
      `}</style>
    </div>
  );
}

export default ContactPage;