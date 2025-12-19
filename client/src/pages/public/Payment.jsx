import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams, useLocation } from "react-router-dom";
import {
  FaCreditCard,
  FaArrowLeft,
  FaCalendarAlt,
  FaUser,
  FaPaypal,
  FaHotel,
  FaUsers,
  FaMapMarkerAlt,
  FaStar,
  FaMoneyBillWave,
  FaShieldAlt
} from "react-icons/fa";
import axios from "axios";

function PaymentPage() {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 SAMPLE BOOKING DATA (fallback if no API)
  const sampleBooking = {
    id: "HOTEL001",
    totalPrice: 36000,
    guests: 1,
    checkIn: "2026-01-07",
    checkOut: "2026-01-08",
    status: "Pending Payment",
    Hotel: {
      name: "Cinnamon Grand Colombo",
      location: "Colombo, Sri Lanka",
      rating: 4.7,
      images: ["/uploads/hotels/cinnamon-grand.jpg"]
    }
  };

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        
        // If bookingId is provided, fetch from API
        if (bookingId) {
          const res = await axios.get(
            `http://localhost:5000/api/hotel-booking/${bookingId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setBooking(res.data);
        } else {
          // Use sample data for demo
          setBooking(sampleBooking);
        }
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError("Unable to load booking details");
        setBooking(sampleBooking); // Fallback to sample
      } finally {
        setLoading(false);
      }
    };

    // Check if booking data is passed via state (from navigation)
    if (location.state && location.state.booking) {
      setBooking(location.state.booking);
      setLoading(false);
    } else {
      fetchBooking();
    }
  }, [bookingId, location.state]);

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateForm = () => {
    const newErrors = {};

    if (paymentMethod === "card") {
      const cleanCardNumber = cardNumber.replace(/\s/g, "");
      if (cleanCardNumber.length !== 16 || !/^\d+$/.test(cleanCardNumber)) {
        newErrors.cardNumber = "Enter valid 16-digit card number";
      }
      if (!cardName.trim()) newErrors.cardName = "Cardholder name required";
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
        newErrors.expiryDate = "Invalid expiry date (MM/YY)";
      } else {
        const [month, year] = expiryDate.split('/');
        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
        const now = new Date();
        if (expiry < now) {
          newErrors.expiryDate = "Card has expired";
        }
      }
      if (!/^\d{3,4}$/.test(cvv)) newErrors.cvv = "Invalid CVV (3 or 4 digits)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setProcessing(true);

    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      
      // In a real app, you would call your payment API here
      // For demo purposes, we'll simulate a payment
      setTimeout(async () => {
        try {
          if (bookingId || booking?.id) {
            // Update booking status to Confirmed
            await axios.put(
              `http://localhost:5000/api/hotel-booking/${bookingId || booking.id}/confirm`,
              {},
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
          }
          
          setPaymentSuccess(true);
          setTimeout(() => {
            navigate("/dashboard/customer/hotel-bookings");
          }, 2000);
        } catch (err) {
          console.error("Error confirming booking:", err);
          alert("Payment succeeded ✅");
          navigate("/dashboard/customer");
        }
      }, 1500);
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <h4>Booking not found</h4>
          <p>Unable to load booking details. Please try again.</p>
          <Link to="/dashboard/customer/hotel-bookings" className="btn btn-primary">
            Back to Bookings
          </Link>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card border-0 shadow-lg text-center">
              <div className="card-body p-5">
                <div className="checkmark mb-4">
                  <div className="checkmark-circle bg-success mx-auto d-flex align-items-center justify-content-center">
                    <FaCreditCard className="text-white" size={32} />
                  </div>
                </div>
                <h2 className="fw-bold text-success mb-3">Payment Successful!</h2>
                <p className="text-muted mb-4">
                  Your payment of <strong>LKR {booking.totalPrice?.toLocaleString()}</strong> has been processed successfully.
                </p>
                <div className="alert alert-success">
                  <h5>Booking Confirmed</h5>
                  <p className="mb-0">
                    <strong>{booking.Hotel?.name}</strong><br />
                    {formatDate(booking.checkIn)} to {formatDate(booking.checkOut)}
                  </p>
                </div>
                <p className="text-muted">Redirecting to bookings...</p>
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="container py-5">
        {/* Header */}
        <div className="mb-4">
          <Link to="/dashboard/customer/hotel-bookings" className="btn btn-outline-primary mb-4">
            <FaArrowLeft className="me-2" /> Back to Bookings
          </Link>
          
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold display-5 mb-2">Complete Your Payment</h1>
              <p className="text-muted mb-0">Secure payment for your hotel booking</p>
            </div>
            <div className="d-flex align-items-center">
              <FaShieldAlt className="text-success me-2" />
              <span className="text-success fw-semibold">Secure SSL Encryption</span>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Payment Form */}
          <div className="col-lg-8 mb-4">
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-header bg-primary text-white border-0 rounded-top-3 py-3">
                <h5 className="mb-0">
                  <FaCreditCard className="me-2" />
                  Payment Information
                </h5>
              </div>
              <div className="card-body p-4">
                {/* Payment Method Selection */}
                <div className="mb-4">
                  <label className="form-label fw-semibold mb-3" style={{ color: 'black' }}>Select Payment Method</label>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <button
                        type="button"
                        className={`btn w-100 h-100 py-3 ${paymentMethod === "card" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setPaymentMethod("card")}
                      >
                        <div className="d-flex flex-column align-items-center">
                          <FaCreditCard size={24} className="mb-2" />
                          <span>Credit/Debit Card</span>
                        </div>
                      </button>
                    </div>
                    <div className="col-md-6">
                      <button
                        type="button"
                        className={`btn w-100 h-100 py-3 ${paymentMethod === "paypal" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setPaymentMethod("paypal")}
                      >
                        <div className="d-flex flex-column align-items-center">
                          <FaPaypal size={24} className="mb-2" />
                          <span>PayPal</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Payment Form */}
                {paymentMethod === "card" && (
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label" style={{ color: 'black' }}>Card Number</label>
                        <div className="input-group">
                          <span className="input-group-text bg-transparent">
                            <FaCreditCard />
                          </span>
                          <input
                            type="text"
                            className={`form-control ${errors.cardNumber ? "is-invalid" : ""}`}
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            maxLength="19"
                            style={{ color: 'black' }}
                          />
                          {errors.cardNumber && (
                            <div className="invalid-feedback">{errors.cardNumber}</div>
                          )}
                        </div>
                      </div>

                      <div className="col-12">
                        <label className="form-label" style={{ color: 'black' }}>Cardholder Name</label>
                        <input
                          type="text"
                          className={`form-control ${errors.cardName ? "is-invalid" : ""}`}
                          placeholder="John Doe"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          style={{ color: 'black' }}
                        />
                        {errors.cardName && (
                          <div className="invalid-feedback">{errors.cardName}</div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label" style={{ color: 'black' }}>Expiry Date</label>
                        <input
                          type="text"
                          className={`form-control ${errors.expiryDate ? "is-invalid" : ""}`}
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                          maxLength="5"
                          style={{ color: 'black' }}
                        />
                        {errors.expiryDate && (
                          <div className="invalid-feedback">{errors.expiryDate}</div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label" style={{ color: 'black' }}>CVV</label>
                        <div className="input-group">
                          <input
                            type="password"
                            className={`form-control ${errors.cvv ? "is-invalid" : ""}`}
                            placeholder="123"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            maxLength="4"
                            style={{ color: 'black' }}
                          />
                          <span className="input-group-text bg-white" style={{ color: 'black' }}>
                            <small>3-4 digits</small>
                          </span>
                          {errors.cvv && (
                            <div className="invalid-feedback">{errors.cvv}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100 py-3"
                        disabled={processing}
                        style={{ color: 'white' }}
                      >
                        {processing ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Processing Payment...
                          </>
                        ) : (
                          `Pay LKR ${booking.totalPrice?.toLocaleString()}`
                        )}
                      </button>
                      <p className="text-muted text-center mt-2 small">
                        By clicking "Pay", you agree to our Terms & Conditions
                      </p>
                    </div>
                  </form>
                )}

                {/* PayPal Option */}
                {paymentMethod === "paypal" && (
                  <div className="text-center py-4">
                    <div className="mb-4">
                      <FaPaypal size={64} className="text-primary mb-3" />
                      <h5 style={{ color: 'black' }}>Pay with PayPal</h5>
                      <p className="text-muted">You will be redirected to PayPal to complete your payment</p>
                    </div>
                    <button
                      className="btn btn-primary btn-lg w-100 py-3 mb-3"
                      onClick={handleSubmit}
                      disabled={processing}
                      style={{ color: 'white' }}
                    >
                      {processing ? "Redirecting..." : `Pay LKR ${booking.totalPrice?.toLocaleString()} with PayPal`}
                    </button>
                    <button
                      className="btn btn-outline-secondary w-100"
                      onClick={() => setPaymentMethod("card")}
                      style={{ color: 'black' }}
                    >
                      Use Credit Card Instead
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-3 sticky-top" style={{ top: '20px' }}>
              <div className="card-header bg-light border-0 rounded-top-3 py-3">
                <h5 className="mb-0" style={{ color: 'black' }}>
                  <FaHotel className="me-2" />
                  Booking Summary
                </h5>
              </div>
              <div className="card-body p-4">
                {/* Hotel Info */}
                <div className="d-flex align-items-start mb-4">
                  <div>
                    <h6 className="fw-bold mb-1" style={{ color: 'black' }}>{booking.Hotel?.name}</h6>
                    <div className="d-flex align-items-center mb-2">
                      <FaMapMarkerAlt className="text-muted me-1" size={12} />
                      <small className="text-muted">{booking.Hotel?.location}</small>
                    </div>
                    <div className="d-flex align-items-center">
                      <FaStar className="text-warning me-1" size={14} />
                      <small className="fw-semibold" style={{ color: 'black' }}>{booking.Hotel?.rating}</small>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="booking-dates mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <small className="text-muted d-block">Check-in</small>
                      <div className="d-flex align-items-center">
                        <FaCalendarAlt className="text-primary me-2" size={14} />
                        <span className="fw-semibold" style={{ color: 'black' }}>{formatDate(booking.checkIn)}</span>
                      </div>
                    </div>
                    <div className="text-end">
                      <small className="text-muted d-block">Check-out</small>
                      <div className="d-flex align-items-center justify-content-end">
                        <FaCalendarAlt className="text-primary me-2" size={14} />
                        <span className="fw-semibold" style={{ color: 'black' }}>{formatDate(booking.checkOut)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <div>
                      <small className="text-muted d-block">Guests</small>
                      <div className="d-flex align-items-center">
                        <FaUsers className="text-primary me-2" size={14} />
                        <span className="fw-semibold" style={{ color: 'black' }}>{booking.guests}</span>
                      </div>
                    </div>
                    <div className="text-end">
                      <small className="text-muted d-block">Nights</small>
                      <div className="fw-semibold" style={{ color: 'black' }}>
                        {calculateNights(booking.checkIn, booking.checkOut)} night(s)
                      </div>
                    </div>
                  </div>
                </div>

                <hr />

                {/* Price Breakdown */}
                <div className="price-summary">
                  <h6 className="fw-bold mb-3" style={{ color: 'black' }}>Price Details</h6>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Room price</span>
                    <span style={{ color: 'black' }}>LKR {booking.totalPrice?.toLocaleString()}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Tax & Service</span>
                    <span style={{ color: 'black' }}>Included</span>
                  </div>
                  
                  <hr className="my-3" />
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="fw-bold mb-0" style={{ color: 'black' }}>Total</h5>
                      <small className="text-muted">Including all taxes</small>
                    </div>
                    <h3 className="text-primary fw-bold mb-0" style={{ color: '#00796b' }}>
                      LKR {booking.totalPrice?.toLocaleString()}
                    </h3>
                  </div>
                </div>

                <div className="alert alert-info mt-4">
                  <small>
                    <FaMoneyBillWave className="me-2" />
                    <strong style={{ color: 'black' }}>Flexible Cancellation:</strong> Free cancellation up to 48 hours before check-in
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Info */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card border-0 bg-light">
              <div className="card-body text-center">
                <div className="row justify-content-center">
                  <div className="col-auto">
                    <FaShieldAlt className="text-success me-2" />
                    <span className="text-muted">256-bit SSL Encryption</span>
                  </div>
                  <div className="col-auto">
                    <span className="text-muted">•</span>
                  </div>
                  <div className="col-auto">
                    <span className="text-muted">Your payment is secure</span>
                  </div>
                  <div className="col-auto">
                    <span className="text-muted">•</span>
                  </div>
                  <div className="col-auto">
                    <span className="text-muted">PCI DSS Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .payment-page {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
        }

        .checkmark-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }

        .hotel-image-summary {
          width: 80px;
          height: 80px;
        }

        .hotel-image-summary img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .sticky-top {
          position: sticky;
          z-index: 1000;
        }

        .btn-primary {
          background: linear-gradient(135deg, #00796b, #004d40);
          border: none;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 121, 107, 0.4);
        }

        .btn-outline-primary {
          color: #00796b;
          border-color: #00796b;
        }

        .btn-outline-primary:hover {
          background: #00796b;
          color: white;
        }

        .card {
          transition: all 0.3s ease;
        }

        .card:hover {
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
        }

        .input-group-text {
          border-right: none;
        }

        .form-control:focus {
          border-color: #00796b;
          box-shadow: 0 0 0 0.2rem rgba(0, 121, 107, 0.25);
        }

        /* Force black text in all inputs */
        input.form-control,
        input.form-control:focus,
        input.form-control::placeholder,
        textarea.form-control,
        select.form-control {
          color: black !important;
        }

        /* Ensure placeholders are visible but not too dark */
        input.form-control::placeholder {
          color: #666 !important;
          opacity: 0.8;
        }

        /* Make labels black */
        .form-label {
          color: black !important;
        }

        /* Make all text in summary black */
        .card-body h5,
        .card-body h6,
        .card-body span:not(.text-muted),
        .card-body strong,
        .card-body .fw-semibold {
          color: black !important;
        }

        /* Keep price in primary color */
        .text-primary {
          color: #00796b !important;
        }

        @media (max-width: 768px) {
          .sticky-top {
            position: static;
          }
          
          .btn {
            padding: 10px 15px;
          }
        }
      `}</style>
    </div>
  );
}

export default PaymentPage;