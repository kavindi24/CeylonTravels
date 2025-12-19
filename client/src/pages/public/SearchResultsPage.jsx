import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaHotel,
  FaCar,
  FaMap,
  FaArrowRight} from "react-icons/fa";

function SearchResultsPage() {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = new URLSearchParams(location.search);
  const query = params.get("query")?.toLowerCase() || "";
  const category = params.get("category")?.toLowerCase() || "all";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      let urls = [];
      
      // Determine which endpoints to call based on category
      if (category === "all") {
        urls = [
          "http://localhost:5000/api/destinations",
          "http://localhost:5000/api/tour-packages",
          "http://localhost:5000/api/hotels",
          "http://localhost:5000/api/transports"
        ];
      } else {
        switch (category) {
          case "destinations":
            urls = ["http://localhost:5000/api/destinations"];
            break;
          case "tours":
            urls = ["http://localhost:5000/api/tour-packages"];
            break;
          case "hotels":
            urls = ["http://localhost:5000/api/hotels"];
            break;
          case "transport":
            urls = ["http://localhost:5000/api/transports"];
            break;
          default:
            urls = ["http://localhost:5000/api/destinations"];
        }
      }

      try {
        const responses = await Promise.all(
          urls.map(url => axios.get(url).catch(err => {
            console.error(`Error fetching from ${url}:`, err);
            return { data: [] };
          }))
        );

        // Combine all data
        let allData = responses.flatMap(response => response.data);

        // Filter results based on search query
        if (query) {
          allData = allData.filter((item) =>
            item.name?.toLowerCase().includes(query) ||
            item.title?.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query) ||
            item.location?.toLowerCase().includes(query) ||
            item.vehicleType?.toLowerCase().includes(query)
          );
        }

        setData(allData);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setError("Failed to load search results. Please try again.");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, category]);

  // Get category icon
  const getCategoryIcon = (item) => {
    if (item.vehicleType) return <FaCar className="text-info" />;
    if (item.pricePer1km) return <FaCar className="text-info" />;
    if (item.duration) return <FaMap className="text-warning" />;
    if (item.rating && item.price) return <FaHotel className="text-success" />;
    return <FaMapMarkerAlt className="text-primary" />;
  };

  // Get item type
  const getItemType = (item) => {
    if (item.vehicleType) return "Transport";
    if (item.duration) return "Tour";
    if (item.price && item.images) return "Hotel";
    return "Destination";
  };

  // Get item link
  const getItemLink = (item) => {
    if (item.vehicleType) return `/transport/${item.id}`;
    if (item.duration) return `/tour-package/${item.id}`;
    if (item.price && item.images) return `/hotels/${item.id}`;
    return `/destination/${item.id}`;
  };

  // Get item image
  const getItemImage = (item) => {
    if (item.img) return `http://localhost:5000${item.img}`;
    if (item.image) return `http://localhost:5000${item.image}`;
    if (item.images && item.images.length > 0) return `http://localhost:5000${item.images[0]}`;
    return "/placeholder.jpg";
  };



  // Handle image error
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/placeholder.jpg";
  };

  return (
    
    <div className="search-results-page">
                <hr></hr>
          <hr></hr>
          <hr></hr>
          <hr></hr>

      <div className="container mt-4">
        {/* Search Header */}
        <div className="search-header bg-light rounded-3 p-4 mb-4">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="fw-bold mb-2">Search Results</h1>
              <p className="text-muted mb-0">
                {query ? (
                  <>Showing results for <strong className="text-primary">"{query}"</strong></>
                ) : (
                  "Showing all items"
                )}
                {category !== "all" && (
                  <> in <strong className="text-primary">{category}</strong> category</>
                )}
              </p>
            </div>
            <div className="col-md-4 text-md-end">
              <div className="search-stats">
                <span className="badge bg-primary fs-6">
                  {data.length} {data.length === 1 ? 'result' : 'results'} found
                </span>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} />
            <p className="mt-3 fs-5">Searching for amazing experiences...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">
            {error}
          </div>
        ) : data.length > 0 ? (
          <div className="row g-4">
            {data.map((item) => (
              <div key={item.id} className="col-xl-4 col-lg-6">
                <div className="search-result-card h-100">
                  {/* Card Image */}
                  <div className="result-image-container position-relative overflow-hidden rounded-3">
                    <img
                      src={getItemImage(item)}
                      alt={item.name || item.title}
                      className="result-image"
                      onError={handleImageError}
                      loading="lazy"
                    />
                    
                    {/* Category Badge */}
                    <div className="category-badge position-absolute top-0 start-0 m-3">
                      <span className="badge bg-dark bg-opacity-75">
                        {getCategoryIcon(item)}
                        <span className="ms-2">{getItemType(item)}</span>
                      </span>
                    </div>

                    {/* Rating for hotels and destinations */}
                    {(item.rating && getItemType(item) !== "Transport") && (
                      <div className="rating-badge position-absolute top-0 end-0 m-3">
                        <span className="badge bg-warning text-dark">
                          ⭐ {item.rating}
                        </span>
                      </div>
                    )}

                    {/* Price for hotels and transport */}
                    {(item.price || item.pricePer1km) && (
                      <div className="price-badge position-absolute bottom-0 start-0 m-3">
                        <span className="badge bg-success">
                          {item.pricePer1km ? 
                            `LKR ${item.pricePer1km}/km` : 
                            `LKR ${item.price?.toLocaleString()}/night`
                          }
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="result-content p-4">
                    <h5 className="result-title fw-bold mb-2">
                      {item.name || item.title || item.vehicleType}
                    </h5>

                    {/* Location Info */}
                    {(item.location || item.province) && (
                      <div className="location-info d-flex align-items-center text-muted small mb-2">
                        <FaMapMarkerAlt className="me-2" size={12} />
                        {item.location || item.province}
                        {item.country && `, ${item.country}`}
                      </div>
                    )}

                    {/* Description */}
                    <p className="result-description text-muted small mb-3">
                      {item.description?.slice(0, 120)}...
                    </p>

                    {/* Additional Info */}
                    <div className="result-meta mb-3">
                      {item.duration && (
                        <div className="meta-item">
                          <strong>Duration:</strong> {item.duration}
                        </div>
                      )}
                      {item.seats && (
                        <div className="meta-item">
                          <strong>Seats:</strong> {item.seats}
                        </div>
                      )}
                      {item.bestFor && (
                        <div className="meta-item">
                          <strong>Best For:</strong> {item.bestFor}
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="result-actions">
                      <Link
                        to={getItemLink(item)}
                        className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                      >
                        View Details
                        <FaArrowRight className="ms-2" size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results text-center py-5">
            <div className="no-results-icon mb-4">
              <FaSearch size={64} className="text-muted" />
            </div>
            <h3 className="text-muted mb-3">No results found</h3>
            <p className="text-muted mb-4">
              We couldn't find any matches for "<strong>{query}</strong>"{category !== "all" && ` in ${category}`}.
            </p>
            <div className="suggestions">
              <p className="text-muted mb-3">Try these suggestions:</p>
              <div className="d-flex flex-wrap gap-2 justify-content-center">
                <Link to="/destinations" className="btn btn-outline-primary">
                  Browse Destinations
                </Link>
                <Link to="/tours" className="btn btn-outline-primary">
                  Explore Tours
                </Link>
                <Link to="/hotels" className="btn btn-outline-primary">
                  Find Hotels
                </Link>
                <Link to="/transport" className="btn btn-outline-primary">
                  View Transport
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .search-results-page {
          font-family: 'Inter', sans-serif;
          min-height: 70vh;
        }

        .search-header {
          border: 1px solid #e9ecef;
        }

        .search-result-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 1px solid rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .search-result-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
        }

        .result-image-container {
          height: 220px;
        }

        .result-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .search-result-card:hover .result-image {
          transform: scale(1.05);
        }

        .category-badge .badge {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 6px 12px;
          backdrop-filter: blur(10px);
        }

        .rating-badge .badge {
          font-weight: 600;
          padding: 6px 10px;
        }

        .price-badge .badge {
          font-weight: 600;
          padding: 6px 12px;
          font-size: 0.8rem;
        }

        .result-content {
          background: white;
        }

        .result-title {
          color: #2c3e50;
          font-size: 1.1rem;
          line-height: 1.3;
        }

        .result-description {
          line-height: 1.5;
          min-height: 40px;
        }

        .result-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          font-size: 0.8rem;
        }

        .meta-item {
          background: #f8f9fa;
          padding: 4px 8px;
          border-radius: 8px;
          color: #6c757d;
        }

        .no-results {
          background: #f8f9fa;
          border-radius: 20px;
          padding: 4rem 2rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #2196f3, #1976d2);
          border: none;
          border-radius: 10px;
          padding: 10px 16px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(33, 150, 243, 0.4);
        }

        .btn-outline-primary {
          border: 2px solid #1976d2;
          color: #1976d2;
          border-radius: 20px;
          padding: 8px 16px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-outline-primary:hover {
          background: #1976d2;
          color: white;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .result-image-container {
            height: 180px;
          }
          
          .search-header {
            text-align: center;
          }
          
          .search-stats {
            margin-top: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default SearchResultsPage;