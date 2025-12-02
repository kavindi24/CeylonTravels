// src/pages/public/TourDetailsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaStar,
  FaHeart,
  FaRegHeart
} from "react-icons/fa";

function TourDetailsPage() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/tour-packages/${id}`);
        setTour(res.data);
        setError(null);
      } catch (err) {
        console.error("Error loading tour package:", err);
        setError("Failed to load tour package. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const renderRating = (rating) => {
    const stars = [];
    const numericRating = rating || 0;
    const fullStars = Math.floor(numericRating);

    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar 
          key={i} 
          className={i < fullStars ? "text-warning" : "text-light"} 
          size={16} 
        />
      );
    }
    
    return (
      <div className="d-flex align-items-center gap-1">
        <div className="d-flex">
          {stars}
        </div>
        <span className="text-muted ms-2">({numericRating})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading tour details...</p>
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
          <Link to="/listings/tours" className="btn btn-primary">
            <FaArrowLeft className="me-2" />
            Back to Tours
          </Link>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <h3>Tour not found</h3>
          <Link to="/listings/tours" className="btn btn-primary mt-3">
            <FaArrowLeft className="me-2" />
            Back to Tours
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="tour-details-page">
      {/* Navigation Header */}
      <div className="container py-3">
        <div className="row align-items-center">
          <div className="col">
            <Link to="/listings/tours" className="btn btn-outline-primary btn-sm">
              <FaArrowLeft className="me-2" />
              Back to Tours
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
          {/* Tour Image */}
          <div className="col-lg-8">
            <div className="tour-image-container rounded-3 overflow-hidden">
              <img
                src={tour.image ? `http://localhost:5000${tour.image}` : "/placeholder.jpg"}
                alt={tour.title}
                className="w-100"
                style={{ height: "400px", objectFit: "cover" }}
              />
            </div>

            {/* Tour Info */}
            <div className="tour-info mt-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <span className="badge bg-primary">{tour.category}</span>
                {renderRating(tour.rating)}
              </div>

              <h1 className="fw-bold mb-3">{tour.title}</h1>

              <div className="tour-meta d-flex flex-wrap gap-4 mb-4">
                <div className="d-flex align-items-center text-muted">
                  <FaMapMarkerAlt className="me-2" />
                  <span>{tour.location}</span>
                </div>
                <div className="d-flex align-items-center text-muted">
                  <FaClock className="me-2" />
                  <span>{tour.duration}</span>
                </div>
                <div className="d-flex align-items-center text-muted">
                  <FaUsers className="me-2" />
                  <span>Group Tour</span>
                </div>
              </div>

              {/* Highlights */}
              {tour.highlights && tour.highlights.length > 0 && (
                <div className="highlights-section mt-4">
                  <h4 className="fw-semibold mb-3">Tour Highlights</h4>
                  <div className="row g-3">
                    {tour.highlights.map((highlight, index) => (
                      <div key={index} className="col-md-6">
                        <div className="d-flex align-items-center">
                          <div className="bullet-point bg-primary rounded-circle me-3"></div>
                          <span className="text-muted">{highlight}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="col-lg-4">
            <div className="booking-card">
              <div className="card border-0 shadow-sm rounded-3">
                <div className="card-body p-4">
                  <div className="price-section text-center mb-4">
                    <h3 className="text-primary fw-bold">LKR {tour.price?.toLocaleString()}</h3>
                    <p className="text-muted">per person</p>
                  </div>

                  <div className="booking-actions">
                    <Link 
                      to={`/booking/tour/${tour.id}`}
                      className="btn btn-primary btn-lg w-100 mb-3"
                    >
                      Book Now
                    </Link>
                    
                    <button className="btn btn-outline-primary w-100">
                      Contact for Details
                    </button>
                  </div>

                  <div className="tour-features mt-4">
                    <div className="feature-item d-flex align-items-center mb-3">
                      <div className="feature-icon bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                           style={{ width: "40px", height: "40px" }}>
                        <FaClock size={16} />
                      </div>
                      <div>
                        <h6 className="fw-semibold mb-1">Duration</h6>
                        <p className="text-muted mb-0">{tour.duration}</p>
                      </div>
                    </div>

                    <div className="feature-item d-flex align-items-center mb-3">
                      <div className="feature-icon bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                           style={{ width: "40px", height: "40px" }}>
                        <FaUsers size={16} />
                      </div>
                      <div>
                        <h6 className="fw-semibold mb-1">Group Size</h6>
                        <p className="text-muted mb-0">Small groups (2-12 people)</p>
                      </div>
                    </div>

                    <div className="feature-item d-flex align-items-center">
                      <div className="feature-icon bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                           style={{ width: "40px", height: "40px" }}>
                        <FaMapMarkerAlt size={16} />
                      </div>
                      <div>
                        <h6 className="fw-semibold mb-1">Location</h6>
                        <p className="text-muted mb-0">{tour.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr></hr>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .tour-details-page {
          font-family: 'Inter', sans-serif;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .tour-image-container {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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

        .btn-primary {
          background: linear-gradient(135deg, #1976d2, #1565c0);
          border: none;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
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

        @media (max-width: 768px) {
          .booking-card {
            position: static;
            margin-top: 2rem;
          }
          
          .tour-meta {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default TourDetailsPage;