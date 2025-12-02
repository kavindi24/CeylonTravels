import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FaSave, 
  FaCar, 
  FaUserTie, 
  FaUpload, 
  FaArrowLeft,
  FaUsers,
  FaCog,
  FaDollarSign,
  FaStar,
  FaCheck,
  FaPhone,
  FaEnvelope,
  FaCalendar,
  FaTrash,
} from "react-icons/fa";

function EditTransport() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [transport, setTransport] = useState({
    vehicleType: "",
    seats: "",
    features: "",
    pricePer1km: "",
    available: true,
    vehicle: "",
    description: "",
    images: [],
  });

  const [provider, setProvider] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    rating: "",
    completedTrips: "",
    since: "",
    verified: false,
  });

  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const vehicleTypes = [
    "Car", "Van", "SUV", "Bus", "Mini Van", "Luxury Car"
  ];

  const seatOptions = [
    "2", "4", "5", "7", "8", "12", "15", "20", "25", "30+"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);
        const res = await axios.get(`http://localhost:5000/api/transports/${id}`);
        const data = res.data;

        setTransport({
          vehicleType: data.vehicleType || "",
          seats: data.seats || "",
          features: data.features ? data.features.join(", ") : "",
          pricePer1km: data.pricePer1km || "",
          available: data.available !== undefined ? data.available : true,
          vehicle: data.vehicle || "",
          description: data.description || "",
          images: data.images || [],
        });

        setProvider({
          id: data.Provider?.id || "",
          name: data.Provider?.name || "",
          email: data.Provider?.email || "",
          phone: data.Provider?.phone || "",
          rating: data.Provider?.rating || "",
          completedTrips: data.Provider?.completedTrips || "",
          since: data.Provider?.since || "",
          verified: data.Provider?.verified || false,
        });

        // Set existing image previews
        if (data.images && data.images.length > 0) {
          setImagePreviews(data.images.map(img => `http://localhost:5000${img}`));
        }

      } catch (err) {
        console.error(err);
        alert("Failed to fetch transport data");
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [id]);

  const handleTransport = (e) => {
    const { name, value, type, checked } = e.target;
    setTransport({ 
      ...transport, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleProvider = (e) => {
    const { name, value, type, checked } = e.target;
    setProvider({ 
      ...provider, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    
    // Create previews for new files
    const newPreviews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === files.length) {
          setImagePreviews([...imagePreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    const updatedImages = transport.images.filter((_, i) => i !== index);
    
    setImagePreviews(updatedPreviews);
    setTransport({ ...transport, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // Append new images if uploaded
      newImages.forEach((img) => formData.append("images", img));

      // Transport fields
      formData.append("vehicleType", transport.vehicleType);
      formData.append("seats", transport.seats);
      formData.append("features", transport.features);
      formData.append("pricePer1km", transport.pricePer1km);
      formData.append("available", transport.available);
      formData.append("vehicle", transport.vehicle);
      formData.append("description", transport.description);

      // Provider fields
      formData.append("providerName", provider.name);
      formData.append("providerEmail", provider.email);
      formData.append("providerPhone", provider.phone);
      formData.append("providerRating", provider.rating || 0);
      formData.append("providerCompletedTrips", provider.completedTrips || 0);
      formData.append("providerSince", provider.since || new Date().getFullYear());
      formData.append("providerVerified", provider.verified);

      await axios.put(`http://localhost:5000/api/transports/full-update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Transport + Provider updated successfully!");
      navigate("/dashboard/admin/transports");
    } catch (err) {
      console.error(err);
      alert("Failed to update transport");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card border shadow-sm">
              <div className="card-body text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-dark">Loading transport data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Header */}
          <div className="card border shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <div className="bg-primary rounded-circle p-3 me-3 border">
                    <FaCar className="text-white fs-4" />
                  </div>
                  <div>
                    <h2 className="fw-bold text-dark mb-1">Edit Transport Service</h2>
                    <p className="text-muted mb-0">Update vehicle and provider information</p>
                  </div>
                </div>
                <button 
                  className="btn btn-outline-secondary border"
                  onClick={() => navigate("/dashboard/admin/transports")}
                >
                  <FaArrowLeft className="me-2" />
                  Back to Transports
                </button>
              </div>
            </div>
          </div>

          <div className="card shadow-sm border">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                {/* Transport Details Section */}
                <div className="mb-5 pb-4 border-bottom">
                  <h5 className="fw-semibold text-dark mb-3 border-bottom pb-2">
                    Vehicle Details
                  </h5>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium text-dark">Vehicle Type *</label>
                      <select 
                        name="vehicleType"
                        className="form-select text-dark border"
                        value={transport.vehicleType}
                        onChange={handleTransport}
                        required
                      >
                        <option value="">Select Vehicle Type</option>
                        {vehicleTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium text-dark">Vehicle Name/Model *</label>
                      <div className="input-group border rounded">
                        <span className="input-group-text bg-light border-end-0">
                          <FaCar className="text-primary" />
                        </span>
                        <input 
                          name="vehicle"
                          className="form-control border-start-0 text-dark border-0"
                          placeholder="e.g., Toyota Prius, Honda Civic"
                          value={transport.vehicle}
                          onChange={handleTransport}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-medium text-dark">Seating Capacity *</label>
                      <select 
                        name="seats"
                        className="form-select text-dark border"
                        value={transport.seats}
                        onChange={handleTransport}
                        required
                      >
                        <option value="">Select Seats</option>
                        {seatOptions.map(seats => (
                          <option key={seats} value={seats}>{seats} {seats === "1" ? "Person" : "Persons"}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-medium text-dark">Price Per KM (LKR) *</label>
                      <div className="input-group border rounded">
                        <span className="input-group-text bg-light border-end-0">
                          <FaDollarSign className="text-primary" />
                        </span>
                        <input 
                          type="number"
                          name="pricePer1km"
                          className="form-control border-start-0 text-dark border-0"
                          placeholder="e.g., 100"
                          value={transport.pricePer1km}
                          onChange={handleTransport}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-4 mb-3 d-flex align-items-end">
                      <div className="card border p-3 w-100">
                        <div className="form-check form-switch mb-0">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            role="switch"
                            name="available"
                            checked={transport.available}
                            onChange={handleTransport}
                          />
                          <label className="form-check-label fw-medium text-dark">
                            Available for Booking
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-medium text-dark">Features</label>
                    <div className="input-group border rounded">
                      <span className="input-group-text bg-light border-end-0">
                        <FaCog className="text-primary" />
                      </span>
                      <input 
                        type="text"
                        name="features"
                        className="form-control border-start-0 text-dark border-0"
                        placeholder="e.g., AC, WiFi, Charging Ports, GPS"
                        value={transport.features}
                        onChange={handleTransport}
                      />
                    </div>
                    <div className="form-text text-dark">Separate features with commas</div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-medium text-dark">Vehicle Description</label>
                    <textarea 
                      name="description"
                      className="form-control text-dark border"
                      rows="4"
                      placeholder="Describe the vehicle, condition, special features..."
                      value={transport.description}
                      onChange={handleTransport}
                    />
                  </div>
                </div>

                {/* Vehicle Images Section */}
                <div className="mb-5 pb-4 border-bottom">
                  <h5 className="fw-semibold text-dark mb-3 border-bottom pb-2">
                    Vehicle Images
                  </h5>
                  
                  <div className="mb-3">
                    <label className="form-label fw-medium text-dark">Add New Images</label>
                    <input 
                      type="file" 
                      multiple 
                      onChange={handleNewImages} 
                      className="form-control text-dark border"
                      accept="image/*"
                    />
                    <div className="form-text text-dark">
                      <FaUpload className="me-1" />
                      Select additional images of the vehicle
                    </div>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="mt-3">
                      <h6 className="text-dark mb-3">Current Images ({imagePreviews.length})</h6>
                      <div className="row g-3">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="col-md-3 col-6">
                            <div className="card border position-relative">
                              <img 
                                src={preview} 
                                alt={`Vehicle ${index + 1}`}
                                className="card-img-top"
                                style={{ height: '120px', objectFit: 'cover' }}
                              />
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-1"
                                onClick={() => handleRemoveImage(index)}
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Provider Details Section */}
                <div className="mb-5">
                  <h5 className="fw-semibold text-dark mb-3 border-bottom pb-2">
                    Service Provider Details
                  </h5>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium text-dark">Provider Name *</label>
                      <div className="input-group border rounded">
                        <span className="input-group-text bg-light border-end-0">
                          <FaUserTie className="text-primary" />
                        </span>
                        <input 
                          name="name"
                          className="form-control border-start-0 text-dark border-0"
                          placeholder="e.g., John's Transport Service"
                          value={provider.name}
                          onChange={handleProvider}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium text-dark">Email *</label>
                      <div className="input-group border rounded">
                        <span className="input-group-text bg-light border-end-0">
                          <FaEnvelope className="text-primary" />
                        </span>
                        <input 
                          type="email"
                          name="email"
                          className="form-control border-start-0 text-dark border-0"
                          placeholder="provider@example.com"
                          value={provider.email}
                          onChange={handleProvider}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium text-dark">Phone Number *</label>
                      <div className="input-group border rounded">
                        <span className="input-group-text bg-light border-end-0">
                          <FaPhone className="text-primary" />
                        </span>
                        <input 
                          name="phone"
                          className="form-control border-start-0 text-dark border-0"
                          placeholder="+94 77 123 4567"
                          value={provider.phone}
                          onChange={handleProvider}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium text-dark">Rating</label>
                      <div className="input-group border rounded">
                        <span className="input-group-text bg-light border-end-0">
                          <FaStar className="text-warning" />
                        </span>
                        <input 
                          type="number"
                          name="rating"
                          step="0.1"
                          min="0"
                          max="5"
                          className="form-control border-start-0 text-dark border-0"
                          placeholder="4.5"
                          value={provider.rating}
                          onChange={handleProvider}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium text-dark">Completed Trips</label>
                      <div className="input-group border rounded">
                        <span className="input-group-text bg-light border-end-0">
                          <FaUsers className="text-primary" />
                        </span>
                        <input 
                          type="number"
                          name="completedTrips"
                          className="form-control border-start-0 text-dark border-0"
                          placeholder="150"
                          value={provider.completedTrips}
                          onChange={handleProvider}
                        />
                      </div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium text-dark">Service Since</label>
                      <div className="input-group border rounded">
                        <span className="input-group-text bg-light border-end-0">
                          <FaCalendar className="text-primary" />
                        </span>
                        <input 
                          type="number"
                          name="since"
                          className="form-control border-start-0 text-dark border-0"
                          placeholder="2020"
                          value={provider.since}
                          onChange={handleProvider}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="card border p-3">
                      <div className="form-check form-switch mb-0">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          role="switch"
                          checked={provider.verified}
                          onChange={(e) => setProvider({ ...provider, verified: e.target.checked })}
                        />
                        <label className="form-check-label fw-medium text-dark">
                          <FaCheck className="text-success me-2" />
                          Verified Provider
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="card border mt-4">
                  <div className="card-body">
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end border-top pt-3">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary me-md-2 border"
                        onClick={() => navigate("/dashboard/admin/transports")}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary px-4 border-0"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Updating...
                          </>
                        ) : (
                          <>
                            <FaSave className="me-2" />
                            Update Transport Service
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .form-control:focus {
          border-color: #667eea !important;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        
        .card {
          transition: transform 0.2s ease-in-out;
        }
        
        .card:hover {
          transform: translateY(-2px);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
        }
        
        .btn-primary:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
          transform: translateY(-1px);
        }
        
        .input-group:focus-within {
          border-color: #667eea !important;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
      `}</style>
    </div>
  );
}

export default EditTransport;