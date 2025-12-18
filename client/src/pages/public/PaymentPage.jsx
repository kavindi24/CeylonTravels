// src/pages/public/PaymentPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaCreditCard,
  FaLock,
  FaCheckCircle,
  FaArrowLeft,
  FaCalendarAlt,
  FaUser,
  FaShieldAlt,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaPaypal,
  FaExclamationCircle
} from 'react-icons/fa';

function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/hotel-booking/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setBooking(response.data);
      } catch (error) {
        console.error('Error fetching booking:', error);
        navigate('/dashboard/customer/bookings');
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (paymentMethod === 'card') {
      if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length !== 16) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      if (!cardName.trim()) {
        newErrors.cardName = 'Cardholder name is required';
      }
      if (!expiryDate.trim() || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
        newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      }
      if (!cvv.trim() || !/^\d{3,4}$/.test(cvv)) {
        newErrors.cvv = 'Please enter a valid CVV (3 or 4 digits)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setProcessing(true);
    
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update booking status to paid
      await axios.put(
        `http://localhost:5000/api/hotel-booking/${bookingId}/pay`,
        {
          paymentMethod,
          cardLastFour: paymentMethod === 'card' ? cardNumber.slice(-4) : null,
          amount: booking.totalPrice
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Navigate to success page
      navigate('/payment/success', { 
        state: { 
          bookingId,
          amount: booking.totalPrice,
          hotelName: booking.Hotel?.name
        }
      });
    } catch (error) {
      console.error('Payment error:', error);
      alert(error.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Header */}
            <div className="mb-4">
              <Link to="/dashboard/customer/bookings" className="btn btn-outline-primary btn-sm mb-3">
                <FaArrowLeft className="me-2" />
                Back to Bookings
              </Link>
              <h1 className="fw-bold display-5 mb-2">Complete Payment</h1>
              <p className="text-muted">Secure payment for your hotel booking</p>
            </div>

            <div className="row">
              {/* Left Column - Payment Form */}
              <div className="col-lg-7 mb-4 mb-lg-0">
                <div className="payment-card card border-0 shadow-sm rounded-3">
                  <div className="card-header bg-primary text-white py-4 rounded-top-3">
                    <h3 className="fw-bold mb-0">
                      <FaCreditCard className="me-2" />
                      Payment Details
                    </h3>
                  </div>
                  
                  <div className="card-body p-4">
                    {/* Payment Method Selection */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold mb-3">Select Payment Method</label>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div 
                            className={`payment-method-card ${paymentMethod === 'card' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('card')}
                          >
                            <div className="d-flex align-items-center">
                              <div className="payment-method-icon me-3">
                                <FaCreditCard />
                              </div>
                              <div>
                                <div className="fw-semibold">Credit/Debit Card</div>
                                <small className="text-muted">Visa, Mastercard, Amex</small>
                              </div>
                            </div>
                            {paymentMethod === 'card' && (
                              <FaCheckCircle className="text-success" />
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div 
                            className={`payment-method-card ${paymentMethod === 'paypal' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('paypal')}
                          >
                            <div className="d-flex align-items-center">
                              <div className="payment-method-icon me-3">
                                <FaPaypal />
                              </div>
                              <div>
                                <div className="fw-semibold">PayPal</div>
                                <small className="text-muted">Fast & secure</small>
                              </div>
                            </div>
                            {paymentMethod === 'paypal' && (
                              <FaCheckCircle className="text-success" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Payment Form */}
                    {paymentMethod === 'card' && (
                      <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                          <label className="form-label fw-semibold">Card Number</label>
                          <div className="input-group">
                            <span className="input-group-text bg-light">
                              <FaCreditCard />
                            </span>
                            <input
                              type="text"
                              className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                              placeholder="1234 5678 9012 3456"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                              maxLength={19}
                            />
                          </div>
                          {errors.cardNumber && (
                            <div className="invalid-feedback d-flex align-items-center">
                              <FaExclamationCircle className="me-2" />
                              {errors.cardNumber}
                            </div>
                          )}
                          <div className="d-flex gap-3 mt-2">
                            <FaCcVisa className="text-primary" size={24} />
                            <FaCcMastercard className="text-danger" size={24} />
                            <FaCcAmex className="text-info" size={24} />
                          </div>
                        </div>

                        <div className="row g-3 mb-4">
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">Cardholder Name</label>
                            <input
                              type="text"
                              className={`form-control ${errors.cardName ? 'is-invalid' : ''}`}
                              placeholder="John Doe"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                            />
                            {errors.cardName && (
                              <div className="invalid-feedback d-flex align-items-center">
                                <FaExclamationCircle className="me-2" />
                                {errors.cardName}
                              </div>
                            )}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label fw-semibold">Expiry Date</label>
                            <input
                              type="text"
                              className={`form-control ${errors.expiryDate ? 'is-invalid' : ''}`}
                              placeholder="MM/YY"
                              value={expiryDate}
                              onChange={(e) => {
                                let value = e.target.value;
                                value = value.replace(/\D/g, '');
                                if (value.length >= 2) {
                                  value = value.slice(0, 2) + '/' + value.slice(2, 4);
                                }
                                setExpiryDate(value);
                              }}
                              maxLength={5}
                            />
                            {errors.expiryDate && (
                              <div className="invalid-feedback d-flex align-items-center">
                                <FaExclamationCircle className="me-2" />
                                {errors.expiryDate}
                              </div>
                            )}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label fw-semibold">CVV</label>
                            <div className="input-group">
                              <input
                                type="password"
                                className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                                placeholder="123"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                                maxLength={4}
                              />
                              <span className="input-group-text bg-light">
                                <FaLock />
                              </span>
                            </div>
                            {errors.cvv && (
                              <div className="invalid-feedback d-flex align-items-center">
                                <FaExclamationCircle className="me-2" />
                                {errors.cvv}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Security Note */}
                        <div className="alert alert-info border-0">
                          <div className="d-flex align-items-center">
                            <FaShieldAlt className="me-3 text-success" size={20} />
                            <div>
                              <strong>Secure Payment</strong>
                              <p className="mb-0 small">Your payment information is encrypted and secure.</p>
                            </div>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg w-100 py-3"
                          disabled={processing}
                        >
                          {processing ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Processing Payment...
                            </>
                          ) : (
                            <>
                              <FaCreditCard className="me-2" />
                              Pay LKR {booking?.totalPrice?.toLocaleString()}
                            </>
                          )}
                        </button>
                      </form>
                    )}

                    {/* PayPal Option */}
                    {paymentMethod === 'paypal' && (
                      <div className="text-center py-4">
                        <FaPaypal className="text-primary mb-3" size={64} />
                        <h5 className="fw-bold mb-3">Pay with PayPal</h5>
                        <p className="text-muted mb-4">
                          You will be redirected to PayPal to complete your payment securely.
                        </p>
                        <button
                          className="btn btn-primary btn-lg px-5"
                          onClick={handleSubmit}
                          disabled={processing}
                        >
                          {processing ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Redirecting...
                            </>
                          ) : (
                            'Continue to PayPal'
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Booking Summary */}
              <div className="col-lg-5">
                <div className="summary-card card border-0 shadow-sm rounded-3 sticky-top">
                  <div className="card-header bg-light py-3">
                    <h5 className="fw-bold mb-0">Booking Summary</h5>
                  </div>
                  
                  <div className="card-body p-4">
                    {/* Hotel Info */}
                    <div className="hotel-summary mb-4">
                      <div className="d-flex align-items-center mb-3">
                        <div className="hotel-image-wrapper me-3">
                          <img
                            src={booking?.Hotel?.images?.[0] ? 
                              `http://localhost:5000${booking.Hotel.images[0]}` : 
                              '/placeholder.jpg'}
                            alt={booking?.Hotel?.name}
                            className="hotel-image rounded-3"
                          />
                        </div>
                        <div>
                          <h6 className="fw-bold mb-1">{booking?.Hotel?.name}</h6>
                          <small className="text-muted">{booking?.Hotel?.location}</small>
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="booking-details mb-4">
                      <h6 className="fw-semibold mb-3">
                        <FaCalendarAlt className="me-2" />
                        Stay Details
                      </h6>
                      <div className="row g-2 mb-3">
                        <div className="col-6">
                          <small className="text-muted d-block">Check-in</small>
                          <div className="fw-semibold">{formatDate(booking?.checkIn)}</div>
                        </div>
                        <div className="col-6">
                          <small className="text-muted d-block">Check-out</small>
                          <div className="fw-semibold">{formatDate(booking?.checkOut)}</div>
                        </div>
                      </div>
                      <div className="row g-2">
                        <div className="col-6">
                          <small className="text-muted d-block">Guests</small>
                          <div className="d-flex align-items-center">
                            <FaUser className="me-2 text-muted" size={12} />
                            <span className="fw-semibold">{booking?.guests}</span>
                          </div>
                        </div>
                        <div className="col-6">
                          <small className="text-muted d-block">Nights</small>
                          <div className="fw-semibold">
                            {booking ? 
                              Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 3600 * 24)) 
                              : 0}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="price-breakdown">
                      <h6 className="fw-semibold mb-3">Price Details</h6>
                      <div className="price-item d-flex justify-content-between mb-2">
                        <span className="text-muted">Room Rate</span>
                        <span>LKR {booking?.Hotel?.price?.toLocaleString()}</span>
                      </div>
                      <div className="price-item d-flex justify-content-between mb-2">
                        <span className="text-muted">Number of Nights</span>
                        <span>
                          {booking ? 
                            Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 3600 * 24)) 
                            : 0}
                        </span>
                      </div>
                      <div className="price-item d-flex justify-content-between mb-2">
                        <span className="text-muted">Number of Guests</span>
                        <span>{booking?.guests}</span>
                      </div>
                      <hr />
                      <div className="price-item d-flex justify-content-between mb-2">
                        <span className="text-muted">Subtotal</span>
                        <span>LKR {booking?.totalPrice?.toLocaleString()}</span>
                      </div>
                      <div className="price-item d-flex justify-content-between mb-2">
                        <span className="text-muted">Taxes & Fees</span>
                        <span>LKR 0</span>
                      </div>
                      <hr />
                      <div className="total-amount d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-bold">Total Amount</div>
                          <small className="text-muted">Including all charges</small>
                        </div>
                        <div className="text-primary fw-bold fs-4">
                          LKR {booking?.totalPrice?.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Security Badges */}
                    <div className="security-badges mt-4 pt-3 border-top">
                      <div className="row text-center">
                        <div className="col-4">
                          <FaShieldAlt className="text-success mb-2" />
                          <small className="d-block text-muted">SSL Secure</small>
                        </div>
                        <div className="col-4">
                          <FaLock className="text-success mb-2" />
                          <small className="d-block text-muted">256-bit</small>
                        </div>
                        <div className="col-4">
                          <FaCheckCircle className="text-success mb-2" />
                          <small className="d-block text-muted">Verified</small>
                        </div>
                      </div>
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
        .payment-page {
          background: #f8f9fa;
          min-height: calc(100vh - 76px);
        }

        .payment-card {
          background: white;
        }

        .payment-method-card {
          border: 2px solid #e9ecef;
          border-radius: 10px;
          padding: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .payment-method-card:hover {
          border-color: #00796b;
          background: rgba(0, 121, 107, 0.05);
        }

        .payment-method-card.active {
          border-color: #00796b;
          background: rgba(0, 121, 107, 0.1);
          box-shadow: 0 4px 15px rgba(0, 121, 107, 0.1);
        }

        .payment-method-icon {
          width: 40px;
          height: 40px;
          background: #f8f9fa;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #00796b;
          font-size: 1.25rem;
        }

        .form-control {
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 12px;
          color: #212529;
        }

        .form-control:focus {
          border-color: #00796b;
          box-shadow: 0 0 0 0.2rem rgba(0, 121, 107, 0.25);
          color: #212529;
        }

        .is-invalid {
          border-color: #dc3545;
        }

        .invalid-feedback {
          display: flex;
          align-items: center;
          margin-top: 5px;
          font-size: 0.875rem;
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

        .summary-card {
          position: sticky;
          top: 100px;
          background: white;
        }

        .hotel-image-wrapper {
          width: 80px;
          height: 80px;
        }

        .hotel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .price-breakdown .price-item {
          font-size: 0.9rem;
        }

        .price-breakdown .total-amount {
          padding: 10px;
          background: #f8f9fa;
          border-radius: 8px;
          margin-top: 10px;
        }

        .alert-info {
          background: linear-gradient(135deg, #e3f2fd, #bbdefb);
          border: none;
          border-radius: 8px;
          color: #1565c0;
        }

        .security-badges small {
          font-size: 0.75rem;
        }

        .sticky-top {
          animation: slideInUp 0.5s ease;
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

        /* Responsive Design */
        @media (max-width: 992px) {
          .summary-card {
            position: static;
            margin-top: 2rem;
          }
          
          .hotel-image-wrapper {
            width: 60px;
            height: 60px;
          }
        }

        @media (max-width: 768px) {
          .payment-method-card {
            flex-direction: column;
            text-align: center;
            padding: 12px;
          }
          
          .payment-method-icon {
            margin-bottom: 10px;
            margin-right: 0;
          }
          
          .security-badges .col-4 {
            margin-bottom: 10px;
          }
        }

        @media (max-width: 576px) {
          .hotel-image-wrapper {
            width: 50px;
            height: 50px;
          }
          
          .price-breakdown .total-amount {
            flex-direction: column;
            text-align: center;
          }
          
          .price-breakdown .total-amount .fs-4 {
            margin-top: 10px;
          }
        }

        /* Card number input formatting */
        input[type="text"]::placeholder {
          color: #6c757d;
        }

        /* Focus states for accessibility */
        .payment-method-card:focus {
          outline: 2px solid #00796b;
          outline-offset: 2px;
        }

        /* Loading animation */
        .spinner-border {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default PaymentPage;