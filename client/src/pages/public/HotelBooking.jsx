import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaUser,
  FaCreditCard,
  FaStar,
  FaMapMarkerAlt,
  FaBed,
  FaWifi
} from "react-icons/fa";

function HotelBooking() {
  const navigate = useNavigate();
  const { id } = useParams();


  const [hotel, setHotel] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [total, setTotal] = useState(0);
  const [nights, setNights] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Calculate today's date for min date input
  const today = new Date().toISOString().split("T")[0];

  // Fetch selected hotel data
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/hotels/${id}`);
        setHotel(res.data);
      } catch (err) {
        console.error("Error fetching hotel:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  // Calculate total amount and nights
  useEffect(() => {
    if (hotel && checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const days = Math.ceil((end - start) / (1000 * 3600 * 24));

      if (days > 0) {
        setNights(days);
        setTotal(days * hotel.price * guests);
      } else {
        setNights(0);
        setTotal(0);
      }
    }
  }, [checkIn, checkOut, guests, hotel]);

  const handleBooking = async () => {
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }

    if (nights <= 0) {
      alert("Check-out date must be after check-in date");
      return;
    }

    try {
      setBookingLoading(true);


    const token =localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

      if (!token) {
        alert("Please login to book a hotel");
        navigate("/login");
        return;
      }

      await axios.post(
        `http://localhost:5000/api/hotel-booking/hotel`,
        {
          hotelId: id,
          checkIn,
          checkOut,
          guests,
          totalAmount: total,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Hotel booked successfully!");
      navigate("/payment");
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  const calculateMinCheckout = () => {
    if (!checkIn) return today;
    const nextDay = new Date(checkIn);
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
          <p className="mt-2">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <h3>Hotel not found</h3>
          <Link to="/hotels" className="btn btn-primary mt-3">
            <FaArrowLeft className="me-2" />
            Back to Hotels
          </Link>
        </div>
      </div>
    );
  }

  const mainImage = hotel.images && hotel.images.length > 0
    ? `http://localhost:5000${hotel.images[0]}`
    : "/placeholder.jpg";

  return (
    <div className="hotel-booking-page">
      {/* Navigation Header */}
      <div className="container py-3" style={{ backgroundColor: 'white' }}>
        <div className="row align-items-center">
          <div className="col">
            <Link to={`/hotels/${hotel.id}`} className="btn btn-outline-primary btn-sm">
              <FaArrowLeft className="me-2" />
              Back to Hotel Details
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row">
          {/* Hotel Details Column */}
          <div className="col-lg-7 mb-4 mb-lg-0">
            <div className="booking-card-left">
              <div className="card border-0 shadow-sm rounded-3 mb-4">
                <div className="card-header bg-white py-4">
                  <h2 className="fw-bold mb-0">Complete Your Booking</h2>
                  <p className="text-muted mb-0">Please review your booking details</p>
                </div>
                
                <div className="card-body p-4">
                  {/* Hotel Summary */}
                  <div className="hotel-summary mb-4 p-4 border rounded-3">
                    <div className="row align-items-center">
                      <div className="col-md-4 mb-3 mb-md-0">
                        <img
                          src={mainImage}
                          alt={hotel.name}
                          className="img-fluid rounded-3 hotel-preview-image"
                        />
                      </div>
                      <div className="col-md-8">
                        <h4 className="fw-bold mb-2">{hotel.name}</h4>
                        <div className="d-flex align-items-center gap-3 mb-2 flex-wrap">
                          <div className="d-flex align-items-center text-muted">
                            <FaMapMarkerAlt className="me-2" size={14} />
                            <small>{hotel.location}</small>
                          </div>
                          <div className="d-flex align-items-center">
                            <FaStar className="text-warning me-1" size={14} />
                            <small className="fw-semibold">{hotel.rating || "N/A"}</small>
                          </div>
                        </div>
                        <p className="text-muted mb-3">{hotel.description}</p>
                        
                        {/* Quick Amenities */}
                        <div className="d-flex gap-3">
                          <div className="d-flex align-items-center">
                            <FaBed className="text-primary me-2" />
                            <small>Comfortable Beds</small>
                          </div>
                          <div className="d-flex align-items-center">
                            <FaWifi className="text-primary me-2" />
                            <small>Free WiFi</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Form */}
                  <div className="booking-form-section">
                    <h4 className="fw-bold mb-4">
                      <FaCalendarAlt className="me-2" />
                      Select Dates & Guests
                    </h4>

                    <div className="row g-4">
                      {/* Check-in Date */}
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label fw-semibold mb-2">
                            Check-In Date
                          </label>
                          <div className="input-group border rounded-3">
                            <span className="input-group-text bg-light border-end-1">
                              <FaCalendarAlt className="text-primary" />
                            </span>
                            <input
                              type="date"
                              className="form-control border-start-0"
                              value={checkIn}
                              min={today}
                              onChange={(e) => setCheckIn(e.target.value)}
                              style={{
                                    color: '#212529',
                                    backgroundColor: 'white'
                                }}
                            />
                          </div>
                          {checkIn && (
                            <small className="text-muted mt-1 d-block">
                              {formatDate(checkIn)}
                            </small>
                          )}
                        </div>
                      </div>

                      {/* Check-out Date */}
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label fw-semibold mb-2">
                            Check-Out Date
                          </label>
                          <div className="input-group border rounded-3">
                            <span className="input-group-text bg-light border-end-1">
                              <FaCalendarAlt className="text-primary" />
                            </span>
                            <input
                              type="date"
                              className="form-control border-start-0"
                              value={checkOut}
                              min={calculateMinCheckout()}
                              onChange={(e) => setCheckOut(e.target.value)}
                              style={{
                                    color: '#212529',
                                    backgroundColor: 'white'
                                }}
                            />
                          </div>
                          {checkOut && (
                            <small className="text-muted mt-1 d-block">
                              {formatDate(checkOut)}
                            </small>
                          )}
                        </div>
                      </div>

                      {/* Guests */}
                      <div className="col-12">
                        <div className="form-group">
                          <label className="form-label fw-semibold mb-2">
                            <FaUser className="me-2" />
                            Number of Guests
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
                              {guests} {guests === 1 ? 'guest' : 'guests'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Duration Summary */}
                      {(checkIn && checkOut && nights > 0) && (
                        <div className="col-12">
                          <div className="alert alert-info">
                            <div className="d-flex justify-content-between align-items-center">
                              <span>
                                <strong>{nights} night{nights !== 1 ? 's' : ''}</strong> stay
                              </span>
                              <span>
                                {formatDate(checkIn)} → {formatDate(checkOut)}
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
              <div className="card border-0 shadow-lg rounded-3  booking-sticky-summary" style={{ top: '100px' }}>
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
                      <span className="text-muted">Price per night</span>
                      <span className="fw-semibold">LKR {hotel.price?.toLocaleString()}</span>
                    </div>
                    
                    {nights > 0 && (
                      <>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted">
                            {nights} night{nights !== 1 ? 's' : ''} × LKR {hotel.price?.toLocaleString()}
                          </span>
                          <span className="fw-semibold">LKR {(hotel.price * nights).toLocaleString()}</span>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted">
                            {guests} guest{guests !== 1 ? 's' : ''}
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
                    disabled={!checkIn || !checkOut || nights <= 0 || bookingLoading}
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
                        Confirm Booking
                      </>
                    )}
                  </button>

                  {/* Terms and Conditions */}
                  <div className="terms-conditions mt-4 pt-3 border-top">
                    <p className="small text-muted text-center">
                      By completing this booking, you agree to our Terms & Conditions and Privacy Policy. 
                      Your booking will be confirmed instantly.
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
        .hotel-booking-page {
          font-family: 'Inter', sans-serif;
          background: white;
          min-height: 100vh;
        }

        .hotel-preview-image {
          height: 180px;
          width: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .hotel-summary:hover .hotel-preview-image {
          transform: scale(1.05);
        }

        .hotel-summary {
          transition: all 0.3s ease;
          background: #f8f9fa;
        }

        .hotel-summary:hover {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
          background: white;
        }

        .form-control:focus {
          border-color: #00796b;
          box-shadow: 0 0 0 0.2rem rgba(0, 121, 107, 0.25);
        }

        .input-group-text {
          background: #f8f9fa;
          border-color: #dee2e6;
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

        .btn-outline-primary:hover {
          background: #00796b;
          color: white;
          transform: translateY(-2px);
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

        /* Guest counter buttons */
        .btn-outline-primary.rounded-circle {
          border-radius: 50% !important;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Responsive Design */
        @media (max-width: 992px) {
          .sticky-top {
            position: static;
            margin-top: 2rem;
          }
          
          .hotel-preview-image {
            height: 150px;
          }
        }

        @media (max-width: 768px) {
          .hotel-preview-image {
            height: 200px;
          }
          
          .hotel-summary .row {
            flex-direction: column;
          }
          
          .hotel-summary .col-md-4 {
            margin-bottom: 1rem;
          }
        }

        @media (max-width: 576px) {
          .hotel-preview-image {
            height: 150px;
          }
          
          .booking-form-section .col-md-6 {
            margin-bottom: 1rem;
          }
          
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

        /* Custom scrollbar for date inputs */
        input[type="date"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          padding: 5px;
          border-radius: 4px;
          background-color: #f8f9fa;
        }

        input[type="date"]::-webkit-calendar-picker-indicator:hover {
          background-color: #e9ecef;
        }

        /* Alert styling */
        .alert-info {
          background: linear-gradient(135deg, #e3f2fd, #bbdefb);
          border-color: #90caf9;
          color: #1565c0;
        }
      `}</style>
    </div>
  );
}

export default HotelBooking;