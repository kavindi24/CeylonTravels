// src/pages/public/AllTransportPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaCar,
  FaUsers,
  FaStar,
  FaHeart,
  FaRegHeart,
  FaFilter,
  FaSort,
  FaCalendarCheck,
  FaGasPump,
  FaCog
} from "react-icons/fa";

function AllTransportPage() {
  const [transports, setTransports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [favorites, setFavorites] = useState(new Set());
  const [activeCategory, setActiveCategory] = useState("all");

  // Transport categories
  const categories = {
    "all": { name: "All Vehicles", icon: FaCar },
    "car": { name: "Cars", icon: FaCar },
    "suv": { name: "SUVs", icon: FaCar },
    "van": { name: "Vans", icon: FaCar },
    "luxury": { name: "Luxury", icon: FaCar },
    "budget": { name: "Budget", icon: FaCar }
  };

  useEffect(() => {
    const fetchTransports = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/transports");
        setTransports(res.data);
        setError(null);
      } catch (err) {
        console.error("Loading error:", err);
        setError("Failed to load transport options. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchTransports();
  }, []);

  // Toggle favorite
  const toggleFavorite = (transportId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(transportId)) {
        newFavorites.delete(transportId);
      } else {
        newFavorites.add(transportId);
      }
      return newFavorites;
    });
  };

  // Filter transports
  const filteredTransports = transports.filter(transport => {
    const matchesSearch = transport.vehicleType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transport.vehicle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transport.features?.some(feature => 
                           feature.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesCategory = activeCategory === "all" || 
                           transport.vehicleType?.toLowerCase().includes(activeCategory) ||
                           transport.category?.toLowerCase().includes(activeCategory);
    
    return matchesSearch && matchesCategory;
  });

  // Sort transports
  const sortedTransports = [...filteredTransports].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.vehicleType.localeCompare(b.vehicleType);
      case "name-desc":
        return b.vehicleType.localeCompare(a.vehicleType);
      case "price-low":
        return a.pricePer1km - b.pricePer1km;
      case "price-high":
        return b.pricePer1km - a.pricePer1km;
      case "seats":
        return b.seats - a.seats;
      default:
        return 0;
    }
  });

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/placeholder.jpg";
  };

  // Render star rating
  const renderRating = (rating) => {
    const stars = [];
    const numericRating = rating || 4.5;
    const fullStars = Math.floor(numericRating);

    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar 
          key={i} 
          className={i < fullStars ? "text-warning" : "text-light"} 
          size={14} 
        />
      );
    }
    
    return (
      <div className="d-flex align-items-center gap-1">
        <div className="d-flex">
          {stars}
        </div>
        <span className="text-muted ms-1 small">({numericRating})</span>
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
          <p className="mt-2">Loading transport options...</p>
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
      </div>
    );
  }

  return (
    <div className="all-transport-page">
      {/* 🚗 Hero Section */}
      <section className="transport-hero text-white text-center d-flex align-items-center justify-content-center position-relative overflow-hidden">
        <div 
          className="hero-bg position-absolute w-100 h-100"
          style={{
            backgroundImage:           "url('https://images.unsplash.com/photo-1527030280862-64139fba04ca?auto=format&fit=crop&w=1600&q=80')",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat"
          }}
        >
        </div>
        <div className="overlay position-absolute w-100 h-100"></div>
        <div className="container z-2 position-relative">
          <div className="animate-fade-in">
            <h1 className="fw-bold display-4 mb-3">Transport Services Across Sri Lanka</h1>
            <p className="lead mb-4">Book reliable rides, scenic drives, and custom journeys</p>
            
            {/* Search in Hero */}
            <div className="row justify-content-center">
              <div className="col-lg-8 col-md-10">
                <div className="input-group input-group-lg shadow-lg">
                  <span className="input-group-text bg-white border-0 px-3">
                    <FaSearch className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 py-3"
                    placeholder="Search by location, vehicle type, or features..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      className="btn btn-outline-secondary border-0 px-3"
                      type="button"
                      onClick={() => setSearchTerm("")}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ❓ How It Works */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">How It Works</h2>
          <div className="row g-4">
            <div className="col-md-4 text-center">
              <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3 icon-wrapper">
                <FaSearch className="text-white fs-3" />
              </div>
              <h5 className="fw-bold">1. Search & Select</h5>
              <p className="text-muted">Find the perfect transport option for your journey</p>
            </div>
            <div className="col-md-4 text-center">
              <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3 icon-wrapper">
                <FaCalendarCheck className="text-white fs-3" />
              </div>
              <h5 className="fw-bold">2. Check Availability</h5>
              <p className="text-muted">See real-time availability and book your preferred option</p>
            </div>
            <div className="col-md-4 text-center">
              <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3 icon-wrapper">
                <FaCar className="text-white fs-3" />
              </div>
              <h5 className="fw-bold">3. Enjoy Your Ride</h5>
              <p className="text-muted">Relax and enjoy your journey with professional drivers</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mt-5">
        {/* Category Filters */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              {Object.entries(categories).map(([key, category]) => {
                const CategoryIcon = category.icon;
                return (
                  <button
                    key={key}
                    className={`btn category-btn ${activeCategory === key ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveCategory(key)}
                  >
                    <CategoryIcon className="me-2" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="row align-items-center mb-4">
          <div className="col-md-6">
            <h2 className="fw-bold mb-2">
              <FaCar className="me-2 text-primary" />
              {categories[activeCategory].name}
            </h2>
            <p className="text-muted mb-0">
              {sortedTransports.length} vehicle{sortedTransports.length !== 1 ? 's' : ''} available
            </p>
          </div>
          <div className="col-md-6">
            <div className="d-flex gap-2 flex-md-row flex-column justify-content-md-end">
              {/* Sort Dropdown */}
              <div className="d-flex align-items-center gap-2">
                <FaSort className="text-muted" />
                <select 
                  className="form-select modern-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Sort A-Z</option>
                  <option value="name-desc">Sort Z-A</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="seats">Most Seats</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        {searchTerm && (
          <div className="row mb-4">
            <div className="col">
              <div className="alert alert-light border d-flex align-items-center">
                <FaFilter className="me-2 text-primary" />
                <span className="flex-grow-1">
                  Found {sortedTransports.length} vehicle{sortedTransports.length !== 1 ? 's' : ''} for "{searchTerm}"
                  {transports.length !== sortedTransports.length && ` (filtered from ${transports.length})`}
                </span>
                <button
                  className="btn btn-sm btn-outline-primary ms-2"
                  onClick={() => setSearchTerm("")}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* No Results State */}
        {sortedTransports.length === 0 ? (
          <div className="text-center my-5 py-5">
            <div className="mb-4">
              <FaCar size={64} className="text-muted mb-4" />
              <h3 className="text-muted">No vehicles found</h3>
              <p className="text-muted fs-5">
                {searchTerm ? `No results for "${searchTerm}". Try a different search term.` : 'No vehicles available at the moment.'}
              </p>
              {searchTerm && (
                <button
                  className="btn btn-primary btn-lg mt-2"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Modern Transport Grid */
          <div className="row g-4">
            {sortedTransports.map((transport) => {
              const imageSrc = transport.images && transport.images.length > 0
                ? `http://localhost:5000${transport.images[0]}`
                : "/placeholder.jpg";

              return (
                <div key={transport.id} className="col-xl-3 col-lg-6">
                  <div className="transport-card-modern h-100 position-relative">
                    {/* Card Image with Overlay */}
                    <div className="card-image-modern position-relative overflow-hidden rounded-3">
                      <img
                        src={imageSrc}
                        alt={transport.vehicleType}
                        className="card-img-modern"
                        onError={handleImageError}
                        loading="lazy"
                      />
                      
                      {/* Price Badge */}
                      <div className="position-absolute top-0 start-0 m-3">
                        <span className="badge price-badge">
                          Rs. {transport.pricePer1km}/km
                        </span>
                      </div>
                      
                      {/* Favorite Button */}
                      <button 
                        className="btn-favorite-modern position-absolute top-0 end-0 m-3"
                        onClick={(e) => toggleFavorite(transport.id, e)}
                      >
                        {favorites.has(transport.id) ? 
                          <FaHeart className="text-danger" size={18} /> : 
                          <FaRegHeart className="text-white" size={18} />
                        }
                      </button>
                      
                      {/* Availability Badge */}
                      <div className="position-absolute top-0 start-0 m-3 mt-5">
                        <span className={`badge ${transport.available ? 'availability-available' : 'availability-unavailable'}`}>
                          {transport.available ? "Available" : "Not Available"}
                        </span>
                      </div>
                      
                      {/* Vehicle Info Overlay */}
                      <div className="card-overlay-modern position-absolute bottom-0 start-0 w-100 p-3">
                        <div className="text-white">
                          <h6 className="fw-bold mb-1">{transport.vehicleType}</h6>
                          <small className="opacity-75">{transport.vehicle}</small>
                        </div>
                      </div>
                    </div>

                    {/* Card Content Below Image */}
                    <div className="card-content-modern p-3">
                      <div className="vehicle-specs mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div className="spec-item d-flex align-items-center">
                            <FaUsers className="text-primary me-2" size={14} />
                            <span className="small">{transport.seats} Seats</span>
                          </div>
                          <div className="spec-item d-flex align-items-center">
                            <FaGasPump className="text-primary me-2" size={14} />
                            <span className="small">Petrol</span>
                          </div>
                          <div className="spec-item d-flex align-items-center">
                            <FaCog className="text-primary me-2" size={14} />
                            <span className="small">Auto</span>
                          </div>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="rating-modern">
                          {renderRating(transport.rating)}
                        </div>
                      </div>

                      {/* Features */}
                      {transport.features && transport.features.length > 0 && (
                        <div className="features-modern mb-3">
                          <div className="d-flex flex-wrap gap-1">
                            {transport.features.slice(0, 3).map((feature, index) => (
                              <span key={index} className="badge feature-tag">
                                {feature}
                              </span>
                            ))}
                            {transport.features.length > 3 && (
                              <span className="badge feature-tag">+{transport.features.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Action Button */}
                      <div className="card-actions-modern">
                        <Link
                          to={`/transport/${transport.id}`}
                          className="btn btn-book-modern w-100 d-flex align-items-center justify-content-center"
                        >
                          View Details & Book
                          <FaCar className="ms-2" size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
                              <hr></hr>
          </div>
          
        )}
      </div>

      {/* Modern CSS Styles */}
      <style jsx>{`
        .all-transport-page {
          font-family: 'Inter', sans-serif;
        }

        /* Hero Section */
        .transport-hero {
          min-height: 60vh;
          position: relative;
        }
        
        .hero-bg {
          background-size: cover;
          background-position: center;
        }
        
        .overlay {
          background: linear-gradient(135deg, rgba(33, 149, 243, 0) 0%, rgba(13, 72, 161, 0) 100%);
        }
        
        .z-2 {
          z-index: 2;
        }

        /* How It Works */
        .icon-wrapper {
          width: 80px;
          height: 80px;
          transition: transform 0.3s ease;
        }

        .icon-wrapper:hover {
          transform: scale(1.1);
        }

        /* Category Buttons */
        .category-btn {
          border-radius: 25px;
          padding: 8px 16px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .category-btn:hover {
          transform: translateY(-2px);
        }

        /* Modern Transport Card */
        .transport-card-modern {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 1px solid rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .transport-card-modern:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
        }

        .card-image-modern {
          height: 220px;
        }

        .card-img-modern {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .transport-card-modern:hover .card-img-modern {
          transform: scale(1.05);
        }

        /* Badges */
        .price-badge {
          background: linear-gradient(135deg, #2196f3, #1976d2);
          color: #fff;
          font-weight: 600;
          font-size: 0.75rem;
          padding: 6px 12px;
          border-radius: 20px;
        }

        .availability-available {
          background: linear-gradient(135deg, #4caf50, #388e3c);
          color: #fff;
          font-weight: 600;
          font-size: 0.7rem;
          padding: 6px 10px;
          border-radius: 15px;
        }

        .availability-unavailable {
          background: linear-gradient(135deg, #f44336, #d32f2f);
          color: #fff;
          font-weight: 600;
          font-size: 0.7rem;
          padding: 6px 10px;
          border-radius: 15px;
        }

        /* Card Overlay */
        .card-overlay-modern {
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
        }

        /* Favorite Button */
        .btn-favorite-modern {
          background: rgba(0, 0, 0, 0.6);
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .btn-favorite-modern:hover {
          background: rgba(0, 0, 0, 0.8);
          transform: scale(1.1);
        }

        /* Card Content */
        .card-content-modern {
          background: #fff;
        }

        .vehicle-specs {
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 1rem;
        }

        .spec-item {
          font-size: 0.8rem;
          color: #666;
        }

        /* Features */
        .feature-tag {
          background: #e3f2fd;
          color: #1976d2;
          font-size: 0.7rem;
          padding: 4px 8px;
          border-radius: 10px;
          font-weight: 500;
        }

        /* Book Button */
        .btn-book-modern {
          background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 10px 16px;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .btn-book-modern:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(33, 150, 243, 0.4);
          color: white;
        }

        /* Rating */
        .rating-modern .text-warning {
          color: #ffc107 !important;
        }

        .rating-modern .text-light {
          color: #e9ecef !important;
        }

        /* Modern Select */
        .modern-select {
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          padding: 8px 16px;
          background: white;
        }

        .modern-select:focus {
          border-color: #2196f3;
          box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
        }

        /* Animation */
        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 1s ease-in-out forwards;
        }
        
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .transport-hero {
            min-height: 50vh;
          }
          
          .display-4 {
            font-size: 2rem;
          }
          
          .card-image-modern {
            height: 180px;
          }
          
          .category-btn {
            font-size: 0.8rem;
            padding: 6px 12px;
          }
          
          .vehicle-specs .d-flex {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}

export default AllTransportPage;