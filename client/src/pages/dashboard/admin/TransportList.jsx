import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSync } from "react-icons/fa";

function TransportList() {
  const [transports, setTransports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);

  const fetchTransports = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/transports");
      setTransports(res.data);
    } catch (err) {
      console.error("Error fetching transports:", err);
      alert("Failed to fetch transports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchTransports(); 
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transport?")) return;
    
    setDeleteLoading(id);
    try {
      await axios.delete(`http://localhost:5000/api/transports/${id}`);
      setTransports(transports.filter(t => t.id !== id));
    } catch (err) {
      console.error("Error deleting transport:", err);
      alert("Failed to delete transport");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Filter transports based on search term
  const filteredTransports = transports.filter(transport =>
    transport.vehicleType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transport.vehicle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transport.Provider?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transport.features?.some(feature => 
      feature.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>All Transports</h2>
        <Link to="/dashboard/admin/add-transport" className="btn btn-primary">
          <FaPlus className="me-1"/> Add Transport
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
              placeholder="Search by vehicle type, name, provider, or features..."
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
            onClick={fetchTransports} 
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
          Showing {filteredTransports.length} of {transports.length} transports
          {searchTerm && ` for "${searchTerm}"`}
        </small>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Vehicle Type</th>
              <th>Vehicle Name</th>
              <th>Seats</th>
              <th>Price/km</th>
              <th>Features</th>
              <th>Available</th>
              <th>Provider</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 mb-0">Loading transports...</p>
                </td>
              </tr>
            ) : filteredTransports.length > 0 ? (
              filteredTransports.map(t => (
                <tr key={t.id}>
                  <td className="fw-bold">{t.id}</td>
                  <td>
                    {t.images && t.images.length > 0 ? (
                      <img
                        src={`http://localhost:5000${t.images[0]}`}
                        alt={t.vehicleType}
                        style={{ 
                          height: "60px", 
                          width: "80px", 
                          objectFit: "cover",
                          borderRadius: "4px",
                          border: "2px solid #dee2e6"
                        }}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/80x60?text=No+Image";
                        }}
                      />
                    ) : (
                      <div 
                        style={{ 
                          height: "60px", 
                          width: "80px", 
                          backgroundColor: "#f8f9fa",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "4px",
                          border: "2px solid #dee2e6"
                        }}
                      >
                        <small className="text-muted">No image</small>
                      </div>
                    )}
                  </td>
                  <td className="fw-semibold">{t.vehicleType}</td>
                  <td>{t.vehicle}</td>
                  <td>
                    <span className="badge bg-info text-dark">{t.seats} seats</span>
                  </td>
                  <td className="fw-bold text-success">Rs. {t.pricePer1km}</td>
                  <td>
                    {t.features && t.features.length > 0 ? (
                      <div>
                        {t.features.slice(0, 2).map((feature, index) => (
                          <span key={index} className="badge bg-light text-dark me-1 mb-1">
                            {feature}
                          </span>
                        ))}
                        {t.features.length > 2 && (
                          <span className="badge bg-light text-dark">
                            +{t.features.length - 2} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted">No features</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${t.available ? 'bg-success' : 'bg-danger'}`}>
                      {t.available ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>
                    {t.Provider ? (
                      <div>
                        <div className="fw-semibold">{t.Provider.name}</div>
                        <small className="text-muted">{t.Provider.phone}</small>
                        {t.Provider.verified && (
                          <span className="badge bg-warning text-dark ms-1">Verified</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted">No provider</span>
                    )}
                  </td>
                  <td>
                    <div className="btn-group" role="group">
                      <Link
                        to={`/dashboard/admin/edit-transport/${t.id}`}
                        className="btn btn-sm btn-outline-primary me-1"
                        title="Edit transport"
                      >
                        <FaEdit />
                      </Link>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(t.id)}
                        disabled={deleteLoading === t.id}
                        title="Delete transport"
                      >
                        {deleteLoading === t.id ? (
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
                <td colSpan="10" className="text-center py-4">
                  {searchTerm ? (
                    <>
                      <p className="text-muted">No transports found for "{searchTerm}"</p>
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
                    <p className="text-muted">No transports found</p>
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
        
        .table {
          border: 2px solid #dee2e6;
        }
        
        .table th {
          border-bottom: 2px solid #0c1222ff;
          background: linear-gradient(45deg, #1b1b1bff, #070d1fff) !important;
        }
      `}</style>
    </div>
  );
}

export default TransportList;