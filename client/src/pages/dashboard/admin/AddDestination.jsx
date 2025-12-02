import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSave, FaPlus, FaTrash, FaMapMarkerAlt, FaImage, FaStar, FaCalendarAlt, FaCloudSun, FaHotel, FaTags, FaRunning } from "react-icons/fa";

const AddDestination = () => {
  const [form, setForm] = useState({
    name: "", description: "", detailedDescription: "",
    bestFor: "", bestTime: "", weather: "", province: "",
    rating: 0, featured: false, hotels: "", categories: "", activities: ""
  });
  const [destImages, setDestImages] = useState([]);
  const [highlights, setHighlights] = useState([{ name: "", description: "", bestTime: "", tips: "" }]);
  const [highlightImages, setHighlightImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Predefined options for select dropdowns
  const provinces = [
    "Central Province", "Western Province", "Southern Province", 
    "Northern Province", "Eastern Province", "North Western Province",
    "North Central Province", "Uva Province", "Sabaragamuwa Province"
  ];

  const bestForOptions = [
    "Families", "Couples", "Solo Travelers", "Adventure Seekers",
    "History Buffs", "Nature Lovers", "Photography Enthusiasts",
    "Budget Travelers", "Luxury Travelers", "Business Travelers"
  ];

  const weatherOptions = [
    "Tropical", "Moderate", "Cool", "Hot", "Humid",
    "Dry", "Rainy", "Windy", "Mild", "Variable"
  ];

  const categoryOptions = [
    "Historical", "Natural", "Cultural", "Religious",
    "Adventure", "Beach", "Wildlife", "Hill Country",
    "Urban", "Rural", "Archaeological", "Spiritual"
  ];

  const activityOptions = [
    "Hiking", "Photography", "Sightseeing", "Wildlife Watching",
    "Swimming", "Shopping", "Dining", "Cultural Shows",
    "Trekking", "Bird Watching", "Boating", "Meditation",
    "Yoga", "Surfing", "Diving", "Snorkeling"
  ];

  const bestTimeOptions = [
    "December to February", "March to April", "May to September",
    "October to November", "Year-round", "Monsoon Season",
    "Dry Season", "Peak Season", "Off-season"
  ];

  useEffect(() => {
    // You can fetch existing hotels from API if needed
    // const fetchHotels = async () => {
    //   try {
    //     const res = await axios.get("http://localhost:5000/api/hotels");
    //     setHotelOptions(res.data.map(hotel => hotel.name));
    //   } catch (err) {
    //     console.error("Error fetching hotels:", err);
    //   }
    // };
    // fetchHotels();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleHighlightChange = (i, e) => {
    const newHighlights = [...highlights];
    newHighlights[i][e.target.name] = e.target.value;
    setHighlights(newHighlights);
  };

  const addHighlight = () => setHighlights([...highlights, { name: "", description: "", bestTime: "", tips: "" }]);

  const removeHighlight = (index) => {
    const newHighlights = highlights.filter((_, i) => i !== index);
    setHighlights(newHighlights);
    const newHighlightImages = highlightImages.filter((_, i) => i !== index);
    setHighlightImages(newHighlightImages);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Destination name is required";
    if (!form.description.trim()) newErrors.description = "Short description is required";
    if (!form.detailedDescription.trim()) newErrors.detailedDescription = "Detailed description is required";
    if (!form.province) newErrors.province = "Province is required";
    if (destImages.length === 0) newErrors.destImages = "At least one destination image is required";
    
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
      const data = new FormData();
      Object.keys(form).forEach(k => data.append(k, form[k]));
      destImages.forEach(f => data.append("images", f));
      highlightImages.forEach(f => data.append("highlightImages", f));
      data.append("highlights", JSON.stringify(highlights));

      const res = await axios.post("http://localhost:5000/api/destinations/full-create", data);
      alert("Destination added successfully!");
      console.log(res.data);
      
      // Reset form
      setForm({
        name: "", description: "", detailedDescription: "",
        bestFor: "", bestTime: "", weather: "", province: "",
        rating: 0, featured: false, hotels: "", categories: "", activities: ""
      });
      setDestImages([]);
      setHighlights([{ name: "", description: "", bestTime: "", tips: "" }]);
      setHighlightImages([]);
      setErrors({});
    } catch (err) {
      console.error("Error adding destination:", err);
      alert("Error adding destination");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow" style={{ border: "2px solid #4e73df" }}>
        <div className="card-header bg-primary text-white" style={{ borderBottom: "2px solid #4e73df" }}>
          <h2 className="mb-0">
            <FaMapMarkerAlt className="me-2" />
            Add New Destination
          </h2>
        </div>
        
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Basic Information Section */}
            <div className="row mb-4 p-3" style={{ border: "2px solid #e3f2fd", borderRadius: "8px", backgroundColor: "#f8f9fa" }}>
              <div className="col-12">
                <h4 className="text-primary mb-3" style={{ borderBottom: "2px solid #4e73df", paddingBottom: "10px" }}>
                  <FaMapMarkerAlt className="me-2" />
                  Basic Information
                </h4>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Destination Name *</label>
                <input 
                  name="name" 
                  placeholder="e.g., Sigiriya Rock, Temple of Tooth"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  value={form.name} 
                  onChange={handleChange} 
                  required 
                  style={{ border: "2px solid #dee2e6", color: "black" }}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Province *</label>
                <select 
                  name="province" 
                  className={`form-control ${errors.province ? 'is-invalid' : ''}`}
                  value={form.province} 
                  onChange={handleChange} 
                  style={{ border: "2px solid #dee2e6", color: "black" }}
                >
                  <option value="">Select Province</option>
                  {provinces.map((province, index) => (
                    <option key={index} value={province}>{province}</option>
                  ))}
                </select>
                {errors.province && <div className="invalid-feedback">{errors.province}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  <FaCalendarAlt className="me-2" />
                  Best Time to Visit
                </label>
                <select 
                  name="bestTime" 
                  className="form-control"
                  value={form.bestTime} 
                  onChange={handleChange} 
                  style={{ border: "2px solid #dee2e6", color: "black" }}
                >
                  <option value="">Select Best Time</option>
                  {bestTimeOptions.map((time, index) => (
                    <option key={index} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  <FaCloudSun className="me-2" />
                  Weather
                </label>
                <select 
                  name="weather" 
                  className="form-control"
                  value={form.weather} 
                  onChange={handleChange} 
                  style={{ border: "2px solid #dee2e6", color: "black" }}
                >
                  <option value="">Select Weather Type</option>
                  {weatherOptions.map((weather, index) => (
                    <option key={index} value={weather}>{weather}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  <FaStar className="me-2" />
                  Best For
                </label>
                <select 
                  name="bestFor" 
                  className="form-control"
                  value={form.bestFor} 
                  onChange={handleChange} 
                  style={{ border: "2px solid #dee2e6", color: "black" }}
                >
                  <option value="">Select Target Audience</option>
                  {bestForOptions.map((audience, index) => (
                    <option key={index} value={audience}>{audience}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Rating</label>
                <select 
                  name="rating" 
                  className="form-control"
                  value={form.rating} 
                  onChange={handleChange} 
                  style={{ border: "2px solid #dee2e6", color: "black" }}
                >
                  <option value="0">Select Rating</option>
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>

              <div className="col-12 mb-3">
                <div className="form-check">
                  <input 
                    type="checkbox" 
                    className="form-check-input"
                    style={{ border: "2px solid #dee2e6" }}
                    checked={form.featured} 
                    onChange={e => setForm({ ...form, featured: e.target.checked })} 
                    id="featuredCheck"
                  />
                  <label className="form-check-label fw-semibold" htmlFor="featuredCheck">
                    Featured Destination
                  </label>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="row mb-4 p-3" style={{ border: "2px solid #e3f2fd", borderRadius: "8px", backgroundColor: "#f8f9fa" }}>
              <div className="col-12">
                <h4 className="text-primary mb-3" style={{ borderBottom: "2px solid #4e73df", paddingBottom: "10px" }}>
                  Description Details
                </h4>
              </div>

              <div className="col-12 mb-3">
                <label className="form-label fw-semibold">Short Description *</label>
                <textarea 
                  name="description" 
                  placeholder="Brief description of the destination..."
                  className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  value={form.description} 
                  onChange={handleChange} 
                  rows="3"
                  style={{ border: "2px solid #dee2e6", color: "black" }}
                />
                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
              </div>

              <div className="col-12 mb-3">
                <label className="form-label fw-semibold">Detailed Description *</label>
                <textarea 
                  name="detailedDescription" 
                  placeholder="Comprehensive description including history, significance, etc."
                  className={`form-control ${errors.detailedDescription ? 'is-invalid' : ''}`}
                  value={form.detailedDescription} 
                  onChange={handleChange} 
                  rows="5"
                  style={{ border: "2px solid #dee2e6", color: "black" }}
                />
                {errors.detailedDescription && <div className="invalid-feedback">{errors.detailedDescription}</div>}
              </div>
            </div>

            {/* Additional Details Section */}
            <div className="row mb-4 p-3" style={{ border: "2px solid #e3f2fd", borderRadius: "8px", backgroundColor: "#f8f9fa" }}>
              <div className="col-12">
                <h4 className="text-primary mb-3" style={{ borderBottom: "2px solid #4e73df", paddingBottom: "10px" }}>
                  Additional Details
                </h4>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">
                  <FaHotel className="me-2" />
                  Hotels (Comma separated)
                </label>
                <input 
                  name="hotels" 
                  placeholder="Hotel names separated by commas"
                  className="form-control"
                  value={form.hotels} 
                  onChange={handleChange} 
                  style={{ border: "2px solid #dee2e6", color: "black" }}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">
                  <FaTags className="me-2" />
                  Categories
                </label>
                <select 
                  name="categories" 
                  className="form-control"
                  value={form.categories} 
                  onChange={handleChange} 
                  style={{ border: "2px solid #dee2e6", color: "black" }}
                >
                  <option value="">Select Category</option>
                  {categoryOptions.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">
                  <FaRunning className="me-2" />
                  Activities
                </label>
                <select 
                  name="activities" 
                  className="form-control"
                  value={form.activities} 
                  onChange={handleChange} 
                  style={{ border: "2px solid #dee2e6", color: "black" }}
                >
                  <option value="">Select Activity</option>
                  {activityOptions.map((activity, index) => (
                    <option key={index} value={activity}>{activity}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Destination Images Section */}
            <div className="row mb-4 p-3" style={{ border: "2px solid #e3f2fd", borderRadius: "8px", backgroundColor: "#f8f9fa" }}>
              <div className="col-12">
                <h4 className="text-primary mb-3" style={{ borderBottom: "2px solid #4e73df", paddingBottom: "10px" }}>
                  <FaImage className="me-2" />
                  Destination Images *
                </h4>
              </div>

              <div className="col-12 mb-3">
                <input 
                  type="file" 
                  multiple 
                  className={`form-control ${errors.destImages ? 'is-invalid' : ''}`}
                  onChange={e => setDestImages([...e.target.files])} 
                  style={{ border: "2px solid #dee2e6",color: "black" }}
                  accept="image/*"
                />
                {errors.destImages && <div className="invalid-feedback">{errors.destImages}</div>}
                <small className="text-muted">
                  Select multiple images for the destination ({destImages.length} selected)
                </small>
              </div>
            </div>

            {/* Highlights Section */}
            <div className="row mb-4 p-3" style={{ border: "2px solid #e3f2fd", borderRadius: "8px", backgroundColor: "#f8f9fa" }}>
              <div className="col-12">
                <h4 className="text-primary mb-3" style={{ borderBottom: "2px solid #4e73df", paddingBottom: "10px" }}>
                  Destination Highlights
                </h4>
              </div>

              {highlights.map((h, i) => (
                <div key={i} className="col-12 mb-4 p-3" style={{ border: "2px solid #dee2e6", borderRadius: "8px", backgroundColor: "white" }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Highlight #{i + 1}</h5>
                    {highlights.length > 1 && (
                      <button 
                        type="button" 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeHighlight(i)}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Name</label>
                      <input 
                        name="name" 
                        placeholder="Highlight name"
                        className="form-control"
                        value={h.name} 
                        onChange={e => handleHighlightChange(i, e)} 
                        style={{ border: "2px solid #dee2e6", color: "black" }}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Best Time</label>
                      <select 
                        name="bestTime" 
                        className="form-control"
                        value={h.bestTime} 
                        onChange={e => handleHighlightChange(i, e)} 
                        style={{ border: "2px solid #dee2e6", color: "black" }}
                      >
                        <option value="">Select Best Time</option>
                        {bestTimeOptions.map((time, index) => (
                          <option key={index} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label fw-semibold">Description</label>
                      <textarea 
                        name="description" 
                        placeholder="Description of this highlight"
                        className="form-control"
                        value={h.description} 
                        onChange={e => handleHighlightChange(i, e)} 
                        rows="3"
                        style={{ border: "2px solid #dee2e6", color: "black" }}
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label fw-semibold">Tips</label>
                      <input 
                        name="tips" 
                        placeholder="Useful tips for visitors"
                        className="form-control"
                        value={h.tips} 
                        onChange={e => handleHighlightChange(i, e)} 
                        style={{ border: "2px solid #dee2e6", color: "black" }}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Highlight Image</label>
                      <input 
                        type="file" 
                        className="form-control"
                        onChange={e => setHighlightImages(prev => {
                          const newArr = [...prev]; newArr[i] = e.target.files[0]; return newArr;
                        })} 
                        style={{ border: "2px solid #dee2e6",color: "black" }}
                        accept="image/*"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="col-12">
                <button 
                  type="button" 
                  className="btn btn-outline-primary"
                  onClick={addHighlight}
                  style={{ border: "2px solid #4e73df", color: "#4e73df" }}
                >
                  <FaPlus className="me-2" />
                  Add Another Highlight
                </button>
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
                  {loading ? "Saving Destination..." : "Save Destination"}
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
};

export default AddDestination;