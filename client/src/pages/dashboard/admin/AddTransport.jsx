import React, { useState } from "react";
import axios from "axios";
import { FaSave, FaCar, FaUserTie, FaUpload } from "react-icons/fa";

function AddTransport() {
  const [transport, setTransport] = useState({
    vehicleType: "",
    seats: "",
    features: "",
    pricePer1km: "",
    available: true,
    vehicle: "",
    description: "",
  });

  const [provider, setProvider] = useState({
    name: "",
    email: "",
    phone: "",
    rating: "",
    completedTrips: "",
    since: "",
    verified: false,
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleTransport = (e) => {
    const { name, value } = e.target;
    setTransport({ ...transport, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleProvider = (e) => {
    const { name, value } = e.target;
    setProvider({ ...provider, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImages = (e) => {
    setImages([...e.target.files]);
    if (errors.images) {
      setErrors({ ...errors, images: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!transport.vehicleType.trim()) newErrors.vehicleType = "Vehicle type is required";
    if (!transport.seats.trim()) newErrors.seats = "Number of seats is required";
    if (!transport.pricePer1km.trim()) newErrors.pricePer1km = "Price per km is required";
    if (!transport.vehicle.trim()) newErrors.vehicle = "Vehicle name is required";
    if (!transport.description.trim()) newErrors.description = "Description is required";
    if (images.length === 0) newErrors.images = "At least one image is required";

    if (!provider.name.trim()) newErrors.providerName = "Provider name is required";
    if (!provider.email.trim()) newErrors.email = "Email is required";
    if (!provider.phone.trim()) newErrors.phone = "Phone is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (provider.email && !emailRegex.test(provider.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (provider.phone && !phoneRegex.test(provider.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Please fix the errors before submitting.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // Append images
      images.forEach((img) => formData.append("images", img));

      // Append transport fields individually
      formData.append("vehicleType", transport.vehicleType);
      formData.append("seats", transport.seats);
      formData.append("features", transport.features);
      formData.append("pricePer1km", transport.pricePer1km);
      formData.append("available", transport.available);
      formData.append("vehicle", transport.vehicle);
      formData.append("description", transport.description);

      // Append provider fields individually
      formData.append("providerName", provider.name);
      formData.append("providerEmail", provider.email);
      formData.append("providerPhone", provider.phone);
      formData.append("providerRating", provider.rating || 0);
      formData.append("providerCompletedTrips", provider.completedTrips || 0);
      formData.append("providerSince", provider.since || new Date().getFullYear());
      formData.append("providerVerified", provider.verified);

      await axios.post(
        "http://localhost:5000/api/transports/full-create",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Transport + Provider added successfully!");

      // Reset form
      setTransport({
        vehicleType: "",
        seats: "",
        features: "",
        pricePer1km: "",
        available: true,
        vehicle: "",
        description: "",
      });
      setProvider({
        name: "",
        email: "",
        phone: "",
        rating: "",
        completedTrips: "",
        since: "",
        verified: false,
      });
      setImages([]);
      setErrors({});
    } catch (err) {
      console.error("Error adding transport:", err);
      alert("Failed to save transport + provider");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow" style={{ border: "2px solid #4e73df" }}>
        <div className="card-header bg-primary text-white" style={{ borderBottom: "2px solid #4e73df" }}>
          <h2 className="mb-0">
            <FaCar className="me-2" />
            Add Transport + Provider
          </h2>
        </div>
        
        <div className="card-body">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Transport Section */}
            <div className="row mb-4 p-3" style={{ border: "2px solid #e3f2fd", borderRadius: "8px", backgroundColor: "#f8f9fa" }}>
              <div className="col-12">
                <h4 className="text-primary mb-3" style={{ borderBottom: "2px solid #4e73df", paddingBottom: "10px" }}>
                  <FaCar className="me-2" />
                  Transport Details
                </h4>
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Vehicle Type *</label>
                <select
                  name="vehicleType"
                  className={`form-control ${errors.vehicleType ? "is-invalid" : ""}`}
                  value={transport.vehicleType}
                  onChange={handleTransport}
                  style={{ border: "2px solid #dee2e6", color: "black" }}
                >
                  <option value="">-- Select Vehicle Type --</option>
                  <option value="Car">Car</option>
                  <option value="Van">Van</option>
                  <option value="Bus">Bus</option>
                  <option value="Luxury Car">Luxury Car</option>
                  <option value="SUV">SUV</option>
                  <option value="Mini Van">Mini Van</option>
                </select>

                {errors.vehicleType && <div className="invalid-feedback">{errors.vehicleType}</div>}
              </div>


              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Vehicle Name *</label>
                <input
                  name="vehicle"
                  placeholder="e.g., Toyota Hiace, Honda Civic"
                  className={`form-control ${errors.vehicle ? 'is-invalid' : ''}`}
                  value={transport.vehicle}
                  onChange={handleTransport}
                  style={{ border: "2px solid #dee2e6", color: "black" }}
                />
                {errors.vehicle && <div className="invalid-feedback">{errors.vehicle}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Number of Seats *</label>
                <input
                  type="number"
                  name="seats"
                  placeholder="e.g., 4, 7, 15"
                  className={`form-control ${errors.seats ? 'is-invalid' : ''}`}
                  value={transport.seats}
                  onChange={handleTransport}
                  min="1"
                  style={{ border: "2px solid #dee2e6", color: "black" }}
                />
                {errors.seats && <div className="invalid-feedback">{errors.seats}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Price Per 1km (Rs) *</label>
                <input
                  type="number"
                  name="pricePer1km"
                  placeholder="e.g., 50"
                  className={`form-control ${errors.pricePer1km ? 'is-invalid' : ''}`}
                  value={transport.pricePer1km}
                  onChange={handleTransport}
                  min="0"
                  step="0.01"
                  style={{ border: "2px solid #dee2e6", color: "black" }}
                />
                {errors.pricePer1km && <div className="invalid-feedback">{errors.pricePer1km}</div>}
              </div>

              <div className="col-12 mb-3">
                <label className="form-label fw-semibold">Features</label>
                <input
                  name="features"
                  placeholder="e.g., AC, WiFi, Charging Ports, GPS (comma separated)"
                  className="form-control"
                  value={transport.features}
                  onChange={handleTransport}
                  style={{ border: "2px solid #dee2e6", color: "black" }}
                />
                <small className="text-muted">Separate multiple features with commas</small>
              </div>

              <div className="col-12 mb-3">
                <label className="form-label fw-semibold">Description *</label>
                <textarea
                  name="description"
                  placeholder="Describe the vehicle, comfort, condition, etc."
                  className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  value={transport.description}
                  onChange={handleTransport}
                  rows="3"
                  style={{ border: "2px solid #dee2e6", color: "black" }}
                />
                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
              </div>

              <div className="col-12 mb-3">
                <label className="form-label fw-semibold">Vehicle Images *</label>
                <input
                  type="file"
                  multiple
                  onChange={handleImages}
                  className={`form-control ${errors.images ? 'is-invalid' : ''}`}
                  style={{ border: "2px solid #dee2e6" }}
                  accept="image/*"
                />
                {errors.images && <div className="invalid-feedback">{errors.images}</div>}
                <small className="text-muted">
                  <FaUpload className="me-1" />
                  Select multiple images of the vehicle ({images.length} selected)
                </small>
              </div>
            </div>

            {/* Provider Section */}
            <div className="row mb-4 p-3" style={{ border: "2px solid #e3f2fd", borderRadius: "8px", backgroundColor: "#f8f9fa" }}>
              <div className="col-12">
                <h4 className="text-primary mb-3" style={{ borderBottom: "2px solid #4e73df", paddingBottom: "10px" }}>
                  <FaUserTie className="me-2" />
                  Provider Details
                </h4>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Provider Name *</label>
                <input
                  name="name"
                  placeholder="Full name of the provider"
                  className={`form-control ${errors.providerName ? 'is-invalid' : ''}`}
                  value={provider.name}
                  onChange={handleProvider}
                  style={{ border: "2px solid #dee2e6", color: "black" }}
                />
                {errors.providerName && <div className="invalid-feedback">{errors.providerName}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Email *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="provider@example.com"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  value={provider.email}
                  onChange={handleProvider}
                  style={{ border: "2px solid #dee2e6", color: "black" }}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Phone *</label>
                <input
                  name="phone"
                  placeholder="07XXXXXXXX"
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  value={provider.phone}
                  onChange={handleProvider}
                  style={{ border: "2px solid #dee2e6", color: "black" }}
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Rating</label>
                <input
                  type="number"
                  name="rating"
                  placeholder="0.0 to 5.0"
                  className="form-control"
                  value={provider.rating}
                  onChange={handleProvider}
                  min="0"
                  max="5"
                  step="0.1"
                  style={{ border: "2px solid #dee2e6", color: "black" }}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Completed Trips</label>
                <input
                  type="number"
                  name="completedTrips"
                  placeholder="Number of completed trips"
                  className="form-control"
                  value={provider.completedTrips}
                  onChange={handleProvider}
                  min="0"
                  style={{ border: "2px solid #dee2e6", color: "black" }}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Since Year</label>
                <input
                  type="number"
                  name="since"
                  placeholder="e.g., 2020"
                  className="form-control"
                  value={provider.since}
                  onChange={handleProvider}
                  min="1900"
                  max={new Date().getFullYear()}
                  style={{ border: "2px solid #dee2e6", color: "black" }}
                />
              </div>

              <div className="col-12 mb-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    checked={provider.verified}
                    onChange={(e) => setProvider({...provider, verified: e.target.checked})}
                    className="form-check-input"
                    style={{ border: "2px solid #dee2e6" }}
                    id="verifiedCheck"
                  />
                  <label className="form-check-label fw-semibold" htmlFor="verifiedCheck">
                    Verified Provider
                  </label>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12 text-center">
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg px-5"
                  disabled={loading}
                  style={{ 
                    border: "2px solid #2e59d9",
                    fontWeight: "bold",
                    fontSize: "1.1rem"
                  }}
                >
                  <FaSave className="me-2" />
                  {loading ? "Saving..." : "Save Transport & Provider"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .form-control:focus {
          border-color: #4e73df !important;
          box-shadow: 0 0 0 0.2rem rgba(78, 115, 223, 0.25);
          outline: none;
        }
        
        .btn-primary {
          background: linear-gradient(45deg, #4e73df, #2e59d9);
          border: none;
        }
        
        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(45deg, #2e59d9, #1e3a8a);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .card-header {
          background: linear-gradient(45deg, #4e73df, #2e59d9) !important;
        }
        
        .form-check-input:checked {
          background-color: #4e73df;
          border-color: #4e73df;
        }
      `}</style>
    </div>
  );
}

export default AddTransport;