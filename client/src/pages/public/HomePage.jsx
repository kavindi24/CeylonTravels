// src/pages/public/HomePage.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  FaSearch, FaArrowRight, FaChevronLeft, FaChevronRight,
  FaUmbrellaBeach, FaMountain, FaTree, FaLandmark,
  FaCrown, FaComments, FaMapMarkerAlt
} from "react-icons/fa";
import axios from "axios";

function HomePage() {
  const heroRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hotels, setHotels] = useState([]);

  const navigate = useNavigate();

  // Slider Data
  const sliderData = [
    {
      id: 1,
      title: "Cultural Heritage Tours",
      image: "https://overatours.com/wp-content/uploads/2017/11/73-1024x683.jpg",
      cta: "Discover Culture",
      link: "/tours?category=cultural",
      icon: <FaLandmark className="me-2" />
    },
    {
      id: 2,
      title: "Beach & Coastal Getaways",
      image: "https://w0.peakpx.com/wallpaper/625/712/HD-wallpaper-beach-srilanka.jpg",
      cta: "Explore Beaches",
      link: "/tours?category=beach",
      icon: <FaUmbrellaBeach className="me-2" />
    },
    {
      id: 3,
      title: "Wildlife & Nature Adventures",
      image: "https://www.trodly.com/blog/wp-content/uploads/2025/05/sri-lanka-national-parks.jpg",
      cta: "Wildlife Tours",
      link: "/tours?category=wildlife",
      icon: <FaTree className="me-2" />
    },
    {
      id: 4,
      title: "Mountain & Hill Country",
      image: "https://www.holidify.com/images/cmsuploads/compressed/shutterstock_562419604_20191120103528.png",
      cta: "Mountain Tours",
      link: "/tours?category=mountain",
      icon: <FaMountain className="me-2" />
    },
    {
      id: 5,
      title: "Luxury & Wellness Retreats",
      image: "https://www.srilankainstyle.com/storage/app/media/blog/top-10-sri-lanka-wellness-retreats/top-10-sri-lanka-wellness-retreats-slider-8.jpg",
      cta: "Luxury Stays",
      link: "/tours?category=luxury",
      icon: <FaCrown className="me-2" />
    }
  ];

  // Auto slider
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === Math.ceil(sliderData.length / 3) - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [sliderData.length]);

  // Fetch destinations
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/destinations");
        setDestinations(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch destinations.");
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/hotels");
        setHotels(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch hotels.");
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  // Search functionality - FIXED
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page with query parameters
      navigate(`/search?query=${encodeURIComponent(searchQuery)}&category=${searchCategory}`);
    } else {
      // If no search query, navigate to all listings of selected category
      if (searchCategory === "all") {
        navigate("/destinations");
      } else {
        navigate(`/${searchCategory}`);
      }
    }
  };

  const goToSlide = (index) => setCurrentSlide(index);
  const goToNextSlide = () => setCurrentSlide((prev) => (prev === Math.ceil(sliderData.length / 3) - 1 ? 0 : prev + 1));
  const goToPrevSlide = () => setCurrentSlide((prev) => (prev === 0 ? Math.ceil(sliderData.length / 3) - 1 : prev - 1));

  const getVisibleCards = () => {
    const startIndex = currentSlide * 3;
    return [
      sliderData[startIndex % sliderData.length],
      sliderData[(startIndex + 1) % sliderData.length],
      sliderData[(startIndex + 2) % sliderData.length],
    ];
  };
  const visibleCards = getVisibleCards();

  const handleChatbotClick = () => navigate("/chatbot");

  const featuredDestinations = destinations
    .filter(dest => dest.featured || dest.rating >= 4.5)
    .slice(0, 4);

  const handleImageError = (e) => e.target.src = "/placeholder.jpg";

  if (loading) return (
    <div className="container my-5 text-center">
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-2">Loading destinations...</p>
    </div>
  );

  if (error) return (
    <div className="container my-5">
      <div className="alert alert-danger text-center">{error}</div>
    </div>
  );

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section
        className="hero text-white d-flex align-items-center position-relative overflow-hidden"
        style={{ minHeight: "90vh" }}
      >
        <div
          ref={heroRef}
          className="hero-background position-absolute w-100 h-100"
          style={{
            backgroundImage: `url('https://s1.1zoom.me/b4638/664/Norway_Mountains_Rivers_Houses_Scenery_523891_1920x1080.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: -2,
          }}
        ></div>
        <div
          className="overlay position-absolute w-100 h-100"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.4))",
            zIndex: -1,
          }}
        ></div>

        <div className="container position-relative z-1 mt-5 pt-5">
          <div className="row">
            <div className="col-lg-7">
              <h1 className="display-3 fw-bold mb-4 animate__animated animate__fadeInDown">
                Discover the Magic of Sri Lanka
              </h1>
              <p className="lead mb-5 fs-4 animate__animated animate__fadeIn animate__delay-1s">
                Experience unforgettable journeys with curated tours, luxury
                stays, and authentic cultural experiences
              </p>

              {/* Search Bar - FIXED WITH BLACK TEXT */}
              <div className="search-container bg-white rounded-pill shadow-lg p-2 animate__animated animate__fadeInUp animate__delay-2s">
                <form
                  onSubmit={handleSearch}
                  className="d-flex align-items-center"
                >
                  <div className="flex-grow-1 ps-3">
                    <input
                      type="text"
                      className="form-control border-0 shadow-none text-dark" 
                      placeholder="Search destinations, tours, or experiences..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ color: '#000000' }} 
                    />
                  </div>
                  <div className="me-2">
                    <select
                      className="form-select border-0 bg-transparent text-dark" 
                      value={searchCategory}
                      onChange={(e) => setSearchCategory(e.target.value)}
                      style={{ color: '#000000' }} 
                    >
                      <option value="all">All Categories</option>
                      <option value="destinations">Destinations</option>
                      <option value="tours">Tours</option>
                      <option value="hotels">Hotels</option>
                      <option value="transport">Transport</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4"
                  >
                    <FaSearch className="me-2" /> Search
                  </button>
                </form>
              </div>
            </div>

            {/* Slider */}
            <div className="col-lg-5">
              <div className="advanced-slider-container position-relative">
                <div className="slider-wrapper">
                  <div
                    className="slider-track"
                    style={{
                      transform: `translateX(-${currentSlide * (100 / 2)}%)`,
                    }}
                  >
                    {visibleCards.map((card, index) => (
                      <div
                        key={`${card.id}-${index}`}
                        className="slider-card"
                      >
                        <div className="card h-100 border-0 overflow-hidden modern-glass-card">
                          <div
                            className="card-img-top modern-card-image"
                            style={{
                              backgroundImage: `url(${card.image})`,
                            }}
                          ></div>
                          <div className="card-body">
                            <h6 className="card-title">{card.icon} {card.title}</h6>
                          </div>
                          <div className="card-footer bg-transparent border-0">
                            <Link
                              to={card.link}
                              className="btn btn-sm btn-primary rounded-pill modern-card-btn"
                            >
                              {card.cta}{" "}
                              <FaArrowRight className="ms-2" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Controls */}
                <div className="slider-controls">
                  <button className="slider-nav" onClick={goToPrevSlide}>
                    <FaChevronLeft />
                  </button>
                  <button className="slider-nav" onClick={goToNextSlide}>
                    <FaChevronRight />
                  </button>
                </div>

                {/* Indicators */}
                <div className="slider-indicators position-absolute start-0 end-0 bottom-0 mb-2 d-flex justify-content-center">
                  {Array.from({ length: Math.ceil(sliderData.length / 3) }).map(
                    (_, index) => (
                      <button
                        key={index}
                        className={`indicator bg-white border-0 rounded-circle mx-1 ${
                          index === currentSlide ? "active" : ""
                        }`}
                        style={{
                          width: "12px",
                          height: "12px",
                          opacity: index === currentSlide ? 1 : 0.5,
                        }}
                        onClick={() => goToSlide(index)}
                      ></button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the page remains unchanged */}
      {/* Popular Destinations Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">Popular Destinations</h2>
            <Link to="listings/destinations" className="btn btn-outline-primary rounded-pill">
              View All Destinations <FaArrowRight className="ms-1" />
            </Link>
          </div>
          
          <div className="row g-4">
            {featuredDestinations.map((dest, index) => {
              const imgSrc = dest.img
                ? `http://localhost:5000${dest.img}`
                : "/placeholder.jpg";
              return (
                <div className="col-md-6 col-lg-3" key={dest.id}>
                  <div className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden modern-destination-card">
                    <div className="card-image-container position-relative">
                      <img 
                        src={imgSrc} 
                        className="card-img-top" 
                        alt={dest.name}
                        style={{height: '200px', objectFit: 'cover'}}
                      />
                      <div className="card-overlay position-absolute top-0 start-0 w-100 h-100" 
                           style={{background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 60%)'}}></div>
                      <div className="position-absolute bottom-0 start-0 m-3 text-white">
                        <span className="badge bg-primary mb-1">{dest.bestFor}</span>
                        <h6 className="fw-bold mb-0">{dest.name}</h6>
                        <small className="d-block">{dest.province}</small>
                      </div>
                    </div>
                    
                    <div className="card-body">
                      <p className="card-text small text-muted">{dest.description}</p>
                    </div>
                    
                    <div className="card-footer bg-transparent border-0 pt-0">
                      <Link 
                        to={`/destination/${dest.id}`} 
                        className="btn btn-sm btn-outline-primary rounded-pill stretched-link"
                      >
                        Explore <FaArrowRight className="ms-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Most Popular Hotels Section */}
      <div className="most-popular-hotels my-5 py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">Most Popular Hotels</h2>
            <Link to="listings/hotels" className="btn btn-outline-primary rounded-pill">
              View All Hotels <FaArrowRight className="ms-1" />
            </Link>
          </div>  
          <div className="row g-4">
            {hotels
              .filter(h => h.rating)
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 4)
              .map((hotel) => {
                const image = hotel.images?.length > 0
                  ? `http://localhost:5000${hotel.images[0]}`
                  : "/placeholder.jpg";

                return (
                  <div key={hotel.id} className="col-xl-3 col-lg-6">
                    <div className="popular-hotel-card h-100">
                      <div className="hotel-image-container position-relative overflow-hidden">
                        <img
                          src={image}
                          alt={hotel.name}
                          className="hotel-image"
                          onError={handleImageError}
                          loading="lazy"
                        />
                        <div className="rating-badge position-absolute top-0 end-0 m-3">
                          <span className="rating-stars">
                            ⭐ {hotel.rating}
                          </span>
                        </div>
                        <div className="price-badge position-absolute bottom-0 start-0 m-3">
                          <span className="price-text">
                            LKR {hotel.price?.toLocaleString()}/night
                          </span>
                        </div>
                        <div className="image-overlay position-absolute top-0 start-0 w-100 h-100"></div>
                      </div>

                      <div className="hotel-content p-4">
                        <div className="hotel-header mb-3">
                          <h5 className="hotel-name fw-bold mb-2">{hotel.name}</h5>
                          <div className="hotel-location d-flex align-items-center text-muted small">
                            <FaMapMarkerAlt className="me-2" size={12} />
                            {hotel.location}
                          </div>
                        </div>

                        <p className="hotel-description text-muted small mb-3">
                          {hotel.description?.slice(0, 80)}...
                        </p>

                        <div className="hotel-features mb-3">
                          <div className="d-flex flex-wrap gap-2">
                            {hotel.amenities?.slice(0, 3).map((amenity, index) => (
                              <span key={index} className="feature-tag">
                                {amenity}
                              </span>
                            ))}
                            {hotel.amenities?.length > 3 && (
                              <span className="feature-tag">+{hotel.amenities.length - 3}</span>
                            )}
                          </div>
                        </div>

                        <div className="hotel-actions d-flex gap-2">
                          <Link 
                            to={`/hotels/${hotel.id}`} 
                            className="btn btn-view-details flex-fill"
                          >
                            View Details
                          </Link>
                          <Link 
                            to={`/booking/${hotel.id}`} 
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
        </div>
      </div>

      {/* Promotional Banners Section */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="promo-banner position-relative rounded-4 overflow-hidden shadow-lg">
                <img 
                  src="https://rocksidebeachresorts.com/wp-content/uploads/2019/12/inner-banner_09-scaled.jpg" 
                  alt="Explore All Destinations"
                  className="img-fluid w-100"
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <div className="banner-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center p-4 text-white"
                  style={{ background: "linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3))" }}
                >
                  <h3 className="fw-bold">Explore All Destinations</h3>
                  <p className="mb-3">Discover the most beautiful places in Sri Lanka</p>
                  <Link 
                    to="listings/destinations" 
                    className="btn btn-primary rounded-pill align-self-start"
                  >
                    Browse Destinations
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="promo-banner position-relative rounded-4 overflow-hidden shadow-lg">
                <img 
                  src="https://www.taxi.lk/operation/images/inependent/6/thumbnail.jpg" 
                  alt="Find Your Perfect Tour"
                  className="img-fluid w-100"
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <div className="banner-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center p-4 text-white"
                  style={{ background: "linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3))" }}
                >
                  <h3 className="fw-bold">Find Your Perfect Tour</h3>
                  <p className="mb-3">Curated experiences for every type of traveler</p>
                  <Link 
                    to="listings/tours" 
                    className="btn btn-primary rounded-pill align-self-start"
                  >
                    View All Tours
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="promo-banner position-relative rounded-4 overflow-hidden shadow-lg">
                <img 
                  src="https://besttimetovisitsrilanka.com/wp-content/uploads/2021/01/Ultimate-Sri-Lanka-Tours.jpg" 
                  alt="Find Your Perfect Transport"
                  className="img-fluid w-100"
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <div 
                  className="banner-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center p-4 text-white"
                  style={{ background: "linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3))" }}
                >
                  <h3 className="fw-bold">Find Your Perfect Transport</h3>
                  <p className="mb-3">Comfortable rides to match your journey</p>
                  <Link 
                    to="listings/transport" 
                    className="btn btn-primary rounded-pill align-self-start"
                  >
                    View All Transport
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="promo-banner position-relative rounded-4 overflow-hidden shadow-lg">
                <img 
                  src="https://cdn.prod.website-files.com/64d618bb0ccc37b64e1d6053/67f0e8aab53da794251b9ec4_6718b6820112355ec0cc585c_Property%20-%20Colombo%201.jpg" 
                  alt="Find Your Perfect Hotel"
                  className="img-fluid w-100"
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <div 
                  className="banner-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center p-4 text-white"
                  style={{ background: "linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3))" }}
                >
                  <h3 className="fw-bold">Find Your Perfect Hotel</h3>
                  <p className="mb-3">Stay in comfort wherever you travel</p>
                  <Link 
                    to="listings/hotels" 
                    className="btn btn-primary rounded-pill align-self-start"
                  >
                    View All Hotels
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot Widget */}
      <div className="chatbot-widget position-fixed bottom-0 end-0 me-4 mb-4">
        <button 
          className="btn btn-primary rounded-circle p-3 shadow-lg d-flex align-items-center justify-content-center"
          style={{ width: "60px", height: "60px" }}
          onClick={handleChatbotClick}
          title="Chat with our travel assistant"
        >
          <FaComments size={24} />
        </button>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .advanced-slider-container {
          position: relative;
          padding: 20px 0;
        }
        
        .slider-wrapper {
          overflow: hidden;
          height: 350px;
          border-radius: 20px;
        }
        
        .slider-track {
          display: flex;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .slider-card {
          flex: 0 0 calc(100% / 2);
          padding: 15px;
          transition: all 0.5s ease;
        }
        
        .modern-glass-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
          transition: all 0.4s ease;
          overflow: hidden;
          color: white;
        }
        
        .modern-glass-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.25);
          background: rgba(255, 255, 255, 0.2);
        }
        
        .modern-card-image {
          height: 180px;
          background-size: cover;
          background-position: center;
          transition: all 0.6s ease;
          position: relative;
          overflow: hidden;
        }
        
        .modern-glass-card:hover .modern-card-image {
          transform: scale(1.08);
        }
        
        .modern-card-image::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 50%;
          background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        
        .modern-glass-card:hover .modern-card-image::after {
          opacity: 1;
        }
        
        .modern-card-btn {
          transition: all 0.4s ease;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .modern-card-btn:hover {
          transform: translateX(5px);
          background: rgba(255, 255, 255, 0.3);
        }
        
        .slider-controls {
          position: absolute;
          top: 50%;
          width: 100%;
          display: flex;
          justify-content: space-between;
          transform: translateY(-50%);
          z-index: 10;
          padding: 0 10px;
        }
        
        .slider-nav {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .slider-nav:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }
        
        .slider-indicators {
          z-index: 10;
        }
        
        .indicator {
          transition: all 0.3s ease;
        }
        
        .indicator.active {
          transform: scale(1.3);
          background: rgba(255, 255, 255, 1) !important;
        }
        
        .promo-banner:hover {
          transform: translateY(-5px);
          transition: transform 0.3s ease;
        }
        
        .chatbot-widget {
          z-index: 1000;
        }
        
        .chatbot-widget button:hover {
          transform: scale(1.1);
          transition: transform 0.3s ease;
        }
        
        .modern-destination-card {
          border: none !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        .modern-destination-card:hover {
          transform: translateY(-8px) scale(1.02) !important;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15) !important;
        }
        
        .card-image-container {
          overflow: hidden;
        }
        
        .card-image-container img {
          transition: transform 0.5s ease;
        }
        
        .modern-destination-card:hover .card-image-container img {
          transform: scale(1.1);
        }
        
        .card-overlay {
          opacity: 0.7;
          transition: opacity 0.3s ease;
        }
        
        .modern-destination-card:hover .card-overlay {
          opacity: 0.9;
        }
        
        .tour-card {
          transition: all 0.3s ease;
        }
        
        .tour-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 20px rgba(0,0,0,0.15);
        }
        
        .most-popular-hotels {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
        }

        .popular-hotel-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .popular-hotel-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }

        .hotel-image-container {
          height: 220px;
        }

        .hotel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .popular-hotel-card:hover .hotel-image {
          transform: scale(1.1);
        }

        .image-overlay {
          background: linear-gradient(to top, rgba(0, 0, 0, 0.3) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .popular-hotel-card:hover .image-overlay {
          opacity: 1;
        }

        .rating-badge {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: #000;
          padding: 8px 12px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 0.85rem;
          box-shadow: 0 4px 15px rgba(255, 165, 0, 0.3);
        }

        .price-badge {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 8px 12px;
          border-radius: 15px;
          font-weight: 600;
          font-size: 0.8rem;
          color: #2c3e50;
        }

        .hotel-content {
          background: white;
        }

        .hotel-name {
          color: #2c3e50;
          font-size: 1.1rem;
          line-height: 1.3;
        }

        .hotel-description {
          line-height: 1.5;
          min-height: 40px;
        }

        .feature-tag {
          background: #e3f2fd;
          color: #1976d2;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .btn-view-details {
          background: #1976d2;
          color: white;
          border: none;
          border-radius: 10px;
          padding: 10px 16px;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          text-decoration: none;
          text-align: center;
        }

        .btn-view-details:hover {
          background: #1565c0;
          transform: translateY(-2px);
          color: white;
        }

        .btn-book-now {
          background: linear-gradient(135deg, #4caf50, #388e3c);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 10px 16px;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          text-decoration: none;
          text-align: center;
        }

        .btn-book-now:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(76, 175, 80, 0.4);
          color: white;
        }

        .btn-outline-primary {
          border: 2px solid #1976d2;
          color: #1976d2;
          border-radius: 25px;
          padding: 12px 30px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-outline-primary:hover {
          background: #1976d2;
          color: white;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .hotel-image-container {
            height: 180px;
          }
          
          .hotel-actions {
            flex-direction: column;
          }
          
          .section-header h2 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}

export default HomePage;