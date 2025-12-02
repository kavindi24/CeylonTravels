import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { 
  FaMap,
  FaMapMarkerAlt,
  FaDollarSign,
  FaStar,
  FaImage,
  FaPlus,
  FaTrash,
  FaSave,
  FaArrowLeft,
  FaUpload,
  FaLightbulb,
  FaEdit
} from "react-icons/fa";

function EditTourPackage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [destinations, setDestinations] = useState([]);
  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    price: "",
    rating: "",
    duration: "",
    destinationId: "",
    highlights: [],
    includes: [],
    excludes: [],
    itinerary: [],
    reviews: [],
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [highlight, setHighlight] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const tourCategories = [
    "Adventure", "Cultural", "Wildlife", "Beach", "Historical",
    "Religious", "Hiking", "Luxury", "Budget", "Family",
    "Honeymoon", "Group", "Private", "City Tour", "Nature"
  ];

  const durationOptions = [
    "1 Day", "2 Days 1 Night", "3 Days 2 Nights", "4 Days 3 Nights",
    "5 Days 4 Nights", "6 Days 5 Nights", "7 Days 6 Nights", "8+ Days"
  ];

  // Fetch tour package data and destinations
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);
        
        // Fetch destinations
        const destRes = await axios.get("http://localhost:5000/api/destinations");
        setDestinations(destRes.data);

        // Fetch tour package data
        const packageRes = await axios.get(`http://localhost:5000/api/tour-packages/${id}`);
        const packageData = packageRes.data;
        
        setForm({
          title: packageData.title || "",
          category: packageData.category || "",
          location: packageData.location || "",
          price: packageData.price || "",
          rating: packageData.rating || "",
          duration: packageData.duration || "",
          destinationId: packageData.destinationId || "",
          highlights: packageData.highlights || [],
          includes: packageData.includes || [],
          excludes: packageData.excludes || [],
          itinerary: packageData.itinerary || [],
          reviews: packageData.reviews || [],
        });

        // Set existing image preview
        if (packageData.image) {
          setImagePreview(`http://localhost:5000${packageData.image}`);
        }

      } catch (err) {
        console.error("Error fetching data:", err);
        alert("Failed to load tour package data");
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddHighlight = () => {
    if (highlight.trim() !== "") {
      setForm({ ...form, highlights: [...form.highlights, highlight] });
      setHighlight("");
    }
  };

  const handleRemoveHighlight = (index) => {
    const updatedHighlights = form.highlights.filter((_, i) => i !== index);
    setForm({ ...form, highlights: updatedHighlights });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      
      // Append basic form data
      Object.keys(form).forEach(key => {
        if (key === "highlights" || key === "includes" || key === "excludes" || key === "itinerary" || key === "reviews") {
          data.append(key, JSON.stringify(form[key]));
        } else {
          data.append(key, form[key]);
        }
      });
      
      // Append image only if it's a new file
      if (image) {
        data.append("image", image);
      }

      const res = await axios.put(`http://localhost:5000/api/tour-packages/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(res.data.message);
      navigate("/dashboard/admin/tour-packages");
    } catch (err) {
      console.error(err);
      alert("Failed to update package. Check console for errors.");
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
                <p className="mt-3 text-dark">Loading tour package data...</p>
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
                    <FaEdit className="text-white fs-4" />
                  </div>
                  <div>
                    <h2 className="fw-bold text-dark mb-1">Edit Tour Package</h2>
                    <p className="text-muted mb-0">Update tour package information</p>
                  </div>
                </div>
                <button 
                  className="btn btn-outline-secondary border"
                  onClick={() => navigate("/dashboard/admin/tour-packages")}
                >
                  <FaArrowLeft className="me-2" />
                  Back to Tours
                </button>
              </div>
            </div>
          </div>

          <div className="card shadow-sm border">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {/* Basic Information Section */}
                <div className="mb-5 pb-4 border-bottom">
                  <h5 className="fw-semibold text-dark mb-3 border-bottom pb-2">
                    Basic Information
                  </h5>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium text-dark">Package Title *</label>
                      <div className="input-group border rounded">
                        <span className="input-group-text bg-light border-end-0">
                          <FaMap className="text-primary" />
                        </span>
                        <input
                          type="text"
                          name="title"
                          className="form-control border-start-0 text-dark border-0"
                          value={form.title}
                          onChange={handleChange}
                          placeholder="e.g., Cultural Triangle Experience"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium text-dark">Category *</label>
                      <select
                        name="category"
                        className="form-select text-dark border"
                        value={form.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Category</option>
                        {tourCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium text-dark">Location *</label>
                      <div className="input-group border rounded">
                        <span className="input-group-text bg-light border-end-0">
                          <FaMapMarkerAlt className="text-primary" />
                        </span>
                        <input
                          type="text"
                          name="location"
                          className="form-control border-start-0 text-dark border-0"
                          value={form.location}
                          onChange={handleChange}
                          placeholder="e.g., Kandy, Sri Lanka"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium text-dark">Price (LKR) *</label>
                      <div className="input-group border rounded">
                        <span className="input-group-text bg-light border-end-0">
                          <FaDollarSign className="text-primary" />
                        </span>
                        <input
                          type="number"
                          name="price"
                          className="form-control border-start-0 text-dark border-0"
                          value={form.price}
                          onChange={handleChange}
                          placeholder="e.g., 25000"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-medium text-dark">Rating</label>
                      <div className="input-group border rounded">
                        <span className="input-group-text bg-light border-end-0">
                          <FaStar className="text-warning" />
                        </span>
                        <input
                          type="number"
                          name="rating"
                          step="0.1"
                          max="5"
                          min="0"
                          className="form-control border-start-0 text-dark border-0"
                          value={form.rating}
                          onChange={handleChange}
                          placeholder="4.5"
                        />
                      </div>
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-medium text-dark">Duration</label>
                      <select
                        name="duration"
                        className="form-select text-dark border"
                        value={form.duration}
                        onChange={handleChange}
                      >
                        <option value="">Select Duration</option>
                        {durationOptions.map(dur => (
                          <option key={dur} value={dur}>{dur}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-medium text-dark">Destination</label>
                      <select
                        name="destinationId"
                        className="form-select text-dark border"
                        value={form.destinationId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select destination</option>
                        {destinations.map(d => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Package Image Section */}
                <div className="mb-5 pb-4 border-bottom">
                  <h5 className="fw-semibold text-dark mb-3 border-bottom pb-2">
                    Package Image
                  </h5>
                  
                  <div className="card border">
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <label className="form-label fw-medium text-dark">Update Package Image</label>
                          <input
                            type="file"
                            name="image"
                            className="form-control text-dark border"
                            onChange={handleFileChange}
                            accept="image/*"
                          />
                          <div className="form-text text-dark">
                            <FaUpload className="me-1" />
                            {imagePreview ? "Change current image" : "Choose a new image for your package"}
                          </div>
                        </div>
                        <div className="col-md-6 text-center">
                          {imagePreview ? (
                            <div className="mt-3">
                              <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="img-fluid rounded border"
                                style={{ maxHeight: '150px' }}
                              />
                              <div className="form-text text-dark mt-1">
                                {image ? "New Image Preview" : "Current Image"}
                              </div>
                            </div>
                          ) : (
                            <div className="text-muted mt-3">
                              <FaImage className="fs-1 mb-2" />
                              <div>No image available</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Highlights Section */}
                <div className="mb-5 pb-4 border-bottom">
                  <h5 className="fw-semibold text-dark mb-3 border-bottom pb-2">
                    Package Highlights
                  </h5>
                  
                  <div className="mb-3">
                    <label className="form-label fw-medium text-dark">Add Highlight</label>
                    <div className="input-group border rounded">
                      <input
                        type="text"
                        className="form-control text-dark border-0"
                        value={highlight}
                        onChange={(e) => setHighlight(e.target.value)}
                        placeholder="e.g., Visit Ancient Temples"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-primary border-start-0"
                        onClick={handleAddHighlight}
                      >
                        <FaPlus className="me-1" />
                        Add
                      </button>
                    </div>
                  </div>

                  {form.highlights.length > 0 && (
                    <div className="mt-3">
                      <h6 className="text-dark mb-3">Current Highlights ({form.highlights.length})</h6>
                      <div className="card border">
                        <div className="card-body">
                          <div className="row g-2">
                            {form.highlights.map((hl, i) => (
                              <div key={i} className="col-md-6">
                                <div className="d-flex align-items-center justify-content-between border rounded p-2">
                                  <span className="text-dark">
                                    <FaLightbulb className="text-warning me-2" />
                                    {hl}
                                  </span>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger border-0"
                                    onClick={() => handleRemoveHighlight(i)}
                                  >
                                    <FaTrash size={12} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="card border mt-4">
                  <div className="card-body">
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end border-top pt-3">
                      <button
                        type="button"
                        className="btn btn-outline-secondary me-md-2 border"
                        onClick={() => navigate("/dashboard/admin/tour-packages")}
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
                            Updating Package...
                          </>
                        ) : (
                          <>
                            <FaSave className="me-2" />
                            Update Tour Package
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

export default EditTourPackage;