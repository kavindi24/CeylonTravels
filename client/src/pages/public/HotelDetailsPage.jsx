// src/pages/public/HotelDetailsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaStar,
  FaHeart,
  FaRegHeart,
  FaWifi,
  FaSwimmingPool,
  FaParking,
  FaUtensils,
  FaSnowflake,
  FaDumbbell,
  FaSpa,
  FaConciergeBell,
  FaShieldAlt,
  FaCheck,
  FaShare} from "react-icons/fa";

function HotelDetailsPage() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedImage, setSelectedImage] = useState(0);

  // Amenity icons mapping
  const amenityIcons = {
    "wifi": FaWifi,
    "pool": FaSwimmingPool,
    "parking": FaParking,
    "restaurant": FaUtensils,
    "ac": FaSnowflake,
    "gym": FaDumbbell,
    "spa": FaSpa,
    "concierge": FaConciergeBell
  };

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/hotels/${id}`);
        setHotel(res.data);
        setError(null);
      } catch (err) {
        console.error("Error loading hotel:", err);
        setError("Failed to load hotel details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
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
          size={20} 
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

  const renderAmenityIcon = (amenity) => {
    const AmenityIcon = amenityIcons[amenity.toLowerCase()] || FaCheck;
    return <AmenityIcon className="text-primary" size={18} />;
  };

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading hotel details...</p>
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
          <Link to="/hotels" className="btn btn-primary">
            <FaArrowLeft className="me-2" />
            Back to Hotels
          </Link>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <h3>Hotel not found</h3>
          <Link to="/hotels" className="btn btn-primary mt-3">
            <FaArrowLeft className="me-2" />
            Back to Hotels
          </Link>
        </div>
      </div>
    );
  }

  const mainImage = hotel.images && hotel.images.length > 0
    ? `http://localhost:5000${hotel.images[0]}`
    : "/placeholder.jpg";

  return (
    <div className="hotel-details-page">
      {/* Navigation Header */}
      <div className="container py-3">
        <div className="row align-items-center">
          <div className="col">
            <Link to="/listings/hotels" className="btn btn-outline-primary btn-sm">
              <FaArrowLeft className="me-2" />
              Back to Hotels
            </Link>
          </div>
          <div className="col-auto">
            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary btn-sm">
                <FaShare size={14} />
              </button>
              <button 
                className={`btn btn-sm ${isFavorite ? 'btn-danger' : 'btn-outline-danger'}`}
                onClick={toggleFavorite}
              >
                {isFavorite ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hotel Hero Section */}
      <section className="hotel-hero-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              {/* Main Image */}
              <div className="main-image-container rounded-3 overflow-hidden mb-3">
                <img
                  src={hotel.images && hotel.images[selectedImage] 
                    ? `http://localhost:5000${hotel.images[selectedImage]}` 
                    : mainImage}
                  alt={hotel.name}
                  className="w-100"
                  style={{ height: "400px", objectFit: "cover" }}
                />
              </div>

              {/* Thumbnail Images */}
              {hotel.images && hotel.images.length > 1 && (
                <div className="thumbnail-grid">
                  {hotel.images.slice(0, 4).map((image, index) => (
                    <div 
                      key={index}
                      className={`thumbnail-item ${selectedImage === index ? 'active' : ''}`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={`http://localhost:5000${image}`}
                        alt={`${hotel.name} view ${index + 1}`}
                        className="thumbnail-image"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Booking Sidebar */}
            <div className="col-lg-4">
              <div className="booking-card">
                <div className="card border-0 shadow-lg rounded-3">
                  <div className="card-body p-4">
                    <div className="price-section text-center mb-4">
                      <h2 className="text-primary fw-bold">LKR {hotel.price?.toLocaleString()}</h2>
                      <p className="text-muted">per night</p>
                    </div>

                    <div className="hotel-quick-info mb-4">
                      <div className="info-item d-flex align-items-center justify-content-between mb-2">
                        <span className="text-muted">Rating</span>
                        <div className="d-flex align-items-center">
                          {renderRating(hotel.rating)}
                        </div>
                      </div>
                      <div className="info-item d-flex align-items-center justify-content-between mb-2">
                        <span className="text-muted">Location</span>
                        <span className="fw-semibold">
                          <FaMapMarkerAlt className="me-1" size={12} />
                          {hotel.location}
                        </span>
                      </div>
                    </div>

                    <div className="booking-actions">
                      <Link 
                        to={`/public/book-hotel/${hotel.id}`}
                        className="btn btn-primary btn-lg w-100 mb-3"
                      >
                        Book Now
                      </Link>
                      
                      <button className="btn btn-outline-primary w-100">
                        Contact Hotel
                      </button>
                    </div>

                    <div className="security-features mt-4 pt-3 border-top">
                      <div className="d-flex justify-content-center gap-3">
                        <div className="text-center">
                          <FaShieldAlt className="text-success mb-1" />
                          <small className="d-block text-muted">Secure Booking</small>
                        </div>
                        <div className="text-center">
                          <FaCheck className="text-success mb-1" />
                          <small className="d-block text-muted">Best Price</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hotel Details Section */}
      <section className="hotel-details-section py-4">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              {/* Hotel Header */}
              <div className="hotel-header mb-4">
                <h1 className="fw-bold display-5 mb-2">{hotel.name}</h1>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="d-flex align-items-center text-muted">
                    <FaMapMarkerAlt className="me-2" />
                    <span>{hotel.location}</span>
                  </div>
                  {hotel.Destination && (
                    <div className="badge bg-primary">
                      {hotel.Destination.name}
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="hotel-tabs mb-4">
                <div className="nav nav-pills" role="tablist">
                  <button
                    className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
                    onClick={() => setActiveTab("overview")}
                  >
                    Overview
                  </button>
                  <button
                    className={`nav-link ${activeTab === "amenities" ? "active" : ""}`}
                    onClick={() => setActiveTab("amenities")}
                  >
                    Amenities
                  </button>
                  <button
                    className={`nav-link ${activeTab === "rooms" ? "active" : ""}`}
                    onClick={() => setActiveTab("rooms")}
                  >
                    Rooms
                  </button>
                  <button
                    className={`nav-link ${activeTab === "reviews" ? "active" : ""}`}
                    onClick={() => setActiveTab("reviews")}
                  >
                    Reviews
                  </button>
                </div>
              </nav>

              {/* Tab Content */}
              <div className="tab-content">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="overview-content">
                    <h3 className="fw-bold mb-3">About This Hotel</h3>
                    <p className="lead text-muted mb-4">
                      {hotel.fullDescription || hotel.description || "Experience luxury and comfort in this beautiful hotel."}
                    </p>

                    {/* Key Features */}
                    <div className="key-features mb-4">
                      <h4 className="fw-bold mb-3">Key Features</h4>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <FaCheck className="text-success me-3" />
                            <span>Prime Location</span>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <FaCheck className="text-success me-3" />
                            <span>Professional Staff</span>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <FaCheck className="text-success me-3" />
                            <span>Modern Facilities</span>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <FaCheck className="text-success me-3" />
                            <span>Excellent Service</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Amenities Tab */}
                {activeTab === "amenities" && (
                  <div className="amenities-content">
                    <h3 className="fw-bold mb-4">Hotel Amenities</h3>
                    <div className="row g-3">
                      {hotel.amenities?.length > 0 ? (
                        hotel.amenities.map((amenity, index) => (
                          <div key={index} className="col-md-6">
                            <div className="amenity-item d-flex align-items-center p-3 bg-light rounded-3">
                              {renderAmenityIcon(amenity)}
                              <span className="ms-3 fw-semibold">{amenity}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-12">
                          <p className="text-muted">No amenities listed.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Rooms Tab */}
                {activeTab === "rooms" && (
                  <div className="rooms-content">
                    <h3 className="fw-bold mb-4">Room Types</h3>
                    <div className="row g-4">
                      {hotel.roomTypes?.length > 0 ? (
                        hotel.roomTypes.map((room, index) => (
                          <div key={index} className="col-12">
                            <div className="room-card p-4 border rounded-3">
                              <div className="row align-items-center">
                                <div className="col-md-8">
                                  <h5 className="fw-bold mb-2">{room.type}</h5>
                                  <p className="text-muted mb-2">{room.description}</p>
                                  <div className="room-features">
                                    {room.features?.slice(0, 3).map((feature, idx) => (
                                      <span key={idx} className="badge bg-light text-dark me-2">
                                        {feature}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div className="col-md-4 text-end">
                                  <h4 className="text-primary fw-bold mb-2">
                                    LKR {room.price?.toLocaleString()}
                                  </h4>
                                  <small className="text-muted">per night</small>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-12">
                          <p className="text-muted">No room types available.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                  <div className="reviews-content">
                    <h3 className="fw-bold mb-4">Guest Reviews</h3>
                    <div className="reviews-summary mb-4">
                      <div className="row align-items-center">
                        <div className="col-md-4 text-center">
                          <div className="average-rating">
                            <h2 className="fw-bold text-primary">{hotel.rating}</h2>
                            {renderRating(hotel.rating)}
                            <p className="text-muted mt-2">Based on {hotel.reviews?.length || 0} reviews</p>
                          </div>
                        </div>
                        <div className="col-md-8">
                          {/* Rating breakdown can be added here */}
                        </div>
                      </div>
                    </div>
                    
                    {hotel.reviews?.length > 0 ? (
                      hotel.reviews.map((review, index) => (
                        <div key={index} className="review-card p-4 border rounded-3 mb-3">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <h6 className="fw-bold mb-1">{review.user}</h6>
                              {renderRating(review.rating)}
                            </div>
                            <small className="text-muted">2 weeks ago</small>
                          </div>
                          <p className="text-muted mb-0">
                            {review.comment}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted">No reviews yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CSS Styles */}
      <style jsx>{`
        .hotel-details-page {
          font-family: 'Inter', sans-serif;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .hotel-hero-section {
          padding: 2rem 0;
          background: white;
        }

        .main-image-container {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .thumbnail-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .thumbnail-item {
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .thumbnail-item.active {
          border-color: #00796b;
        }

        .thumbnail-item:hover {
          transform: scale(1.05);
        }

        .thumbnail-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .booking-card {
          position: sticky;
          top: 100px;
        }

        .booking-card .card {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          border: 1px solid #e3f2fd;
        }

        .hotel-tabs .nav-pills .nav-link {
          border-radius: 10px;
          padding: 12px 24px;
          font-weight: 600;
          margin-right: 10px;
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .hotel-tabs .nav-pills .nav-link.active {
          background: linear-gradient(135deg, #00796b 0%, #004d40 100%);
          border-color: #00796b;
          color: white;
        }

        .hotel-tabs .nav-pills .nav-link:not(.active) {
          background: white;
          border: 2px solid #e9ecef;
          color: #6c757d;
        }

        .hotel-tabs .nav-pills .nav-link:not(.active):hover {
          border-color: #00796b;
          color: #00796b;
        }

        .amenity-item {
          transition: transform 0.3s ease;
        }

        .amenity-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .room-card {
          transition: all 0.3s ease;
          background: white;
        }

        .room-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }

        .review-card {
          background: white;
          transition: transform 0.2s ease;
        }

        .review-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
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
        }

        @media (max-width: 768px) {
          .thumbnail-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .booking-card {
            position: static;
            margin-top: 2rem;
          }
          
          .hotel-tabs .nav-pills {
            flex-direction: column;
            gap: 10px;
          }
          
          .hotel-tabs .nav-pills .nav-link {
            margin-right: 0;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}

export default HotelDetailsPage;