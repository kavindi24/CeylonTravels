import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSync } from "react-icons/fa";

function HotelsList() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const navigate = useNavigate();

  // Fetch all hotels
  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/hotels");
      setHotels(res.data);
    } catch (err) {
      console.error("Error fetching hotels:", err);
      alert("Failed to fetch hotels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  // Delete hotel
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;
    
    setDeleteLoading(id);
    try {
      await axios.delete(`http://localhost:5000/api/hotels/${id}`);
      setHotels(hotels.filter((h) => h.id !== id));
    } catch (err) {
      console.error("Error deleting hotel:", err);
      alert("Failed to delete hotel");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Filter hotels based on search term
  const filteredHotels = hotels.filter(hotel =>
    hotel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.amenities?.some(amenity => 
      amenity.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>All Hotels</h2>
        <Link to="/dashboard/admin/add-hotel" className="btn btn-primary">
          <FaPlus className="me-1" /> Add Hotel
        </Link>
      </div>

      {/* Search and Refresh Section */}
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text" style={{
              backgroundColor: "#f8f9fa",
              border: "2px solid #4e73df",
              borderRight: "none",
              color: "#4e73df"
            }}>
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, location, description, or amenities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: "2px solid #4e73df",
                borderLeft: "none",
                color: "#2e4a99",
                backgroundColor: "#fff"
              }}
            />
          </div>
        </div>
        <div className="col-md-6 text-end">
          <button 
            onClick={fetchHotels} 
            className="btn btn-outline-secondary"
            disabled={loading}
            style={{
              border: "2px solid #6c757d",
              color: "#6c757d"
            }}
          >
            <FaSync className={loading ? "spinning" : ""} /> 
            {loading ? " Loading..." : " Refresh"}
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-2">
        <small className="text-muted">
          Showing {filteredHotels.length} of {hotels.length} hotels
          {searchTerm && ` for "${searchTerm}"`}
        </small>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Location</th>
              <th>Description</th>
              <th>Price</th>
              <th>Amenities</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 mb-0">Loading hotels...</p>
                </td>
              </tr>
            ) : filteredHotels.length > 0 ? (
              filteredHotels.map((hotel) => (
                <tr key={hotel.id}>
                  <td className="fw-bold">{hotel.id}</td>
                  <td>
                    {hotel.images && hotel.images.length > 0 ? (
                      <img
                        src={hotel.images[0]}
                        alt={hotel.name}
                        style={{ 
                          width: "80px", 
                          height: "50px", 
                          objectFit: "cover",
                          borderRadius: "4px"
                        }}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/80x50?text=No+Image";
                        }}
                      />
                    ) : (
                      <div 
                        style={{ 
                          width: "80px", 
                          height: "50px", 
                          backgroundColor: "#f8f9fa",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "4px"
                        }}
                      >
                        <small className="text-muted">No image</small>
                      </div>
                    )}
                  </td>
                  <td className="fw-semibold">{hotel.name}</td>
                  <td>
                    <span className="badge bg-secondary">{hotel.location}</span>
                  </td>
                  <td>
                    {hotel.description?.length > 50 
                      ? `${hotel.description.slice(0, 50)}...` 
                      : hotel.description || "No description"}
                  </td>
                  <td className="fw-bold text-success">Rs. {hotel.price}</td>
                  <td>
                    {hotel.amenities && hotel.amenities.length > 0 ? (
                      <div>
                        {hotel.amenities.slice(0, 2).map((amenity, index) => (
                          <span key={index} className="badge bg-light text-dark me-1 mb-1">
                            {amenity}
                          </span>
                        ))}
                        {hotel.amenities.length > 2 && (
                          <span className="badge bg-light text-dark">
                            +{hotel.amenities.length - 2} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted">No amenities</span>
                    )}
                  </td>
                  <td>
                    {hotel.rating ? (
                      <span className="badge bg-warning text-dark">
                        ⭐ {hotel.rating}
                      </span>
                    ) : (
                      <span className="text-muted">N/A</span>
                    )}
                  </td>
                  <td>
                    <div className="btn-group" role="group">
                      <Link
                        to={`/dashboard/admin/edit-hotel/${hotel.id}`}
                        className="btn btn-sm btn-outline-primary me-1"
                        title="Edit hotel"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(hotel.id)}
                        className="btn btn-sm btn-outline-danger"
                        disabled={deleteLoading === hotel.id}
                        title="Delete hotel"
                      >
                        {deleteLoading === hotel.id ? (
                          <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Deleting...</span>
                          </div>
                        ) : (
                          <FaTrash />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  {searchTerm ? (
                    <>
                      <p className="text-muted">No hotels found for "{searchTerm}"</p>
                      <button 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => setSearchTerm("")}
                        style={{
                          border: "2px solid #6c757d",
                          color: "#6c757d"
                        }}
                      >
                        Clear search
                      </button>
                    </>
                  ) : (
                    <p className="text-muted">No hotels found</p>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .spinning {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .form-control:focus {
          border-color: #4e73df !important;
          box-shadow: 0 0 0 0.2rem rgba(78, 115, 223, 0.25);
          outline: none;
        }
        
        .btn-outline-secondary:focus {
          box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.25);
        }
      `}</style>
    </div>
  );
}

export default HotelsList;