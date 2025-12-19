// src/pages/public/AllHotelsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaHeart,
  FaRegHeart,
  FaSearch,
  FaFilter,
  FaSort,
  FaStar,
  FaBed,
  FaSwimmingPool,
  FaWifi,
  FaParking,
  FaUtensils,
  FaSnowflake
} from "react-icons/fa";

function AllHotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [favorites, setFavorites] = useState(new Set());
  const [activeCategory, setActiveCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedLocation, setSelectedLocation] = useState("all");

  // Hotel categories
  const categories = {
    "all": { name: "All Hotels", icon: FaBed },
    "luxury": { name: "Luxury", icon: FaStar },
    "boutique": { name: "Boutique", icon: FaBed },
    "beach": { name: "Beach Resort", icon: FaSwimmingPool },
    "mountain": { name: "Mountain View", icon: FaSnowflake },
    "city": { name: "City Center", icon: FaMapMarkerAlt }
  };

  // Hotel amenities icons
  const amenitiesIcons = {
    "wifi" : FaWifi,
    "Free Wi-Fi": FaWifi,
    "pool": FaSwimmingPool,
    "parking": FaParking,
    "restaurant": FaUtensils,
    "ac": FaSnowflake
  };

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/hotels");
        setHotels(res.data);
        setError(null);
      } catch (err) {
        console.error("Error loading hotels:", err);
        setError("Failed to load hotels. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  // Get unique locations
  const locations = [...new Set(hotels.map(hotel => hotel.location).filter(Boolean))];

  // Toggle favorite
  const toggleFavorite = (hotelId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(hotelId)) {
        newFavorites.delete(hotelId);
      } else {
        newFavorites.add(hotelId);
      }
      return newFavorites;
    });
  };

  // Filter hotels
  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hotel.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hotel.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = selectedLocation === "all" || hotel.location === selectedLocation;
    
    const matchesPrice = hotel.price >= priceRange[0] && hotel.price <= priceRange[1];
    
    return matchesSearch && matchesLocation && matchesPrice;
  });

  // Sort hotels
  const sortedHotels = [...filteredHotels].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
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

  // Render amenities
  const renderAmenities = (hotel) => {
    const amenities = hotel.amenities || [];
    return amenities.slice(0, 4).map((amenity, index) => {
      const AmenityIcon = amenitiesIcons[amenity.toLowerCase()] || FaBed;
      return (
        <div key={index} className="amenity-icon" title={amenity}>
          <AmenityIcon size={12} />
        </div>
      );
    });
  };

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading hotels...</p>
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
    <div className="all-hotels-page">
      {/* 🏨 Hero Section */}
      <section className="hotels-hero text-white text-center d-flex align-items-center justify-content-center position-relative overflow-hidden">
        <div 
          className="hero-bg position-absolute w-100 h-100"
          style={{
            backgroundImage: "url('https://cdn.wallpapersafari.com/77/30/ejxDH4.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
        </div>
        <div className="overlay position-absolute w-100 h-100"></div>
        <div className="container z-2 position-relative">
          <div className="animate-fade-in">
            <h1 className="fw-bold display-4 mb-3">Discover Luxury Stays</h1>
            <p className="lead mb-4">Experience unparalleled comfort in Sri Lanka's finest hotels</p>
            
            {/* Search in Hero */}
            <div className="row justify-content-center">
              <div className="col-lg-8 col-md-10">
                <div className="input-group input-group-lg shadow-lg">
                  <span className="input-group-text bg-white border-1 px-3">
                    <FaSearch className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-3 py-3"
                    placeholder="Search hotels, locations, or amenities..."
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
{/* ⭐ Most Rated Hotels Section */}
<div className="container my-5">
  <h2 className="fw-bold mb-4 text-center">
     Most Popular Hotels
  </h2>

  <div className="row g-4">
    {hotels
      .filter(h => h.rating) // must have rating
      .sort((a, b) => b.rating - a.rating) // highest first
      .slice(0, 4) // only top 4
      .map((hotel) => {
        const image = hotel.images?.length > 0
          ? `http://localhost:5000${hotel.images[0]}`
          : "/placeholder.jpg";

        return (
          <div key={hotel.id} className="col-xl-3 col-lg-4 col-md-6">
            <div className="hotel-card-modern h-100 position-relative">

              {/* Image */}
              <div className="card-image-modern position-relative overflow-hidden rounded-3">
                <img
                  src={image}
                  alt={hotel.name}
                  className="card-img-modern"
                  onError={handleImageError}
                />

                {/* Rating Badge */}
                <div className="position-absolute top-0 start-0 m-2">
                  <span className="badge bg-warning text-dark fw-bold">
                    ⭐ {hotel.rating}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="card-content-modern p-3">
                <h5 className="fw-bold">{hotel.name}</h5>
                <p className="text-muted small">
                  {hotel.location}
                </p>

                <p className="card-description-modern text-muted small mb-3">
                  {hotel.description?.slice(0, 80)}...
                </p>

                <Link
                  to={`/hotels/${hotel.id}`}
                  className="btn btn-view-details w-100"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        );
      })}
  </div>
</div>

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

        {/* Advanced Filters */}
        <div className="row mb-4">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Location</label>
            <select 
              className="form-select modern-select"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="all">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">
              Price Range: LKR {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}
            </label>
            <input 
              type="range" 
              className="form-range" 
              min="0" 
              max="50000" 
              step="1000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
            />
          </div>
        </div>

        {/* Controls Section */}
        <div className="row align-items-center mb-4">
          <div className="col-md-6">
            <h2 className="fw-bold mb-2">
              <FaBed className="me-2 text-primary" />
              {categories[activeCategory].name}
            </h2>
            <p className="text-muted mb-0">
              {sortedHotels.length} amazing hotel{sortedHotels.length !== 1 ? 's' : ''} to choose from
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
                  Found {sortedHotels.length} hotel{sortedHotels.length !== 1 ? 's' : ''} for "{searchTerm}"
                  {hotels.length !== sortedHotels.length && ` (filtered from ${hotels.length})`}
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
        {sortedHotels.length === 0 ? (
          <div className="text-center my-5 py-5">
            <div className="mb-4">
              <FaBed size={64} className="text-muted mb-4" />
              <h3 className="text-muted">No hotels found</h3>
              <p className="text-muted fs-5">
                {searchTerm ? `No results for "${searchTerm}". Try a different search term.` : 'No hotels available at the moment.'}
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
          /* Modern Hotels Grid */
          <div className="row g-4">
            {sortedHotels.map((hotel) => {
              const image = hotel.images?.length > 0
                ? `http://localhost:5000${hotel.images[0]}`
                : "/placeholder.jpg";

              return (
                <div key={hotel.id} className="col-xl-4 col-lg-6">
                  <div className="hotel-card-modern h-100 position-relative">
                    {/* Card Image with Overlay */}
                    <div className="card-image-modern position-relative overflow-hidden rounded-3">
                      <img
                        src={image}
                        alt={hotel.name}
                        className="card-img-modern"
                        onError={handleImageError}
                        loading="lazy"
                      />
                      
                      {/* Price Badge */}
                      <div className="position-absolute top-0 start-0 m-3">
                        <span className="badge price-badge">
                          LKR {hotel.price?.toLocaleString()}
                          <small className="ms-1">/night</small>
                        </span>
                      </div>
                      
                      {/* Favorite Button */}
                      <button 
                        className="btn-favorite-modern position-absolute top-0 end-0 m-3"
                        onClick={(e) => toggleFavorite(hotel.id, e)}
                      >
                        {favorites.has(hotel.id) ? 
                          <FaHeart className="text-danger" size={18} /> : 
                          <FaRegHeart className="text-white" size={18} />
                        }
                      </button>
                      
                      {/* Amenities Overlay */}
                      <div className="amenities-overlay position-absolute top-0 start-0 m-3 mt-5">
                        <div className="amenities-badge">
                          {renderAmenities(hotel)}
                        </div>
                      </div>
                      
                      {/* Location Info Overlay */}
                      <div className="card-overlay-modern position-absolute bottom-0 start-0 w-100 p-3">
                        <div className="text-white">
                          <span className="badge location-badge-modern mb-2">
                            <FaMapMarkerAlt className="me-1" size={10} />
                            {hotel.location}
                          </span>
                          <h6 className="fw-bold mb-1">{hotel.name}</h6>
                          <small className="opacity-75">
                            {hotel.Destination ? hotel.Destination.name : "Sri Lanka"}
                          </small>
                        </div>
                      </div>
                    </div>

                    {/* Card Content Below Image */}
                    <div className="card-content-modern p-3">
                      <p className="card-description-modern text-muted small mb-3">
                        {hotel.description?.slice(0, 100) || "Experience luxury and comfort in this beautiful hotel..."}...
                      </p>

                      {/* Rating and Destination */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="rating-modern">
                          {renderRating(hotel.rating)}
                        </div>
                        {hotel.Destination && (
                          <div className="destination-modern text-muted small">
                            <FaMapMarkerAlt className="me-1" size={12} />
                            {hotel.Destination.name}
                          </div>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="card-actions-modern d-flex gap-2">
                        <Link
                          to={`/hotels/${hotel.id}`}
                          className="btn btn-view-details flex-fill"
                        >
                          View Details
                        </Link>
                        <Link
                            to={`/public/book-hotel/${hotel.id}`}
                            className="btn btn-book-now flex-fill"
                          >
                            Book Now
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

      {/* Modern CSS Styles */}
      <style jsx>{`
        .all-hotels-page {
          font-family: 'Inter', sans-serif;
        }

        /* Hero Section */
        .hotels-hero {
          min-height: 60vh;
          position: relative;
        }
        
        .hero-bg {
          background-size: cover;
          background-position: center;
        }
        
        .overlay {
          background: linear-gradient(135deg, rgba(0, 106, 114, 0.01) 0%, rgba(0, 150, 135, 0.24) 100%);
        }
        
        .z-2 {
          z-index: 2;
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

        /* Modern Hotel Card */
        .hotel-card-modern {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 1px solid rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .hotel-card-modern:hover {
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

        .hotel-card-modern:hover .card-img-modern {
          transform: scale(1.05);
        }

        /* Badges */
        .price-badge {
          background: linear-gradient(135deg, #0003c8ff, #171addff);
          color: #fff;
          font-weight: 600;
          font-size: 0.75rem;
          padding: 6px 12px;
          border-radius: 20px;
          display: flex;
          align-items: center;
        }

        .location-badge-modern {
          background: rgba(0, 0, 0, 0.7);
          font-size: 0.7rem;
          padding: 4px 8px;
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        /* Amenities */
        .amenities-badge {
          background: rgba(255, 255, 255, 0.95);
          padding: 6px 10px;
          border-radius: 15px;
          backdrop-filter: blur(10px);
          display: flex;
          gap: 8px;
        }

        .amenity-icon {
          color: #666;
          transition: color 0.3s ease;
        }

        .amenity-icon:hover {
          color: #00796b;
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

        /* Action Buttons */
        .btn-view-details {
          background: #00796b;
          color: white;
          border: none;
          border-radius: 10px;
          padding: 10px 16px;
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.3s ease;
        }

        .btn-view-details:hover {
          background: #00564d;
          transform: translateY(-2px);
          color: white;
        }

        .btn-book-now {
          background: linear-gradient(135deg, #0300c8ff, #1735ddff);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 10px 16px;
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.3s ease;
        }

        .btn-book-now:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(0, 200, 83, 0.4);
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
          border-color: #00796b;
          box-shadow: 0 0 0 3px rgba(0, 121, 107, 0.1);
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
          .hotels-hero {
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
          
          .card-actions-modern {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default AllHotelsPage;