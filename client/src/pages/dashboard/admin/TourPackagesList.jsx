import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSync } from "react-icons/fa";

function TourPackagesList() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Fetch all tour packages
  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/tour-packages");
      setPackages(res.data);
    } catch (err) {
      console.error("Error fetching tour packages:", err);
      alert("Failed to fetch tour packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Delete package
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tour package?")) return;
    
    setDeleteLoading(id);
    try {
      await axios.delete(`http://localhost:5000/api/tour-packages/${id}`);
      setPackages(packages.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting tour package:", err);
      alert("Failed to delete tour package");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Filter packages based on search term
  const filteredPackages = packages.filter(pkg =>
    pkg.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>All Tour Packages</h2>
        <Link to="/dashboard/admin/add-tour-package" className="btn btn-primary">
          <FaPlus className="me-1" /> Add Package
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
              placeholder="Search by title, category, or description..."
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
            onClick={fetchPackages} 
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
          Showing {filteredPackages.length} of {packages.length} tour packages
          {searchTerm && ` for "${searchTerm}"`}
        </small>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Location</th>
              <th>Price</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 mb-0">Loading tour packages...</p>
                </td>
              </tr>
            ) : filteredPackages.length > 0 ? (
              filteredPackages.map((p) => (
                <tr key={p.id}>
                  <td className="fw-bold">{p.id}</td>
                  <td>
                    {p.image ? (
                      <img
                        src={`http://localhost:5000${p.image}`}
                        alt={p.title}
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
                  <td className="fw-semibold">{p.title}</td>
                  <td>
                    <span className="badge bg-info text-dark">{p.category}</span>
                  </td>
                  <td>
                    {p.location?.length > 50 
                      ? `${p.location.slice(0, 50)}...` 
                      : p.location || "No location"}
                  </td>
                  <td className="fw-bold text-success">Rs. {p.price}</td>
                  <td>
                    {p.duration ? (
                      <span className="badge bg-secondary">{p.duration}</span>
                    ) : (
                      <span className="text-muted">N/A</span>
                    )}
                  </td>
                  <td>
                    <div className="btn-group" role="group">
                      <Link
                        to={`/dashboard/admin/edit-tour-package/${p.id}`}
                        className="btn btn-sm btn-outline-primary me-1"
                        title="Edit package"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="btn btn-sm btn-outline-danger"
                        disabled={deleteLoading === p.id}
                        title="Delete package"
                      >
                        {deleteLoading === p.id ? (
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
                <td colSpan="8" className="text-center py-4">
                  {searchTerm ? (
                    <>
                      <p className="text-muted">No tour packages found for "{searchTerm}"</p>
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
                    <p className="text-muted">No tour packages found</p>
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

export default TourPackagesList;