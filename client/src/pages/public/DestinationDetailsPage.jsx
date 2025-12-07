// src/pages/public/DestinationDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaStar,
  FaCalendarAlt,
  FaSun,
  FaHotel,
  FaHiking,
  FaTag,
  FaMountain,
  FaUmbrellaBeach,
  FaCity,
  FaTree,
  FaWater,
  FaCamera,
  FaUtensils,
  FaShoppingBag
} from "react-icons/fa";

function DestinationDetailsPage() {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Destination type icons mapping
  const destinationIcons = {
    "mountain": FaMountain,
    "beach": FaUmbrellaBeach,
    "city": FaCity,
    "forest": FaTree,
    "lake": FaWater,
    "historical": FaCamera,
    "culinary": FaUtensils,
    "shopping": FaShoppingBag
  };

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/destinations/${id}`);
        setDestination(res.data);
      } catch (err) {
        console.error("Error fetching destination:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDestination();
  }, [id]);

  const getDestinationIcon = (type) => {
    const DestIcon = destinationIcons[type?.toLowerCase()] || FaMapMarkerAlt;
    return <DestIcon className="text-primary" size={20} />;
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
      <div className="d-flex align-items-center gap-2">
        <div className="d-flex">
          {stars}
        </div>
        <span className="fw-bold text-muted">({numericRating})</span>
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
          <p className="mt-2">Loading destination details...</p>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <h3>Destination not found</h3>
          <Link to="/listings/destinations" className="btn btn-primary mt-3">
            <FaArrowLeft className="me-2" />
            Back to Destinations
          </Link>
        </div>
      </div>
    );
  }

  const mainImage = destination.img ? `http://localhost:5000${destination.img}` : "/placeholder.jpg";

  return (
    <div className="destination-details-page">
      {/* Navigation Header */}
      <div className="container py-3" style={{ backgroundColor: 'white' }}>
        <div className="row align-items-center">
          <div className="col">
            <Link to="/listings/destinations" className="btn btn-outline-primary btn-sm">
              <FaArrowLeft className="me-2" />
              Back to Destinations
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Banner Section */}
      <section className="destination-hero-section">
        <div className="hero-banner position-relative">
          <img
            src={mainImage}
            alt={destination.name}
            className="w-100 hero-image"
          />
          <div className="hero-overlay">
            <div className="container">
              <div className="hero-content text-white">
                <div className="destination-badge mb-3">
                  <span className="badge bg-primary px-3 py-2 rounded-pill">
                    {getDestinationIcon(destination.type)}
                    <span className="ms-2">{destination.type || "Destination"}</span>
                  </span>
                </div>
                <h1 className="display-4 fw-bold mb-3">{destination.name}</h1>
                <div className="d-flex align-items-center gap-4 flex-wrap">
                  <div className="d-flex align-items-center">
                    <FaMapMarkerAlt className="me-2" />
                    <span className="fs-5">{destination.province}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <FaStar className="me-2 text-warning" />
                    <span className="fs-5">{destination.rating || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destination Content */}
      <section className="destination-content py-5" style={{ backgroundColor: 'white' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              {/* Navigation Tabs */}
              <nav className="destination-tabs mb-4">
                <div className="nav nav-pills" role="tablist">
                  <button
                    className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
                    onClick={() => setActiveTab("overview")}
                  >
                    Overview
                  </button>
                  <button
                    className={`nav-link ${activeTab === "highlights" ? "active" : ""}`}
                    onClick={() => setActiveTab("highlights")}
                  >
                    Highlights
                  </button>
                  <button
                    className={`nav-link ${activeTab === "activities" ? "active" : ""}`}
                    onClick={() => setActiveTab("activities")}
                  >
                    Activities
                  </button>
                  <button
                    className={`nav-link ${activeTab === "info" ? "active" : ""}`}
                    onClick={() => setActiveTab("info")}
                  >
                    Travel Info
                  </button>
                </div>
              </nav>

              {/* Tab Content */}
              <div className="tab-content">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="overview-content">
                    <div className="description-section mb-5">
                      <h3 className="fw-bold mb-4">About {destination.name}</h3>
                      <div className="description-text">
                        <p className="lead text-muted mb-4">
                          {destination.description}
                        </p>
                        {destination.detailedDescription && (
                          <div className="detailed-description">
                            <h5 className="fw-bold mb-3">Detailed Information</h5>
                            <p className="text-muted">
                              {destination.detailedDescription}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Key Information Cards */}
                    <div className="key-info-cards row g-4 mb-5">
                      <div className="col-md-6">
                        <div className="info-card p-4 rounded-3 h-100" style={{ backgroundColor: '#f8f9fa' }}>
                          <div className="d-flex align-items-center mb-3">
                            <div className="icon-wrapper bg-primary rounded-circle p-3 me-3">
                              <FaSun className="text-white" size={20} />
                            </div>
                            <h5 className="fw-bold mb-0">Best Time to Visit</h5>
                          </div>
                          <p className="text-muted mb-0">
                            {destination.bestTime || "Year-round destination"}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="info-card p-4 rounded-3 h-100" style={{ backgroundColor: '#f8f9fa' }}>
                          <div className="d-flex align-items-center mb-3">
                            <div className="icon-wrapper bg-primary rounded-circle p-3 me-3">
                              <FaCalendarAlt className="text-white" size={20} />
                            </div>
                            <h5 className="fw-bold mb-0">Weather</h5>
                          </div>
                          <p className="text-muted mb-0">
                            {destination.weather || "Mild and pleasant"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Categories */}
                    {destination.categories && destination.categories.length > 0 && (
                      <div className="categories-section mb-5">
                        <h4 className="fw-bold mb-4">
                          <FaTag className="me-2" />
                          Categories
                        </h4>
                        <div className="d-flex flex-wrap gap-2">
                          {destination.categories.map((category, idx) => (
                            <span key={idx} className="category-badge" style={{ backgroundColor: '#e8f5f3', color: '#00796b' }}>
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Highlights Tab */}
                {activeTab === "highlights" && (
                  <div className="highlights-content">
                    <h3 className="fw-bold mb-4">Must-See Highlights</h3>
                    {destination.Highlights && destination.Highlights.length > 0 ? (
                      <div className="row g-4">
                        {destination.Highlights.map((highlight, idx) => {
                          const highlightImg = highlight.image
                            ? `http://localhost:5000${highlight.image}`
                            : "/placeholder.jpg";

                          return (
                            <div key={idx} className="col-md-6">
                              <div className="highlight-card h-100">
                                <div className="card border-0 shadow-sm h-100">
                                  <div className="highlight-image-container">
                                    <img
                                      src={highlightImg}
                                      alt={highlight.name}
                                      className="card-img-top highlight-image"
                                    />
                                  </div>
                                  <div className="card-body p-4">
                                    <h5 className="card-title fw-bold mb-3">{highlight.name}</h5>
                                    <p className="card-text text-muted mb-4">
                                      {highlight.description || "No description available"}
                                    </p>
                                    {highlight.bestTime && (
                                      <div className="highlight-meta">
                                        <small className="text-primary fw-semibold">
                                          <FaCalendarAlt className="me-1" />
                                          Best Time: {highlight.bestTime}
                                        </small>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-muted">No highlights available for this destination.</p>
                    )}
                  </div>
                )}

                {/* Activities Tab */}
                {activeTab === "activities" && (
                  <div className="activities-content">
                    <h3 className="fw-bold mb-4">Popular Activities</h3>
                    {destination.activities && destination.activities.length > 0 ? (
                      <div className="activities-grid">
                        <div className="row g-3">
                          {destination.activities.map((activity, idx) => (
                            <div key={idx} className="col-md-6">
                              <div className="activity-item">
                                <div className="d-flex align-items-center p-3 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                                  <FaHiking className="text-primary me-3" size={20} />
                                  <span className="fw-semibold">{activity}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted">No activities listed for this destination.</p>
                    )}
                  </div>
                )}

                {/* Travel Info Tab */}
                {activeTab === "info" && (
                  <div className="info-content">
                    <h3 className="fw-bold mb-4">Travel Information</h3>
                    
                    <div className="travel-tips mb-5">
                      <h5 className="fw-bold mb-3">
                        <FaSun className="me-2 text-warning" />
                        Best For
                      </h5>
                      <p className="text-muted">
                        {destination.bestFor || "All types of travelers"}
                      </p>
                    </div>

                    {destination.hotels && destination.hotels.length > 0 && (
                      <div className="hotels-section mb-5">
                        <h5 className="fw-bold mb-3">
                          <FaHotel className="me-2 text-primary" />
                          Nearby Accommodations
                        </h5>
                        <div className="hotels-list">
                          <div className="row g-3">
                            {destination.hotels.map((hotel, idx) => (
                              <div key={idx} className="col-12">
                                <div className="hotel-item p-3 border rounded-3">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <span className="fw-semibold">{hotel}</span>
                                    <Link 
                                      to={`/hotels`} 
                                      className="btn btn-outline-primary btn-sm"
                                    >
                                      View Details
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="planning-tips">
                      <h5 className="fw-bold mb-3">Planning Tips</h5>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex align-items-center" style={{ backgroundColor: 'white' }}>
                          <div className="bullet-point me-3" style={{ backgroundColor: '#00796b' }}></div>
                          <span>Book accommodations in advance during peak season</span>
                        </li>
                        <li className="list-group-item d-flex align-items-center" style={{ backgroundColor: 'white' }}>
                          <div className="bullet-point me-3" style={{ backgroundColor: '#00796b' }}></div>
                          <span>Carry appropriate clothing for the weather</span>
                        </li>
                        <li className="list-group-item d-flex align-items-center" style={{ backgroundColor: 'white' }}>
                          <div className="bullet-point me-3" style={{ backgroundColor: '#00796b' }}></div>
                          <span>Try local cuisine for an authentic experience</span>
                        </li>
                        <li className="list-group-item d-flex align-items-center" style={{ backgroundColor: 'white' }}>
                          <div className="bullet-point me-3" style={{ backgroundColor: '#00796b' }}></div>
                          <span>Respect local customs and traditions</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="destination-sidebar">
                <div className="sticky-sidebar">
                  {/* Quick Facts */}
                  <div className="quick-facts-card mb-4">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body p-4">
                        <h5 className="fw-bold mb-4">Quick Facts</h5>
                        
                        <div className="fact-item mb-3 p-3 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted">Province</span>
                            <span className="fw-semibold">{destination.province}</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted">Rating</span>
                            <div className="d-flex align-items-center">
                              {renderRating(destination.rating)}
                            </div>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted">Best For</span>
                            <span className="fw-semibold">{destination.bestFor || "Everyone"}</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted">Best Time</span>
                            <span className="fw-semibold">{destination.bestTime || "Year-round"}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="action-buttons mt-4">
                          <button className="btn btn-primary w-100 mb-3">
                            Find Hotels
                          </button>
                          <button className="btn btn-outline-primary w-100">
                            Plan My Trip
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Categories Card */}
                  {destination.categories && destination.categories.length > 0 && (
                    <div className="categories-card">
                      <div className="card border-0 shadow-sm">
                        <div className="card-body p-4">
                          <h5 className="fw-bold mb-3">Destination Tags</h5>
                          <div className="d-flex flex-wrap gap-2">
                            {destination.categories.map((category, idx) => (
                              <span key={idx} className="tag-badge" style={{ backgroundColor: '#e8f5f3', color: '#00796b' }}>
                                {category}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Styles */}
      <style jsx>{`
        .destination-details-page {
          font-family: 'Inter', sans-serif;
          background: white;
          min-height: 100vh;
        }

        .destination-hero-section {
          position: relative;
          margin-bottom: 2rem;
        }

        .hero-banner {
          border-radius: 0 0 20px 20px;
          overflow: hidden;
        }

        .hero-image {
          height: 500px;
          object-fit: cover;
          filter: brightness(0.8);
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6));
          display: flex;
          align-items: flex-end;
          padding-bottom: 4rem;
        }

        .hero-content {
          animation: fadeInUp 0.8s ease;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .destination-badge .badge {
          background: rgba(0, 121, 107, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .destination-tabs .nav-pills .nav-link {
          border-radius: 10px;
          padding: 12px 24px;
          font-weight: 600;
          margin-right: 10px;
          border: 2px solid transparent;
          transition: all 0.3s ease;
          background: white;
        }

        .destination-tabs .nav-pills .nav-link.active {
          background: linear-gradient(135deg, #00796b 0%, #004d40 100%);
          border-color: #00796b;
          color: white;
          box-shadow: 0 4px 15px rgba(0, 121, 107, 0.3);
        }

        .destination-tabs .nav-pills .nav-link:not(.active) {
          background: white;
          border: 2px solid #e9ecef;
          color: #6c757d;
        }

        .destination-tabs .nav-pills .nav-link:not(.active):hover {
          border-color: #00796b;
          color: #00796b;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 121, 107, 0.1);
        }

        .info-card {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          transition: all 0.3s ease;
        }

        .info-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border-color: #00796b;
          background: white;
        }

        .icon-wrapper {
          transition: transform 0.3s ease;
        }

        .info-card:hover .icon-wrapper {
          transform: scale(1.1);
        }

        .category-badge {
          background: #e8f5f3;
          color: #00796b;
          padding: 6px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          border: 1px solid #b2dfdb;
        }

        .category-badge:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 121, 107, 0.2);
          background: #00796b;
          color: white;
        }

        .highlight-card {
          transition: all 0.3s ease;
        }

        .highlight-card:hover {
          transform: translateY(-5px);
        }

        .highlight-card .card {
          overflow: hidden;
          transition: all 0.3s ease;
          background: white;
        }

        .highlight-card:hover .card {
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15) !important;
        }

        .highlight-image-container {
          height: 200px;
          overflow: hidden;
        }

        .highlight-image {
          height: 100%;
          width: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .highlight-card:hover .highlight-image {
          transform: scale(1.1);
        }

        .activity-item {
          transition: all 0.3s ease;
        }

        .activity-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
          background: white !important;
        }

        .bullet-point {
          width: 8px;
          height: 8px;
          background: #00796b;
          border-radius: 50%;
        }

        .list-group-item {
          border: none;
          padding: 12px 0;
          background: white;
          color: #212529;
        }

        .quick-facts-card .card {
          background: white;
          transition: all 0.3s ease;
        }

        .quick-facts-card .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1) !important;
        }

        .fact-item {
          padding: 15px;
          background: #f8f9fa;
          border-radius: 10px;
        }

        .sticky-sidebar {
          position: sticky;
          top: 100px;
        }

        .tag-badge {
          background: #e8f5f3;
          color: #00796b;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.3s ease;
          border: 1px solid #b2dfdb;
        }

        .tag-badge:hover {
          background: #00796b;
          color: white;
          transform: translateY(-2px);
        }

        .hotel-item {
          transition: all 0.3s ease;
          background: white;
          border: 1px solid #dee2e6;
        }

        .hotel-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
          border-color: #00796b;
        }

        .btn-primary {
          background: linear-gradient(135deg, #00796b, #004d40);
          border: none;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 121, 107, 0.4);
        }

        .btn-outline-primary {
          border-color: #00796b;
          color: #00796b;
          transition: all 0.3s ease;
        }

        .btn-outline-primary:hover {
          background: #00796b;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 121, 107, 0.3);
        }

        /* Responsive Design */
        @media (max-width: 992px) {
          .hero-image {
            height: 400px;
          }
          
          .hero-overlay {
            padding-bottom: 2rem;
          }
          
          .sticky-sidebar {
            position: static;
            margin-top: 2rem;
          }
        }

        @media (max-width: 768px) {
          .hero-image {
            height: 300px;
          }
          
          .destination-tabs .nav-pills {
            flex-direction: column;
            gap: 10px;
          }
          
          .destination-tabs .nav-pills .nav-link {
            margin-right: 0;
            text-align: center;
            width: 100%;
          }
          
          .hero-content h1 {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 576px) {
          .hero-image {
            height: 250px;
          }
          
          .hero-content h1 {
            font-size: 2rem;
          }
          
          .key-info-cards .col-md-6 {
            margin-bottom: 1rem;
          }
        }

        /* Loading Animation */
        .spinner-border {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Accessibility */
        .nav-link:focus,
        .btn:focus,
        .highlight-card:focus-within {
          outline: 2px solid #00796b;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}

export default DestinationDetailsPage;