// src/pages/public/TransportDetailsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCar,
  FaUsers,
  FaTag,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaPhone,
  FaEnvelope,
  FaHeart,
  FaRegHeart,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaShoppingCart
} from "react-icons/fa";

function TransportDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transport, setTransport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [distance, setDistance] = useState(100);
  const [tripDate, setTripDate] = useState("");

  useEffect(() => {
    const fetchTransport = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/transports/${id}`);
        setTransport(res.data);
        setError(null);
      } catch (err) {
        console.error("Error loading transport:", err);
        setError("Failed to load transport details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchTransport();
  }, [id]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const calculateTotalPrice = () => {
    if (!transport) return 0;
    return distance * transport.pricePer1km;
  };

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading transport details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
        <div className="text-center mt-3">
          <Link to="/transports" className="btn btn-primary">
            <FaArrowLeft className="me-2" />
            Back to Transports
          </Link>
        </div>
      </div>
    );
  }

  if (!transport) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <h3>Transport not found</h3>
          <Link to="/listings/transport" className="btn btn-primary mt-3">
            <FaArrowLeft className="me-2" />
            Back to Transports
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="transport-details-page">
      {/* Navigation Header */}
      <div className="container py-3">
        <div className="row align-items-center">
          <div className="col">
            <Link to="/listings/transport" className="btn btn-outline-primary btn-sm">
              <FaArrowLeft className="me-2" />
              Back to Transports
            </Link>
          </div>
          <div className="col-auto">
            <button 
              className={`btn btn-sm ${isFavorite ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={toggleFavorite}
            >
              {isFavorite ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mt-4">
        <div className="row">
          {/* Left Column - Main Content */}
          <div className="col-lg-8">
            {/* Transport Image */}
            <div className="transport-image-container rounded-3 overflow-hidden mb-4">
              {transport.images && transport.images.length > 0 ? (
                <img
                  src={`http://localhost:5000${transport.images[selectedImage]}`}
                  alt={transport.vehicle}
                  className="w-100"
                  style={{ height: "400px", objectFit: "cover" }}
                />
              ) : (
                <div className="bg-light w-100 d-flex align-items-center justify-content-center"
                     style={{ height: "400px" }}>
                  <FaCar size={80} className="text-muted" />
                </div>
              )}
              
              {/* Image Thumbnails */}
              {transport.images && transport.images.length > 1 && (
                <div className="image-thumbnails mt-3 d-flex gap-2 overflow-auto">
                  {transport.images.map((img, index) => (
                    <button
                      key={index}
                      className={`btn p-0 ${selectedImage === index ? 'border-primary' : 'border'}`}
                      onClick={() => setSelectedImage(index)}
                      style={{ flexShrink: 0 }}
                    >
                      <img
                        src={`http://localhost:5000${img}`}
                        alt={`Thumbnail ${index + 1}`}
                        className="rounded"
                        style={{ width: "80px", height: "60px", objectFit: "cover" }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Transport Info */}
            <div className="transport-info">
              <div className="d-flex align-items-center gap-3 mb-3">
                <span className={`badge ${transport.available ? 'bg-success' : 'bg-danger'}`}>
                  {transport.available ? 'Available Now' : 'Not Available'}
                </span>
                {transport.Provider?.rating && (
                  <div className="d-flex align-items-center gap-1">
                    <FaStar className="text-warning" size={16} />
                    <span className="text-muted">({transport.Provider.rating})</span>
                  </div>
                )}
              </div>

              <h1 className="fw-bold mb-3">{transport.vehicle}</h1>
              <h4 className="text-muted mb-4">{transport.vehicleType}</h4>

              <div className="transport-meta d-flex flex-wrap gap-4 mb-4">
                <div className="d-flex align-items-center text-muted">
                  <FaUsers className="me-2" />
                  <span>{transport.seats} Seats</span>
                </div>
                <div className="d-flex align-items-center text-muted">
                  <FaTag className="me-2" />
                  <span>Rs. {transport.pricePer1km}/km</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <h4 className="fw-semibold mb-3">Description</h4>
                <p className="text-muted">{transport.description}</p>
              </div>

              {/* Features */}
              {transport.features && transport.features.length > 0 && (
                <div className="features-section mb-4">
                  <h4 className="fw-semibold mb-3">Vehicle Features</h4>
                  <div className="row g-2">
                    {transport.features.map((feature, index) => (
                      <div key={index} className="col-md-6">
                        <div className="d-flex align-items-center">
                          <div className="bullet-point bg-primary rounded-circle me-3"></div>
                          <span className="text-muted">{feature}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking Sidebar */}
          <div className="col-lg-4">
            <div className="booking-card">
              <div className="card border-0 shadow-sm rounded-3">
                <div className="card-body p-4">
                  <div className="price-section text-center mb-4">
                    <h3 className="text-primary fw-bold">Rs. {calculateTotalPrice().toLocaleString()}</h3>
                    <p className="text-muted">for {distance} km trip</p>
                  </div>

                  {/* Booking Form */}
                  <div className="booking-form mb-4">
                    <div className="mb-3">
                      <label className="form-label d-flex align-items-center">
                        <FaMapMarkerAlt className="me-2" />
                        Distance (km)
                      </label>
                      <input
                        type="range"
                        className="form-range"
                        min="1"
                        max="500"
                        value={distance}
                        onChange={(e) => setDistance(parseInt(e.target.value))}
                      />
                      <div className="d-flex justify-content-between">
                        <small>1 km</small>
                        <span className="fw-bold">{distance} km</span>
                        <small>500 km</small>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label d-flex align-items-center">
                        <FaCalendarAlt className="me-2" />
                        Trip Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        value={tripDate}
                        onChange={(e) => setTripDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="booking-actions">
                      <Link 
                      to={`/public/book-transport/${transport.id}`}
                      className="btn btn-primary btn-lg w-100 mb-3"
                      >
                      Book Now
                      </Link>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="pricing-breakdown mb-4">
                    <h6 className="fw-semibold mb-3">Pricing Breakdown</h6>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Base Rate</span>
                      <span>Rs. {transport.pricePer1km}/km</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Distance</span>
                      <span>{distance} km</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Total</span>
                      <span className="text-primary">Rs. {calculateTotalPrice().toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="tour-features">
                    <div className="feature-item d-flex align-items-center mb-3">
                      <div className="feature-icon bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                           style={{ width: "40px", height: "40px" }}>
                        <FaUsers size={16} />
                      </div>
                      <div>
                        <h6 className="fw-semibold mb-1">Seating Capacity</h6>
                        <p className="text-muted mb-0">{transport.seats} persons</p>
                      </div>
                    </div>

                    <div className="feature-item d-flex align-items-center mb-3">
                      <div className="feature-icon bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                           style={{ width: "40px", height: "40px" }}>
                        <FaTag size={16} />
                      </div>
                      <div>
                        <h6 className="fw-semibold mb-1">Rate Per Km</h6>
                        <p className="text-muted mb-0">Rs. {transport.pricePer1km}</p>
                      </div>
                    </div>

                    <div className="feature-item d-flex align-items-center">
                      <div className="feature-icon bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                           style={{ width: "40px", height: "40px" }}>
                        <FaCar size={16} />
                      </div>
                      <div>
                        <h6 className="fw-semibold mb-1">Vehicle Type</h6>
                        <p className="text-muted mb-0">{transport.vehicleType}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Provider Card */}
              {transport.Provider && (
                <div className="card border-0 shadow-sm rounded-3 mt-4">
                  <div className="card-body p-4">
                    <h5 className="fw-semibold mb-3">Provider Information</h5>
                    
                    <div className="d-flex align-items-center mb-3">
                      <div className="provider-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                           style={{ width: "50px", height: "50px" }}>
                        {transport.Provider.name.charAt(0)}
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1">{transport.Provider.name}</h6>
                        <div className="d-flex align-items-center">
                          <FaStar className="text-warning me-1" size={14} />
                          <span className="text-muted me-3">{transport.Provider.rating}</span>
                          {transport.Provider.verified ? (
                            <span className="badge bg-success">
                              <FaCheckCircle className="me-1" />
                              Verified
                            </span>
                          ) : (
                            <span className="badge bg-danger">
                              <FaTimesCircle className="me-1" />
                              Unverified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="provider-details mb-4">
                      <div className="d-flex align-items-center mb-2">
                        <FaPhone className="text-muted me-3" size={14} />
                        <span>{transport.Provider.phone}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <FaEnvelope className="text-muted me-3" size={14} />
                        <span className="text-break">{transport.Provider.email}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <FaMapMarkerAlt className="text-muted me-3" size={14} />
                        <span>Since {transport.Provider.since}</span>
                      </div>
                    </div>

                    <div className="d-grid gap-2">
                      <a 
                        href={`tel:${transport.Provider.phone}`}
                        className="btn btn-outline-primary"
                      >
                        <FaPhone className="me-2" />
                        Call Provider
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .transport-details-page {
          font-family: 'Inter', sans-serif;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .transport-image-container {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .image-thumbnails {
          padding-bottom: 10px;
        }

        .image-thumbnails::-webkit-scrollbar {
          height: 4px;
        }

        .image-thumbnails::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 2px;
        }

        .image-thumbnails::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 2px;
        }

        .bullet-point {
          width: 8px;
          height: 8px;
          flex-shrink: 0;
        }

        .booking-card {
          position: sticky;
          top: 100px;
        }

        .booking-card .card {
          background: white;
          border: 1px solid #e3f2fd;
        }

        .feature-icon {
          transition: transform 0.3s ease;
        }

        .feature-item:hover .feature-icon {
          transform: scale(1.1);
        }

        .provider-avatar {
          font-weight: bold;
          font-size: 1.2rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #1976d2, #1565c0);
          border: none;
          transition: all 0.3s ease;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(25, 118, 210, 0.3);
        }

        .btn-outline-primary {
          border-color: #1976d2;
          color: #1976d2;
          transition: all 0.3s ease;
        }

        .btn-outline-primary:hover {
          background: #1976d2;
          color: white;
          transform: translateY(-2px);
        }

        .badge.bg-primary {
          background: linear-gradient(135deg, #1976d2, #1565c0) !important;
        }

        .form-range::-webkit-slider-thumb {
          background: #1976d2;
        }

        .form-range::-moz-range-thumb {
          background: #1976d2;
        }

        @media (max-width: 768px) {
          .booking-card {
            position: static;
            margin-top: 2rem;
          }
          
          .transport-meta {
            flex-direction: column;
            gap: 1rem;
          }
          
          .image-thumbnails {
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
}

export default TransportDetailsPage;