import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSync } from "react-icons/fa";

function DestinationsList() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Fetch all destinations
  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/destinations");
      setDestinations(res.data);
    } catch (err) {
      console.error("Error fetching destinations:", err);
      alert("Failed to fetch destinations");
    } finally {
      setLoading(false);
    }
  };

  // Delete destination
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this destination?")) return;
    
    setDeleteLoading(id);
    try {
      await axios.delete(`http://localhost:5000/api/destinations/${id}`);
      setDestinations(destinations.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Error deleting destination:", err);
      alert("Failed to delete destination");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Filter destinations based on search term
  const filteredDestinations = destinations.filter(destination =>
    destination.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    destination.province?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    destination.bestFor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchDestinations();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>All Destinations</h2>
        <Link to="/dashboard/admin/add-destination" className="btn btn-primary">
          <FaPlus className="me-1" /> Add Destination
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
              placeholder="Search by name, province, or best for..."
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
            onClick={fetchDestinations} 
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
          Showing {filteredDestinations.length} of {destinations.length} destinations
          {searchTerm && ` for "${searchTerm}"`}
        </small>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover text-black">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Best For</th>
              <th>Province</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 mb-0">Loading destinations...</p>
                </td>
              </tr>
            ) : filteredDestinations.length > 0 ? (
              filteredDestinations.map((d) => (
                <tr key={d.id}>
                  <td className="fw-bold">{d.id}</td>
                  <td>
                    {d.img ? (
                      <img
                        src={`http://localhost:5000${d.img}`}
                        alt={d.name}
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
                  <td className="fw-semibold">{d.name}</td>
                  <td>
                    {d.description?.length > 50 
                      ? `${d.description.slice(0, 50)}...` 
                      : d.description || "No description"}
                  </td>
                  <td>
                    <span className="badge bg-info text-dark">{d.bestFor}</span>
                  </td>
                  <td>
                    <span className="badge bg-secondary">{d.province}</span>
                  </td>
                  <td>
                    <div className="btn-group" role="group">
                      <Link
                        to={`/dashboard/admin/edit-destination/${d.id}`}
                        className="btn btn-sm btn-outline-primary"
                        title="Edit destination"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="btn btn-sm btn-outline-danger"
                        disabled={deleteLoading === d.id}
                        title="Delete destination"
                      >
                        {deleteLoading === d.id ? (
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
                <td colSpan="7" className="text-center py-4">
                  {searchTerm ? (
                    <>
                      <p className="text-muted">No destinations found for "{searchTerm}"</p>
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
                    <p className="text-muted">No destinations found</p>
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
        
        /* Custom focus styles for better accessibility */
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

export default DestinationsList;