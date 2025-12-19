// src/pages/public/AllDestinationsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaMapMarkerAlt,
  FaHeart,
  FaRegHeart,
  FaSearch,
  FaFilter,
  FaSort,
  FaStar,
  FaCalendarAlt,
  FaUmbrellaBeach,
  FaMonument,
  FaHiking,
  FaLeaf,
  FaCrown
} from "react-icons/fa";

function AllDestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [favorites, setFavorites] = useState(new Set());
  const [activeCategory, setActiveCategory] = useState("all");

  // Category mapping with icons
  const categories = {
    "all": { name: "All Destinations", icon: FaMapMarkerAlt },
    "photographers": { name: "Beach & Coastal", icon: FaUmbrellaBeach },
    "history buffs": { name: "Cultural & Heritage", icon: FaMonument },
    "nature": { name: "Nature & Wildlife", icon: FaLeaf },
    "adventure": { name: "Adventure & Hiking", icon: FaHiking },
  };

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/destinations");
        setDestinations(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching destinations:", err);
        setError("Failed to load destinations. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  // Toggle favorite
  const toggleFavorite = (destinationId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(destinationId)) {
        newFavorites.delete(destinationId);
      } else {
        newFavorites.add(destinationId);
      }
      return newFavorites;
    });
  };

  // Filter destinations based on search term and category
  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = dest.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dest.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dest.province?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dest.country?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === "all" || 
                           dest.categories?.includes(activeCategory) ||
                           dest.bestFor?.toLowerCase().includes(activeCategory);
    
    return matchesSearch && matchesCategory;
  });

  // Sort destinations
  const sortedDestinations = [...filteredDestinations].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
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
    const numericRating = rating || 0;
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

  // Get category icon
  const getCategoryIcon = (category) => {
    const CategoryIcon = categories[category]?.icon || FaMapMarkerAlt;
    return <CategoryIcon size={16} />;
  };

  // Get featured destinations (top 3 rated or marked as featured)
  const featuredDestinations = destinations
    .filter(dest => dest.featured || dest.rating >= 4.5)
    .slice(0, 3);

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading destinations...</p>
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
    <div className="all-destinations-page">
      {/* 🏞 Hero Section */}
      <section className="destinations-hero text-white text-center d-flex align-items-center justify-content-center position-relative overflow-hidden">
        <div 
          className="hero-bg position-absolute w-100 h-100"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
        </div>
        <div className="overlay position-absolute w-100 h-100"></div>
        <div className="container z-2 position-relative">
          <div className="animate-fade-in">
            <h1 className="fw-bold display-4 mb-3">Discover Amazing Destinations</h1>
            <p className="lead mb-4">Explore the best places to visit in Sri Lanka and beyond</p>
            
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
                    placeholder="Search destinations, locations, or activities..."
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

      {/* 🌟 Enhanced Featured Destinations Section */}
      {featuredDestinations.length > 0 && (
        <section className="featured-destinations-section py-5 bg-light">
          <div className="container">
            <div className="text-center mb-5">
              <div className="featured-header d-inline-flex align-items-center justify-content-center gap-3 mb-3">
                <h2 className="fw-bold mb-0">Featured Destinations</h2>
              </div>
              <p className="text-muted lead">
                Handpicked destinations loved by travelers worldwide
              </p>
            </div>
            
            <div className="row g-4 justify-content-center">
              {featuredDestinations.map((dest, index) => {
                const imgSrc = dest.img
                  ? `http://localhost:5000${dest.img}`
                  : "/placeholder.jpg";
                
                return (
                  <div key={dest.id} className="col-lg-4 col-md-6">
                    <div className="featured-card position-relative h-100">
                      {/* Featured Badge */}
                      <div className="featured-glowing-badge">
                        <FaCrown className="me-1" size={14} />
                        Featured
                      </div>
                      
                      {/* Card Image */}
                      <div className="featured-image-container position-relative overflow-hidden rounded-4">
                        <img
                          src={imgSrc}
                          alt={dest.name}
                          className="featured-card-img"
                          onError={handleImageError}
                          loading="lazy"
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="featured-overlay position-absolute top-0 start-0 w-100 h-100"></div>
                        
                        {/* Content Overlay */}
                        <div className="featured-content position-absolute bottom-0 start-0 w-100 p-4 text-white">
                          <div className="featured-rating mb-2">
                            {renderRating(dest.rating)}
                          </div>
                          <h3 className="featured-title fw-bold mb-2">{dest.name}</h3>
                          <div className="featured-location d-flex align-items-center mb-3">
                            <FaMapMarkerAlt className="me-2" size={14} />
                            <span>{dest.province}, {dest.country}</span>
                          </div>
                          <p className="featured-description mb-3">
                            {dest.description?.slice(0, 80)}...
                          </p>
                          
                          {/* Categories */}
                          <div className="featured-categories mb-3">
                            {(dest.categories || [dest.bestFor] || []).slice(0, 2).map((category, idx) => (
                              <span key={idx} className="featured-category-tag">
                                {category}
                              </span>
                            ))}
                          </div>
                          
                          {/* Action Button */}
                          <Link 
                            to={`/destination/${dest.id}`}
                            className="btn btn-featured-explore w-100"
                          >
                            Discover Now
                            <FaArrowRight className="ms-2" size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <div className="container mt-5">
       <h2 className="fw-bold mb-2, align-items-center d-flex justify-content-center">
              {categories[activeCategory].name}
      </h2>
      <hr></hr>
          
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
            
            <p className="text-muted mb-0">
              {sortedDestinations.length} amazing place{sortedDestinations.length !== 1 ? 's' : ''} to explore
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
                  <option value="rating">Highest Rated</option>
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
                  Found {sortedDestinations.length} destination{sortedDestinations.length !== 1 ? 's' : ''} for "{searchTerm}"
                  {destinations.length !== sortedDestinations.length && ` (filtered from ${destinations.length})`}
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
        {sortedDestinations.length === 0 ? (
          <div className="text-center my-5 py-5">
            <div className="mb-4">
              <FaMapMarkerAlt size={64} className="text-muted mb-4" />
              <h3 className="text-muted">No destinations found</h3>
              <p className="text-muted fs-5">
                {searchTerm ? `No results for "${searchTerm}". Try a different search term.` : 'No destinations available at the moment.'}
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
          /* Modern Destinations Grid - Image Style */
          <div className="row g-4">
            {sortedDestinations.map((dest) => {
              const imgSrc = dest.img
                ? `http://localhost:5000${dest.img}`
                : "/placeholder.jpg";

              return (
                <div key={dest.id} className="col-xl-3 col-lg-4 col-md-6">
                  <div className="destination-card-modern h-100 position-relative">
                    {/* Card Image with Overlay */}
                    <div className="card-image-modern position-relative overflow-hidden rounded-3">
                      <img
                        src={imgSrc}
                        alt={dest.name}
                        className="card-img-modern"
                        onError={handleImageError}
                        loading="lazy"
                      />
                      
                      {/* Featured Badge */}
                      {dest.featured && (
                        <div className="position-absolute top-0 start-0 m-3">
                          <span className="badge featured-badge">
                            <FaCrown className="me-1" size={10} />
                            Featured
                          </span>
                        </div>
                      )}
                      
                      {/* Favorite Button */}
                      <button 
                        className="btn-favorite-modern position-absolute top-0 end-0 m-3"
                        onClick={(e) => toggleFavorite(dest.id, e)}
                      >
                        {favorites.has(dest.id) ? 
                          <FaHeart className="text-danger" size={18} /> : 
                          <FaRegHeart className="text-white" size={18} />
                        }
                      </button>
                      
                      {/* Category Badge */}
                      <div className="position-absolute top-0 start-0 m-3 mt-5">
                        <span className="badge category-badge">
                          {getCategoryIcon(dest.categories?.[0] || 'all')}
                          {categories[dest.categories?.[0]]?.name || dest.bestFor || "Destination"}
                        </span>
                      </div>
                      
                      {/* Location Info Overlay */}
                      <div className="card-overlay-modern position-absolute bottom-0 start-0 w-100 p-3">
                        <div className="text-white">
                          <span className="badge location-badge-modern mb-2">
                            <FaMapMarkerAlt className="me-1" size={10} />
                            {dest.province}
                          </span>
                          <h6 className="fw-bold mb-1">{dest.name}</h6>
                          <small className="opacity-75">{dest.country}</small>
                        </div>
                      </div>
                    </div>

                    {/* Card Content Below Image */}
                    <div className="card-content-modern p-3">
                      <p className="card-description-modern text-muted small mb-3">
                        {dest.description?.slice(0, 100)}...
                      </p>

                      {/* Rating and Best Time */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="rating-modern">
                          {renderRating(dest.rating)}
                        </div>
                        {dest.bestTime && (
                          <div className="best-time-modern text-muted small">
                            <FaCalendarAlt className="me-1" size={12} />
                            {dest.bestTime}
                          </div>
                        )}
                      </div>
                      
                      {/* Categories Tags */}
                      <div className="categories-modern d-flex flex-wrap gap-1 mb-3">
                        {(dest.categories || [dest.bestFor] || []).slice(0, 3).map((category, index) => (
                          <span key={index} className="badge category-tag">
                            {category}
                          </span>
                        ))}
                      </div>
                      
                      {/* Action Button */}
                      <div className="card-actions-modern">
                        <Link
                          to={`/destination/${dest.id}`}
                          className="btn btn-explore-modern w-100 d-flex align-items-center justify-content-center"
                        >
                          Explore
                          <FaArrowRight className="ms-2" size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modern CSS Styles */}
      <style jsx>{`
        .all-destinations-page {
          font-family: 'Inter', sans-serif;
        }

        /* Hero Section */
        .destinations-hero {
          min-height: 70vh;
          position: relative;
        }
        
        .hero-bg {
          background-size: cover;
          background-position: center;
        }
        
        .overlay {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0) 0%, rgba(118, 75, 162, 0.25) 100%);
        }
        
        .z-2 {
          z-index: 2;
        }

        /* 🌟 Featured Destinations Section */
        .featured-destinations-section {
          background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
          position: relative;
        }

        .featured-header {
          position: relative;
        }

        .featured-crown {
          filter: drop-shadow(0 2px 4px rgba(255, 193, 7, 0.3));
          animation: float 3s ease-in-out infinite;
        }

        .featured-crown:nth-child(1) {
          animation-delay: 0s;
        }

        .featured-crown:nth-child(3) {
          animation-delay: 1.5s;
        }

        .featured-card {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
          transition: all 0.3s ease;
        }

        .featured-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .featured-glowing-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: #000;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 0.8rem;
          z-index: 10;
          display: flex;
          align-items: center;
          box-shadow: 0 4px 15px rgba(255, 165, 0, 0.3);
          animation: pulse 2s infinite;
        }

        .featured-image-container {
          height: 400px;
          position: relative;
        }

        .featured-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .featured-card:hover .featured-card-img {
          transform: scale(1.1);
        }

        .featured-overlay {
          background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, transparent 50%);
        }

        .featured-content {
          z-index: 2;
        }

        .featured-title {
          font-size: 1.5rem;
          line-height: 1.2;
        }

        .featured-description {
          opacity: 0.9;
          line-height: 1.5;
        }

        .featured-categories {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .featured-category-tag {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          padding: 4px 12px;
          border-radius: 15px;
          font-size: 0.75rem;
          font-weight: 500;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .btn-featured-explore {
          background: linear-gradient(135deg, #00b7ffff, #00aeffff);
          color: #000;
          border: none;
          border-radius: 12px;
          padding: 12px 24px;
          font-weight: 700;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-featured-explore:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 165, 0, 0.4);
          color: #000;
        }

        /* Animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 4px 15px rgba(255, 165, 0, 0.3); }
          50% { box-shadow: 0 4px 20px rgba(255, 165, 0, 0.6); }
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

        /* Modern Destination Card */
        .destination-card-modern {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 1px solid rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .destination-card-modern:hover {
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

        .destination-card-modern:hover .card-img-modern {
          transform: scale(1.05);
        }

        /* Badges */
        .featured-badge {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: #000;
          font-weight: 600;
          font-size: 0.75rem;
          padding: 6px 12px;
          border-radius: 20px;
          display: flex;
          align-items: center;
        }

        .category-badge {
          background: rgba(255, 255, 255, 0.95);
          color: #333;
          font-weight: 600;
          font-size: 0.7rem;
          padding: 6px 10px;
          border-radius: 15px;
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .location-badge-modern {
          background: rgba(0, 0, 0, 0.7);
          font-size: 0.7rem;
          padding: 4px 8px;
          border-radius: 12px;
          backdrop-filter: blur(10px);
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

        .card-description-modern {
          line-height: 1.5;
          min-height: 48px;
        }

        /* Categories Tags */
        .category-tag {
          background: #f8f9fa;
          color: #6c757d;
          border: 1px solid #e9ecef;
          font-size: 0.7rem;
          padding: 4px 8px;
          border-radius: 12px;
          font-weight: 500;
        }

        /* Explore Button */
        .btn-explore-modern {
          background: linear-gradient(135deg, #012ffaff 0%, #483cfdff 100%);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 10px 16px;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .btn-explore-modern:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(102, 126, 234, 0.4);
          color: white;
        }

        /* Rating */
        .rating-modern .text-warning {
          color: #ffc107 !important;
        }

        .rating-modern .text-light {
          color: #e9ecef !important;
        }

        .best-time-modern {
          font-size: 0.8rem;
        }

        /* Modern Select */
        .modern-select {
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          padding: 8px 16px;
          background: white;
        }

        .modern-select:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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
          .destinations-hero {
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
          
          .featured-image-container {
            height: 300px;
          }
          
          .featured-header h2 {
            font-size: 1.5rem;
          }
          
          .featured-crown {
            size: 24px;
          }
        }
      `}</style>
    </div>
  );
}

export default AllDestinationsPage;