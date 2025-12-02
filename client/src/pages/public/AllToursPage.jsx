// src/pages/public/AllToursPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { 
  FaSearch, 
  FaUserCheck, 
  FaShieldAlt, 
  FaLeaf, 
  FaSmile,
  FaArrowRight,
  FaMapMarkerAlt,
  FaHeart,
  FaRegHeart,
  FaFilter,
  FaSort,
  FaClock,
  FaUsers,
  FaMountain,
  FaUmbrellaBeach,
  FaMonument,
  FaHiking,
  FaLeaf as FaNature
} from "react-icons/fa";

function AllToursPage() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [favorites, setFavorites] = useState(new Set());
  const [activeCategory, setActiveCategory] = useState("all");

  // Tour categories
  const categories = {
    "all": { name: "All Tours", icon: FaMapMarkerAlt },
    "adventure": { name: "Adventure", icon: FaHiking },
    "cultural": { name: "Cultural", icon: FaMonument },
    "nature": { name: "Nature", icon: FaNature },
    "beach": { name: "Beach", icon: FaUmbrellaBeach },
    "wildlife": { name: "Wildlife", icon: FaLeaf },
    "hill": { name: "Hill Country", icon: FaMountain }
  };

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tour-packages");
        setTours(res.data);
        setError(null);
      } catch (err) {
        console.error("Error loading tour packages:", err);
        setError("Failed to load tour packages. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  // Toggle favorite
  const toggleFavorite = (tourId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(tourId)) {
        newFavorites.delete(tourId);
      } else {
        newFavorites.add(tourId);
      }
      return newFavorites;
    });
  };

  // Filter tours
  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === "all" || 
                           tour.category?.toLowerCase().includes(activeCategory);
    
    return matchesSearch && matchesCategory;
  });

  // Sort tours
  const sortedTours = [...filteredTours].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.title.localeCompare(b.title);
      case "name-desc":
        return b.title.localeCompare(a.title);
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "duration":
        return (b.durationNum || 0) - (a.durationNum || 0);
      default:
        return 0;
    }
  });

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/placeholder.jpg";
  };


  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading tour packages...</p>
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
    <div className="all-tours-page">
      {/* 🏔 Hero Section */}
      <section className="tours-hero text-white text-center d-flex align-items-center justify-content-center position-relative overflow-hidden">
        <div 
          className="hero-bg position-absolute w-100 h-100"
          style={{
            backgroundImage: "url('https://www.intermiles.com/iwov-resources/images/blog/best-places-in-sri-lanka/15-best-places-in-sri-lanka-Desktop-2000x500.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
        </div>
        <div className="overlay position-absolute w-100 h-100"></div>
        <div className="container z-2 position-relative">
          <div className="animate-fade-in">
            <h1 className="fw-bold display-4 mb-3">Discover Amazing Tours</h1>
            <p className="lead mb-4">Embark on unforgettable adventures across Sri Lanka's breathtaking landscapes</p>
            
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
                    placeholder="Search tours, locations, or experiences..."
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

      {/* 🌟 Why Choose Us Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark">Why Choose Our Tours?</h2>
            <p className="text-muted">Experience the difference with our carefully crafted adventures</p>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="text-center p-4 h-100 feature-card bg-white rounded-4 shadow-sm border-0">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 icon-wrapper p-3">
                  <FaUserCheck className="fs-3" />
                </div>
                <h5 className="fw-bold">Expert Local Guides</h5>
                <p className="text-muted mb-0">Knowledgeable locals who love sharing their culture and stories.</p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="text-center p-4 h-100 feature-card bg-white rounded-4 shadow-sm border-0">
                <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 icon-wrapper p-3">
                  <FaShieldAlt className="fs-3" />
                </div>
                <h5 className="fw-bold">Safety First</h5>
                <p className="text-muted mb-0">Your safety is our priority with comprehensive precautions.</p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="text-center p-4 h-100 feature-card bg-white rounded-4 shadow-sm border-0">
                <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 icon-wrapper p-3">
                  <FaLeaf className="fs-3" />
                </div>
                <h5 className="fw-bold">Sustainable Tourism</h5>
                <p className="text-muted mb-0">Committed to eco-friendly practices and local communities.</p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="text-center p-4 h-100 feature-card bg-white rounded-4 shadow-sm border-0">
                <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 icon-wrapper p-3">
                  <FaSmile className="fs-3" />
                </div>
                <h5 className="fw-bold">Memorable Experiences</h5>
                <p className="text-muted mb-0">Create moments you'll cherish long after your trip ends.</p>
              </div>
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
              <FaMapMarkerAlt className="me-2 text-primary" />
              {categories[activeCategory].name}
            </h2>
            <p className="text-muted mb-0">
              {sortedTours.length} amazing tour{sortedTours.length !== 1 ? 's' : ''} to experience
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
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="duration">Longest Duration</option>
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
                  Found {sortedTours.length} tour{sortedTours.length !== 1 ? 's' : ''} for "{searchTerm}"
                  {tours.length !== sortedTours.length && ` (filtered from ${tours.length})`}
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
        {sortedTours.length === 0 ? (
          <div className="text-center my-5 py-5">
            <div className="mb-4">
              <FaMapMarkerAlt size={64} className="text-muted mb-4" />
              <h3 className="text-muted">No tours found</h3>
              <p className="text-muted fs-5">
                {searchTerm ? `No results for "${searchTerm}". Try a different search term.` : 'No tours available at the moment.'}
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
          /* Modern Tours Grid */
          <div className="row g-4">
            {sortedTours.map((tour) => {
              const imgSrc = tour.image
                ? `http://localhost:5000${tour.image}`
                : "/placeholder.jpg";

              return (
                <div key={tour.id} className="col-xl-4 col-lg-6">
                  <div className="tour-card-modern h-100 position-relative">
                    {/* Card Image with Overlay */}
                    <div className="card-image-modern position-relative overflow-hidden rounded-3">
                      <img
                        src={imgSrc}
                        alt={tour.title}
                        className="card-img-modern"
                        onError={handleImageError}
                        loading="lazy"
                      />
                      
                      {/* Price Badge */}
                      <div className="position-absolute top-0 start-0 m-3">
                        <span className="badge price-badge">
                          LKR {tour.price?.toLocaleString()}
                        </span>
                      </div>
                      
                      {/* Favorite Button */}
                      <button 
                        className="btn-favorite-modern position-absolute top-0 end-0 m-3"
                        onClick={(e) => toggleFavorite(tour.id, e)}
                      >
                        {favorites.has(tour.id) ? 
                          <FaHeart className="text-danger" size={18} /> : 
                          <FaRegHeart className="text-white" size={18} />
                        }
                      </button>
                      
                      {/* Category Badge */}
                      <div className="position-absolute top-0 start-0 m-3 mt-5">
                        <span className="badge category-badge">
                          {tour.category}
                        </span>
                      </div>
                      
                      {/* Location Info Overlay */}
                      <div className="card-overlay-modern position-absolute bottom-0 start-0 w-100 p-3">
                        <div className="text-white">
                          <span className="badge location-badge-modern mb-2">
                            <FaMapMarkerAlt className="me-1" size={10} />
                            {tour.location}
                          </span>
                          <h6 className="fw-bold mb-1">{tour.title}</h6>
                          <small className="opacity-75">
                            {tour.Destination?.name || "Sri Lanka"}
                          </small>
                        </div>
                      </div>
                    </div>

                    {/* Card Content Below Image */}
                    <div className="card-content-modern p-3">
                      <p className="card-description-modern text-muted small mb-3">
                        {tour.description?.slice(0, 100) || "Experience an amazing adventure..."}...
                      </p>

                      {/* Tour Details */}
                      <div className="tour-details-grid mb-3">
                        <div className="detail-item">
                          <FaClock className="text-primary" size={12} />
                          <span className="small">{tour.duration}</span>
                        </div>
                        <div className="detail-item">
                          <FaUsers className="text-primary" size={12} />
                          <span className="small">Group Tour</span>
                        </div>
                        {tour.category && (
                          <div className="detail-item">
                            <FaMapMarkerAlt className="text-primary" size={12} />
                            <span className="small">{tour.category}</span>
                          </div>
                        )}
                      </div>                     

                      {/* Highlights Preview */}
                      {tour.highlights?.length > 0 && (
                        <div className="highlights-modern mb-3">
                          <strong className="small text-dark">Highlights:</strong>
                          <div className="d-flex flex-wrap gap-1 mt-1">
                            {tour.highlights.slice(0, 3).map((highlight, index) => (
                              <span key={index} className="badge highlight-tag">
                                {highlight}
                              </span>
                            ))}
                            {tour.highlights.length > 3 && (
                              <span className="badge highlight-tag">+{tour.highlights.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Action Button */}
                      <div className="card-actions-modern">
                        <Link
                          to={`/tour-package/${tour.id}`}
                          className="btn btn-explore-modern w-100 d-flex align-items-center justify-content-center"
                        >
                          View Tour Details
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

<hr></hr>
        {/* 🚩 CTA Section */}
        <section className="py-5 bg-primary text-white position-relative overflow-hidden cta-section">
          <div className="container position-relative z-2">
            <div className="row align-items-center">
              <div className="col-lg-8 text-center text-lg-start mb-4 mb-lg-0">
                <h3 className="fw-bold mb-2">Ready to Explore Sri Lanka?</h3>
                <p className="mb-0">Book your adventure today or speak with our travel experts to create a custom itinerary</p>
              </div>
              <div className="col-lg-4 text-center text-lg-end">
                {/* Buttons */}
              <div className="d-flex justify-content-center gap-3 mt-4">
              <Link to="/contact" className="btn btn-light fw-semibold px-4 rounded-pill">
                Plan with an Expert
                </Link>
              <Link to="/listingsr" className="btn btn-outline-light fw-semibold px-4 rounded-pill">
                Browse All Tours
                </Link>
                </div>
                </div>
            </div>
          </div>
          <div className="position-absolute top-0 end-0 h-100 w-50 opacity-10">
            <img 
              src="https://res.cloudinary.com/enchanting/image/upload/v1/artemis-mdm/places/b9d4840f-846c-4f68-af0f-5fba9418b764.jpg" 
              alt="Background" 
              className="h-100 w-100 object-fit-cover"
            />
          </div>
        </section>

      {/* Modern CSS Styles */}
      <style jsx>{`
        .all-tours-page {
          font-family: 'Inter', sans-serif;
        }

        /* Hero Section */
        .tours-hero {
          min-height: 60vh;
          position: relative;
        }
        
        .hero-bg {
          background-size: cover;
          background-position: center;
        }
        
        .overlay {
          background: linear-gradient(135deg, rgba(255, 111, 0, 0) 0%, rgba(255, 153, 0, 0) 100%);
        }
        
        .z-2 {
          z-index: 2;
        }

        /* Feature Cards */
        .feature-card {
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
        }

        .icon-wrapper {
          transition: transform 0.3s ease;
        }

        .feature-card:hover .icon-wrapper {
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

        /* Modern Tour Card */
        .tour-card-modern {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 1px solid rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .tour-card-modern:hover {
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

        .tour-card-modern:hover .card-img-modern {
          transform: scale(1.05);
        }

        /* Badges */
        .price-badge {
          background: linear-gradient(135deg, #0051ffff, #002fffff);
          color: #fff;
          font-weight: 600;
          font-size: 0.75rem;
          padding: 6px 12px;
          border-radius: 20px;
        }

        .category-badge {
          background: rgba(255, 255, 255, 0.95);
          color: #333;
          font-weight: 600;
          font-size: 0.7rem;
          padding: 6px 10px;
          border-radius: 15px;
          backdrop-filter: blur(10px);
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

        /* Tour Details Grid */
        .tour-details-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: #6c757d;
        }

        /* Highlights */
        .highlight-tag {
          background: #e3f2fd;
          color: #1976d2;
          font-size: 0.7rem;
          padding: 4px 8px;
          border-radius: 10px;
          font-weight: 500;
        }

        /* Explore Button */
        .btn-explore-modern {
          background: linear-gradient(135deg, #001affff 0%, #002fffff 100%);
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
          box-shadow: 0 6px 15px rgba(255, 111, 0, 0.4);
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
          border-color: #FF6F00;
          box-shadow: 0 0 0 3px rgba(255, 111, 0, 0.1);
        }

        /* CTA Section */
        .cta-section {
          background: linear-gradient(135deg, #ff6f001e 0%, #ff99000a 100%);
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
          .tours-hero {
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
          
          .tour-details-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default AllToursPage;