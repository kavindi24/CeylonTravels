import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FaHotel, 
  FaMapMarkerAlt, 
  FaDollarSign, 
  FaStar, 
  FaPlus, 
  FaTrash,
  FaSave,
  FaArrowLeft,
  FaUpload,
  FaPhone,
  FaEnvelope
} from "react-icons/fa";

export default function AddHotel() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [hotelData, setHotelData] = useState({
    name: "",
    location: "",
    price: "",
    rating: "",
    description: "",
    fullDescription: "",
    destinationId: "",
    amenities: [],
    roomTypes: [],
    images: [],
    contact: { phone: "", email: "", address: "" },
    reviews: [],
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [room, setRoom] = useState({ 
    type: "", 
    price: "", 
    capacity: "", 
    size: "", 
    image: "", 
    features: "" 
  });
  const [amenity, setAmenity] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/destinations");
        setDestinations(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDestinations();
  }, []);

  const handleChange = (e) => setHotelData({ ...hotelData, [e.target.name]: e.target.value });
  
  const handleContactChange = (e) =>
    setHotelData({ ...hotelData, contact: { ...hotelData.contact, [e.target.name]: e.target.value } });

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    
    // Create previews
    const previews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        if (previews.length === files.length) {
          setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    const updatedFiles = imageFiles.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    
    setImageFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
  };

  const handleAddAmenity = () => {
    if (amenity.trim() !== "") {
      setHotelData({ ...hotelData, amenities: [...hotelData.amenities, amenity] });
      setAmenity("");
    }
  };

  const handleRemoveAmenity = (index) => {
    const updatedAmenities = hotelData.amenities.filter((_, i) => i !== index);
    setHotelData({ ...hotelData, amenities: updatedAmenities });
  };

  const handleAddRoom = () => {
    if (room.type.trim() !== "") {
      setHotelData({
        ...hotelData,
        roomTypes: [...hotelData.roomTypes, { 
          ...room, 
          features: room.features.split(",").map(f => f.trim()).filter(f => f) 
        }],
      });
      setRoom({ type: "", price: "", capacity: "", size: "", image: "", features: "" });
    }
  };

  const handleRemoveRoom = (index) => {
    const updatedRooms = hotelData.roomTypes.filter((_, i) => i !== index);
    setHotelData({ ...hotelData, roomTypes: updatedRooms });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", hotelData.name);
      formData.append("location", hotelData.location);
      formData.append("price", hotelData.price);
      formData.append("rating", hotelData.rating);
      formData.append("description", hotelData.description);
      formData.append("fullDescription", hotelData.fullDescription);
      formData.append("destinationId", hotelData.destinationId);

      for (let i = 0; i < imageFiles.length; i++) {
        formData.append("images", imageFiles[i]);
      }

      formData.append("amenities", JSON.stringify(hotelData.amenities));
      formData.append("roomTypes", JSON.stringify(hotelData.roomTypes));
      formData.append("contact", JSON.stringify(hotelData.contact));
      formData.append("reviews", JSON.stringify(hotelData.reviews));

      await axios.post("http://localhost:5000/api/hotels", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Hotel added successfully!");
      navigate("/dashboard/admin/hotels");
    } catch (err) {
      console.error(err);
      alert("Failed to add hotel");
    } finally {
      setLoading(false);
    }
  };

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
                    <FaHotel className="text-white fs-4" />
                  </div>
                  <div>
                    <h2 className="fw-bold text-dark mb-1">Add New Hotel</h2>
                    <p className="text-muted mb-0">Create a new hotel listing</p>
                  </div>
                </div>
                <button 
                  className="btn btn-outline-secondary border"
                  onClick={() => navigate("/dashboard/admin/hotels")}
                >
                  <FaArrowLeft className="me-2" />
                  Back to Hotels
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
                      <label className="form-label fw-medium text-dark">Hotel Name *</label>
                      <div className="input-group border rounded">
                        <span className="input-group-text bg-light border-end-0">
                          <FaHotel className="text-primary" />
                        </span>
                        <input 
                          type="text" 
                          name="name"
                          className="form-control border-start-0 text-dark border-0" 
                          placeholder="e.g., Grand Hotel Colombo"
                          value={hotelData.name}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                    </div>

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
                          placeholder="e.g., Colombo, Sri Lanka"
                          value={hotelData.location}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium text-dark">Price Per Night (LKR) *</label>
                      <div className="input-group border rounded">
                        <span className="input-group-text bg-light border-end-0">
                          <FaDollarSign className="text-primary" />
                        </span>
                        <input 
                          type="number" 
                          name="price"
                          className="form-control border-start-0 text-dark border-0" 
                          placeholder="e.g., 15000"
                          value={hotelData.price}
                          onChange={handleChange}
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
                          max="5" 
                          className="form-control border-start-0 text-dark border-0" 
                          placeholder="e.g., 4.5"
                          value={hotelData.rating}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-medium text-dark">Destination *</label>
                    <select 
                      name="destinationId" 
                      className="form-control text-dark border" 
                      value={hotelData.destinationId} 
                      onChange={handleChange} 
                      required
                    >
                      <option value="">Select Destination</option>
                      {destinations.map((dest) => (
                        <option key={dest.id} value={dest.id}>
                          {dest.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-medium text-dark">Short Description</label>
                    <textarea 
                      name="description" 
                      className="form-control text-dark border" 
                      rows="3"
                      placeholder="Brief description of the hotel..."
                      value={hotelData.description}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-medium text-dark">Full Description</label>
                    <textarea 
                      name="fullDescription" 
                      className="form-control text-dark border" 
                      rows="5"
                      placeholder="Detailed description including facilities, services, and unique features..."
                      value={hotelData.fullDescription}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="mb-5 pb-4 border-bottom">
                  <h5 className="fw-semibold text-dark mb-3 border-bottom pb-2">
                    Contact Information
                  </h5>
                  
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-medium text-dark">Phone</label>
                      <div className="input-group border rounded">
                        <span className="input-group-text bg-light border-end-0">
                          <FaPhone className="text-primary" />
                        </span>
                        <input 
                          type="text" 
                          name="phone"
                          className="form-control border-start-0 text-dark border-0" 
                          placeholder="+94 11 234 5678"
                          value={hotelData.contact.phone}
                          onChange={handleContactChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-medium text-dark">Email</label>
                      <div className="input-group border rounded">
                        <span className="input-group-text bg-light border-end-0">
                          <FaEnvelope className="text-primary" />
                        </span>
                        <input 
                          type="email" 
                          name="email"
                          className="form-control border-start-0 text-dark border-0" 
                          placeholder="info@hotel.com"
                          value={hotelData.contact.email}
                          onChange={handleContactChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-medium text-dark">Address</label>
                      <div className="input-group border rounded">
                        <span className="input-group-text bg-light border-end-0">
                          <FaMapMarkerAlt className="text-primary" />
                        </span>
                        <input 
                          type="text" 
                          name="address"
                          className="form-control border-start-0 text-dark border-0" 
                          placeholder="123 Galle Road, Colombo"
                          value={hotelData.contact.address}
                          onChange={handleContactChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hotel Images Section */}
                <div className="mb-5 pb-4 border-bottom">
                  <h5 className="fw-semibold text-dark mb-3 border-bottom pb-2">
                    Hotel Images
                  </h5>
                  
                  <div className="mb-3">
                    <label className="form-label fw-medium text-dark">Upload Hotel Images *</label>
                    <input 
                      type="file" 
                      multiple 
                      onChange={handleImages} 
                      className="form-control text-dark border" 
                      accept="image/*"
                      required
                    />
                    <div className="form-text text-dark">
                      <FaUpload className="me-1" />
                      Select multiple high-quality images of the hotel
                    </div>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="mt-3">
                      <h6 className="text-dark mb-3">Image Previews ({imagePreviews.length})</h6>
                      <div className="row g-3">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="col-md-3 col-6">
                            <div className="card border position-relative">
                              <img 
                                src={preview} 
                                alt={`Preview ${index + 1}`}
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

                {/* Amenities Section */}
                <div className="mb-5 pb-4 border-bottom">
                  <h5 className="fw-semibold text-dark mb-3 border-bottom pb-2">
                    Hotel Amenities
                  </h5>
                  
                  <div className="mb-3">
                    <label className="form-label fw-medium text-dark">Add Amenity</label>
                    <div className="input-group border rounded">
                      <input 
                        type="text" 
                        value={amenity} 
                        onChange={(e) => setAmenity(e.target.value)} 
                        className="form-control text-dark border-0" 
                        placeholder="Enter amenity..."
                      />
                      <button 
                        type="button" 
                        className="btn btn-outline-primary border-start-0"
                        onClick={handleAddAmenity}
                      >
                        <FaPlus className="me-1" />
                        Add
                      </button>
                    </div>
                  </div>

                  {hotelData.amenities.length > 0 && (
                    <div className="mt-3">
                      <h6 className="text-dark mb-3">Selected Amenities ({hotelData.amenities.length})</h6>
                      <div className="card border">
                        <div className="card-body">
                          <div className="row g-2">
                            {hotelData.amenities.map((a, i) => (
                              <div key={i} className="col-md-3 col-sm-4">
                                <div className="d-flex align-items-center justify-content-between border rounded p-2">
                                  <span className="text-dark small">{a}</span>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger border-0"
                                    onClick={() => handleRemoveAmenity(i)}
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


                {/* Room Types Section */}
                <div className="mb-5 pb-4 border-bottom">
                <h5 className="fw-semibold text-dark mb-3 border-bottom pb-2">
                    Room Types
                </h5>
                
                <div className="card border mb-4">
                    <div className="card-header bg-light border-bottom">
                    <h6 className="mb-0 text-dark">Add New Room Type</h6>
                    </div>
                    <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-6">
                        <label className="form-label text-dark">Room Type *</label>
                        <select 
                            className="form-select text-dark border"
                            value={room.type}
                            onChange={(e) => setRoom({ ...room, type: e.target.value })}
                        >
                            <option value="">Select Room Type</option>
                            <option value="Standard Single Room">Standard Single Room</option>
                            <option value="Standard Double Room">Standard Double Room</option>
                            <option value="Deluxe Room">Deluxe Room</option>
                            <option value="Executive Room">Executive Room</option>
                            <option value="Family Room">Family Room</option>
                            <option value="Sea View Room">Sea View Room</option>

                        </select>
                        </div>

                        <div className="col-md-6">
                        <label className="form-label text-dark">Price Per Night (LKR) *</label>
                        <div className="input-group border rounded">
                            <span className="input-group-text bg-light border-end-0">
                            <FaDollarSign className="text-primary" />
                            </span>
                            <select 
                            className="form-select border-start-0 text-dark border-0"
                            value={room.price}
                            onChange={(e) => setRoom({ ...room, price: e.target.value })}
                            >
                            <option value="">Select Price Range</option>
                            <option value="5000">LKR 5,000 - 7,500</option>
                            <option value="7500">LKR 7,500 - 10,000</option>
                            <option value="15000">LKR 15,000 - 20,000</option>
                            <option value="20000">LKR 20,000 - 25,000</option>
                            <option value="25000">LKR 25,000 - 30,000</option>
                            <option value="30000">LKR 30,000 - 40,000</option>
                            </select>
                        </div>
                        </div>

                        <div className="col-md-6">
                        <label className="form-label text-dark">Capacity (Persons) *</label>
                        <select 
                            className="form-select text-dark border"
                            value={room.capacity}
                            onChange={(e) => setRoom({ ...room, capacity: e.target.value })}
                        >
                            <option value="">Select Capacity</option>
                            <option value="1">1 Person</option>
                            <option value="2">2 Persons</option>
                            <option value="3">3 Persons</option>
                            <option value="4">4 Persons</option>
                            <option value="5">5 Persons</option>
                            <option value="6">6+ Persons</option>
                        </select>
                        </div>

                        <div className="col-md-6">
                        <label className="form-label text-dark">Room Size</label>
                        <select 
                            className="form-select text-dark border"
                            value={room.size}
                            onChange={(e) => setRoom({ ...room, size: e.target.value })}
                        >
                            <option value="">Select Room Size</option>
                            <option value="250 sq ft">Small (250-300 sq ft)</option>
                            <option value="350 sq ft">Medium (350-400 sq ft)</option>
                            <option value="450 sq ft">Large (450-500 sq ft)</option>
                            <option value="550 sq ft">Extra Large (550-600 sq ft)</option>
                            <option value="650 sq ft">Suite (650-800 sq ft)</option>
                            <option value="850 sq ft">Premium Suite (850-1000 sq ft)</option>
                            <option value="1000 sq ft">Luxury Suite (1000+ sq ft)</option>
                        </select>
                        </div>
                      </div>
                      
                      <div className="border-top mt-3 pt-3">
                        <button 
                          type="button" 
                          className="btn btn-outline-primary border"
                          onClick={handleAddRoom}
                          disabled={!room.type || !room.price || !room.capacity}
                        >
                          <FaPlus className="me-2" />
                          Add Room Type
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Display Current Room Types */}
                  {hotelData.roomTypes.length > 0 && (
                    <div className="mt-4">
                      <div className="card border">
                        <div className="card-header bg-light border-bottom">
                          <h6 className="mb-0 text-dark">Current Room Types ({hotelData.roomTypes.length})</h6>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            {hotelData.roomTypes.map((r, i) => (
                              <div key={i} className="col-md-6">
                                <div className="card border shadow-sm h-100">
                                  <div className="card-header bg-light border-bottom py-2">
                                    <div className="d-flex justify-content-between align-items-center">
                                      <h6 className="mb-0 text-dark">{r.type}</h6>
                                      <button 
                                        type="button"
                                        className="btn btn-sm btn-outline-danger border"
                                        onClick={() => handleRemoveRoom(i)}
                                      >
                                        <FaTrash />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="card-body">
                                    <div className="row small text-dark">
                                      <div className="col-6">
                                        <strong>Price:</strong> LKR {r.price}
                                      </div>
                                      <div className="col-6">
                                        <strong>Capacity:</strong> {r.capacity} persons
                                      </div>
                                      <div className="col-6">
                                        <strong>Size:</strong> {r.size}
                                      </div>
                                      
                                     
                                    </div>
                                  </div>
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
                        onClick={() => navigate("/dashboard/admin/hotels")}
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
                            Adding Hotel...
                          </>
                        ) : (
                          <>
                            <FaSave className="me-2" />
                            Add Hotel
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