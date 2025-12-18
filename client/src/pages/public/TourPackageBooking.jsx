import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaCreditCard,
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaHotel,
  FaCar,
  FaUtensils,
} from "react-icons/fa";

const TourPackageBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tour, setTour] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [total, setTotal] = useState(0);
  const [days, setDays] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Calculate today's date for min date input
  const today = new Date().toISOString().split("T")[0];

  // Fetch package details
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/tour-packages/${id}`);
        setTour(res.data);
      } catch (err) {
        console.log("Fetch package error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [id]);

  // Calculate total amount and days
  useEffect(() => {
    if (tour && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const durationDays = Math.ceil((end - start) / (1000 * 3600 * 24));

      if (durationDays > 0) {
        setDays(durationDays);
        setTotal(durationDays * tour.price * guests);
      } else {
        setDays(0);
        setTotal(0);
      }
    }
  }, [startDate, endDate, guests, tour]);

  const handleBooking = async () => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    if (!token) {
      alert("Please login to book this tour package!");
      navigate("/login");
      return;
    }

    if (!startDate || !endDate) {
      alert("Please select a date");
      return;
    }

    if (days <= 0) {
      alert("End date must be after start date");
      return;
    }

    try {
      setBookingLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/tour-packages/book",
        {
          packageId: id,
          startDate,
          endDate,
          guests,
          totalAmount: total,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      alert(res.data.message);
      navigate(res.data.redirect || "/payment");

    } catch (error) {
      console.error("Booking Error:", error);
      alert(error.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  const calculateMinEndDate = () => {
    if (!startDate) return today;
    const nextDay = new Date(startDate);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay.toISOString().split("T")[0];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading tour package details...</p>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <h3>Tour package not found</h3>
          <Link to="/tour-packages" className="btn btn-primary mt-3">
            <FaArrowLeft className="me-2" />
            Back to Tour Packages
          </Link>
        </div>
      </div>
    );
  }

  const mainImage = tour.images && tour.images.length > 0
    ? `http://localhost:5000${tour.images[0]}`
    : tour.image || "/placeholder.jpg";

  return (
    <div className="tour-booking-page">
      {/* Navigation Header */}
      <div className="container py-3" style={{ backgroundColor: 'white' }}>
        <div className="row align-items-center">
          <div className="col">
            <Link to={`/tour-packages/${tour.id}`} className="btn btn-outline-primary btn-sm">
              <FaArrowLeft className="me-2" />
              Back to Tour Details
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row">
          {/* Tour Package Details Column */}
          <div className="col-lg-7 mb-4 mb-lg-0">
            <div className="booking-card-left">
              <div className="card border-0 shadow-sm rounded-3 mb-4">
                <div className="card-header bg-white py-4">
                  <h2 className="fw-bold mb-0">Complete Your Tour Booking</h2>
                  <p className="text-muted mb-0">Please review your tour package details</p>
                </div>
                
                <div className="card-body p-4">
                  {/* Tour Package Summary */}
                  <div className="tour-summary mb-4 p-4 border rounded-3">
                    <div className="row align-items-center">
                      <div className="col-md-4 mb-3 mb-md-0">
                        <img
                          src={mainImage}
                          alt={tour.name || tour.title}
                          className="img-fluid rounded-3 tour-preview-image"
                        />
                      </div>
                      <div className="col-md-8">
                        <h4 className="fw-bold mb-2">{tour.name || tour.title}</h4>
                        <div className="d-flex align-items-center gap-3 mb-2 flex-wrap">
                          <div className="d-flex align-items-center text-muted">
                            <FaMapMarkerAlt className="me-2" size={14} />
                            <small>{tour.location}</small>
                          </div>
                          {tour.rating && (
                            <div className="d-flex align-items-center">
                              <FaStar className="text-warning me-1" size={14} />
                              <small className="fw-semibold">{tour.rating}</small>
                            </div>
                          )}
                          {tour.duration && (
                            <div className="d-flex align-items-center">
                              <FaClock className="text-primary me-1" size={14} />
                              <small>{tour.duration} days</small>
                            </div>
                          )}
                        </div>
                        <p className="text-muted mb-3">{tour.description || "Experience an amazing tour adventure"}</p>
                        
                        {/* Quick Features */}
                        <div className="d-flex gap-3 flex-wrap">
                          <div className="d-flex align-items-center">
                            <FaUsers className="text-primary me-2" />
                            <small>Group Tour</small>
                          </div>
                          {tour.includesHotel && (
                            <div className="d-flex align-items-center">
                              <FaHotel className="text-primary me-2" />
                              <small>Hotel Included</small>
                            </div>
                          )}
                          {tour.includesTransport && (
                            <div className="d-flex align-items-center">
                              <FaCar className="text-primary me-2" />
                              <small>Transport</small>
                            </div>
                          )}
                          {tour.includesMeals && (
                            <div className="d-flex align-items-center">
                              <FaUtensils className="text-primary me-2" />
                              <small>Meals</small>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Form */}
                  <div className="booking-form-section">
                    <h4 className="fw-bold mb-4">
                      <FaCalendarAlt className="me-2" />
                      Select Tour Dates & Participants
                    </h4>

                    <div className="row g-4">
                      {/* Start Date */}
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label fw-semibold mb-2">
                            Tour Start Date
                          </label>
                          <div className="input-group border rounded-3">
                            <span className="input-group-text bg-light border-end-1">
                              <FaCalendarAlt className="text-primary" />
                            </span>
                            <input
                              type="date"
                              className="form-control border-start-0"
                              value={startDate}
                              min={today}
                              onChange={(e) => setStartDate(e.target.value)}
                              style={{
                                color: '#212529',
                                backgroundColor: 'white'
                              }}
                            />
                          </div>
                          {startDate && (
                            <small className="text-muted mt-1 d-block">
                              {formatDate(startDate)}
                            </small>
                          )}
                        </div>
                      </div>

                      {/* End Date */}
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label fw-semibold mb-2">
                            Tour End Date
                          </label>
                          <div className="input-group border rounded-3">
                            <span className="input-group-text bg-light border-end-1">
                              <FaCalendarAlt className="text-primary" />
                            </span>
                            <input
                              type="date"
                              className="form-control border-start-0"
                              value={endDate}
                              min={calculateMinEndDate()}
                              onChange={(e) => setEndDate(e.target.value)}
                              style={{
                                color: '#212529',
                                backgroundColor: 'white'
                              }}
                            />
                          </div>
                          {endDate && (
                            <small className="text-muted mt-1 d-block">
                              {formatDate(endDate)}
                            </small>
                          )}
                        </div>
                      </div>

                      {/* Participants */}
                      <div className="col-12">
                        <div className="form-group">
                          <label className="form-label fw-semibold mb-2">
                            <FaUsers className="me-2" />
                            Number of Participants
                          </label>
                          <div className="d-flex align-items-center">
                            <button
                              className="btn btn-outline-primary rounded-circle"
                              onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                              disabled={guests <= 1}
                              style={{ width: '40px', height: '40px' }}
                            >
                              -
                            </button>
                            <div className="mx-3 fw-bold fs-5" style={{ minWidth: '50px', textAlign: 'center' }}>
                              {guests}
                            </div>
                            <button
                              className="btn btn-outline-primary rounded-circle"
                              onClick={() => setGuests(prev => prev + 1)}
                              style={{ width: '40px', height: '40px' }}
                            >
                              +
                            </button>
                            <span className="ms-3 text-muted">
                              {guests} {guests === 1 ? 'participant' : 'participants'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Duration Summary */}
                      {(startDate && endDate && days > 0) && (
                        <div className="col-12">
                          <div className="alert alert-info">
                            <div className="d-flex justify-content-between align-items-center">
                              <span>
                                <strong>{days} day{days !== 1 ? 's' : ''}</strong> tour
                              </span>
                              <span>
                                {formatDate(startDate)} → {formatDate(endDate)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary Column */}
          <div className="col-lg-5">
            <div className="booking-summary-card">
              <div className="card border-0 shadow-lg rounded-3 booking-sticky-summary" style={{ top: '100px' }}>
                <div className="card-header bg-primary text-white py-4 rounded-top-3">
                  <h3 className="fw-bold mb-0">
                    <FaCreditCard className="me-2" />
                    Booking Summary
                  </h3>
                </div>
                
                <div className="card-body p-4">
                  {/* Price Breakdown */}
                  <div className="price-breakdown mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">Price per day</span>
                      <span className="fw-semibold">LKR {tour.price?.toLocaleString()}</span>
                    </div>
                    
                    {days > 0 && (
                      <>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted">
                            {days} day{days !== 1 ? 's' : ''} × LKR  {tour.price?.toLocaleString()}
                          </span>
                          <span className="fw-semibold">LKR {(tour.price * days).toLocaleString()}</span>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted">
                            {guests} participant{guests !== 1 ? 's' : ''}
                          </span>
                          <span className="fw-semibold">× {guests}</span>
                        </div>
                      </>
                    )}
                    
                    <hr />
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold fs-5">Total Amount</span>
                      <span className="fw-bold fs-4 text-primary">LKR {total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Book Now Button */}
                  <button
                    onClick={handleBooking}
                    disabled={!startDate || !endDate || days <= 0 || bookingLoading}
                    className="btn btn-primary btn-lg w-100 py-3 mb-3"
                  >
                    {bookingLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaCreditCard className="me-2" />
                        Confirm Tour Booking
                      </>
                    )}
                  </button>

                  {/* Terms and Conditions */}
                  <div className="terms-conditions mt-4 pt-3 border-top">
                    <p className="small text-muted text-center">
                      By completing this booking, you agree to our Terms & Conditions and Privacy Policy. 
                      Your booking confirmation will be sent via email.
                    </p>
                    
                    <div className="text-center">
                      <img
                        src="https://img.icons8.com/color/48/000000/visa.png"
                        alt="Visa"
                        className="payment-icon mx-2"
                      />
                      <img
                        src="https://img.icons8.com/color/48/000000/mastercard.png"
                        alt="Mastercard"
                        className="payment-icon mx-2"
                      />
                      <img
                        src="https://img.icons8.com/color/48/000000/amex.png"
                        alt="Amex"
                        className="payment-icon mx-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .tour-booking-page {
          font-family: 'Inter', sans-serif;
          background: white;
          min-height: 100vh;
        }

        .tour-preview-image {
          height: 180px;
          width: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .tour-summary:hover .tour-preview-image {
          transform: scale(1.05);
        }

        .tour-summary {
          transition: all 0.3s ease;
          background: #f8f9fa;
        }

        .tour-summary:hover {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
          background: white;
        }

        .tour-inclusions {
          background: linear-gradient(135deg, #f8f9fa, #e3f2fd);
          border: 1px solid #bbdefb;
        }

        .tour-inclusions:hover {
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .booking-sticky-summary {
          position: sticky;
          top: 100px;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .booking-summary-card .card {
          background: linear-gradient(135deg, #ffffff, #f8f9fa);
          border: 1px solid #e3f2fd;
        }

        .price-breakdown {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #00796b, #004d40);
          border: none;
          transition: all 0.3s ease;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 121, 107, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-outline-primary {
          border-color: #00796b;
          color: #00796b;
          transition: all 0.3s ease;
        }

        .btn-outline-primary:hover:not(:disabled) {
          background: #00796b;
          color: white;
          transform: translateY(-2px);
        }

        .security-assurance {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
        }

        .security-assurance:hover {
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .payment-icon {
          width: 40px;
          height: 40px;
          transition: transform 0.3s ease;
        }

        .payment-icon:hover {
          transform: scale(1.1);
        }

        /* Form input styling */
        .form-control {
          color: #212529 !important;
        }

        .form-control:focus {
          border-color: #00796b !important;
          box-shadow: 0 0 0 0.2rem rgba(0, 121, 107, 0.25) !important;
        }

        /* Alert styling */
        .alert-info {
          background: linear-gradient(135deg, #e3f2fd, #bbdefb);
          border-color: #90caf9;
          color: #1565c0;
        }

        /* Responsive Design */
        @media (max-width: 992px) {
          .booking-sticky-summary {
            position: static;
            margin-top: 2rem;
          }
          
          .tour-preview-image {
            height: 150px;
          }
        }

        @media (max-width: 768px) {
          .tour-preview-image {
            height: 200px;
          }
          
          .tour-summary .row {
            flex-direction: column;
          }
          
          .tour-summary .col-md-4 {
            margin-bottom: 1rem;
          }
        }

        @media (max-width: 576px) {
          .tour-preview-image {
            height: 150px;
          }
          
          .booking-form-section .col-md-6 {
            margin-bottom: 1rem;
          }
          
          .tour-inclusions .col-md-6,
          .security-assurance .col-md-6 {
            margin-bottom: 0.5rem;
          }
        }

        /* Loading Animation */
        .spinner-border {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Accessibility */
        .btn:focus,
        .form-control:focus {
          outline: 2px solid #00796b;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default TourPackageBooking;