// src/pages/public/PaymentPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { 
  FaLock, 
  FaCheckCircle, 
  FaArrowLeft, 
  FaCreditCard, 
  FaUser, 
  FaCalendar, 
  FaUsers,
  FaEnvelope,
  FaShieldAlt,
  FaMoneyCheckAlt
} from "react-icons/fa";

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking } = location.state || {};
  
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: "",
    email: ""
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Redirect if no booking data
  useEffect(() => {
    if (!booking) {
      navigate("/all-tours");
    }
  }, [booking, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === "cardNumber") {
      const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setPaymentDetails(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }
    
    // Format expiry date
    if (name === "expiryDate") {
      const formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      setPaymentDetails(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }
    
    setPaymentDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      // Redirect to confirmation page after 3 seconds
      setTimeout(() => {
        navigate("/booking-confirmation", { 
          state: { 
            booking: {
              ...booking,
              bookingId: `BK${Date.now()}`,
              paymentId: `PAY${Date.now()}`
            }
          } 
        });
      }, 3000);
    }, 2000);
  };

  if (!booking) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="text-dark">No Booking Information</h2>
        <p className="text-dark">Please start a booking from the tour details page.</p>
        <Link to="/all-tours" className="btn btn-primary">
          Browse Tours
        </Link>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="card border-gray shadow">
              <div className="card-body text-center p-5">
                <FaCheckCircle className="text-success mb-3" size="4rem" />
                <h2 className="text-success mb-3">Payment Successful!</h2>
                <p className="lead text-dark">Your booking has been confirmed.</p>
                <p className="text-dark">Redirecting to booking confirmation...</p>
                <div className="spinner-border text-primary" role="status">
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
    <div className="container mt-4">
      {/* Header with Back Button */}
      <div className="mb-4">
        <Link to={`/tour/${booking.tourId}`} className="btn btn-outline-secondary btn-sm border-gray text-dark">
          <FaArrowLeft className="me-2" />
          Back to Tour
        </Link>
      </div>

      <div className="row">
        {/* Booking Summary */}
        <div className="col-lg-4 mb-4">
          <div className="card border-gray shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <FaMoneyCheckAlt className="me-2" />
                Booking Summary
              </h5>
            </div>
            <div className="card-body text-dark">
              <h6 className="fw-bold">{booking.tourTitle}</h6>
              
              <div className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <FaCalendar className="text-muted me-2" />
                  <small className="text-muted">Date:</small>
                </div>
                <p className="mb-0">{new Date(booking.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
              
              <div className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <FaUsers className="text-muted me-2" />
                  <small className="text-muted">Participants:</small>
                </div>
                <p className="mb-0">{booking.participants} {booking.participants === 1 ? 'Person' : 'People'}</p>
              </div>
              
              <div className="border-top pt-3">
                <div className="d-flex justify-content-between mb-1 text-dark">
                  <span>Price per person:</span>
                  <span>LKR {booking.tourPrice.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-1 text-dark">
                  <span>Participants:</span>
                  <span>× {booking.participants}</span>
                </div>
                <div className="d-flex justify-content-between fw-bold fs-5 border-top pt-2 text-dark">
                  <span>Total Amount:</span>
                  <span className="text-primary">LKR {booking.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div className="card border-gray shadow-sm mt-4">
            <div className="card-body text-dark">
              <div className="d-flex align-items-center mb-3">
                <FaShieldAlt className="text-success me-2" />
                <h6 className="mb-0">Secure Payment</h6>
              </div>
              <small className="text-muted">
                <div className="mb-1">✓ 256-bit SSL encryption</div>
                <div className="mb-1">✓ PCI DSS compliant</div>
                <div>✓ Your data is protected</div>
              </small>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="col-lg-8">
          <div className="card border-gray shadow-sm">
            <div className="card-header bg-white border-gray">
              <h4 className="mb-0 text-dark">
                <FaCreditCard className="text-primary me-2" />
                Payment Details
              </h4>
            </div>
            <div className="card-body p-4 text-dark">
              <form onSubmit={handleSubmit}>
                {/* Card Number */}
                <div className="mb-3">
                  <label htmlFor="cardNumber" className="form-label fw-semibold text-dark">
                    <FaCreditCard className="me-2 text-secondary" />
                    Card Number
                  </label>
                  <input
                    type="text"
                    className="form-control border-gray text-dark"
                    id="cardNumber"
                    name="cardNumber"
                    value={paymentDetails.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    required
                  />
                </div>

                <div className="row">
                  {/* Expiry Date */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="expiryDate" className="form-label fw-semibold text-dark">
                      <FaCalendar className="me-2 text-secondary" />
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      className="form-control border-gray text-dark"
                      id="expiryDate"
                      name="expiryDate"
                      value={paymentDetails.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      required
                    />
                  </div>

                  {/* CVV */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="cvv" className="form-label fw-semibold text-dark">
                      <FaLock className="me-2 text-secondary" />
                      CVV
                    </label>
                    <input
                      type="text"
                      className="form-control border-gray text-dark"
                      id="cvv"
                      name="cvv"
                      value={paymentDetails.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength="3"
                      required
                    />
                  </div>
                </div>

                {/* Card Holder Name */}
                <div className="mb-3">
                  <label htmlFor="cardHolder" className="form-label fw-semibold text-dark">
                    <FaUser className="me-2 text-secondary" />
                    Card Holder Name
                  </label>
                  <input
                    type="text"
                    className="form-control border-gray text-dark"
                    id="cardHolder"
                    name="cardHolder"
                    value={paymentDetails.cardHolder}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label htmlFor="email" className="form-label fw-semibold text-dark">
                    <FaEnvelope className="me-2 text-secondary" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control border-gray text-dark"
                    id="email"
                    name="email"
                    value={paymentDetails.email}
                    onChange={handleInputChange}
                    placeholder="john.doe@example.com"
                    required
                  />
                  <div className="form-text text-dark">Booking confirmation will be sent to this email</div>
                </div>

                {/* Terms and Conditions */}
                <div className="form-check mb-4">
                  <input
                    className="form-check-input border-gray"
                    type="checkbox"
                    id="terms"
                    required
                  />
                  <label className="form-check-label text-dark" htmlFor="terms">
                    
                    I agree to the{" "}
                    <a href="/terms" className="text-decoration-none fw-semibold text-dark">
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-decoration-none fw-semibold text-dark">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 py-3 fw-semibold border-gray text-dark"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <FaLock className="me-2" />
                      Pay LKR {booking.totalAmount.toLocaleString()}
                    </>
                  )}
                </button>

                <div className="text-center mt-3">
                  <small className="text-muted">
                    <FaShieldAlt className="me-1" />
                    Your payment is secure and encrypted
                  </small>
                </div>
              </form>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="card  mt-4">
            </div>
        </div>
      </div>

      {/* Custom CSS for date input */}
      <style>
        {`
        .border-gray {
          border: 1px solid #dee2e6 !important;
        }
         `}
      </style>
    </div>
  );
}

export default PaymentPage;