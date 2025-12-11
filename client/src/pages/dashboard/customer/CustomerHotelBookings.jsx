import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCreditCard,
  FaHotel,
  FaCalendarAlt,
  FaUser,
  FaMoneyBillWave,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaEye,
  FaDownload,
  FaFilter,
  FaSearch,
  FaTrash,
  FaEdit
} from "react-icons/fa";

function CustomerHotelBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/hotel-booking/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "paid":
        return (
          <span className="badge bg-success-subtle text-success-emphasis px-3 py-2 rounded-pill">
            <FaCheckCircle className="me-1" />
            {status}
          </span>
        );
      case "pending":
      case "pending payment":
        return (
          <span className="badge bg-warning-subtle text-warning-emphasis px-3 py-2 rounded-pill">
            <FaClock className="me-1" />
            {status}
          </span>
        );
      case "cancelled":
        return (
          <span className="badge bg-danger-subtle text-danger-emphasis px-3 py-2 rounded-pill">
            <FaTimesCircle className="me-1" />
            {status}
          </span>
        );
      default:
        return (
          <span className="badge bg-secondary-subtle text-secondary-emphasis px-3 py-2 rounded-pill">
            {status}
          </span>
        );
    }
  };

  const handlePayment = (bookingId) => {
    navigate(`/payment/${bookingId}`);
  };

  const handleViewDetails = (bookingId) => {
    navigate(`/booking-details/${bookingId}`);
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        await axios.delete(`http://localhost:5000/api/hotel-booking/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Update local state
        setBookings(bookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: "Cancelled" }
            : booking
        ));
        
        alert("Booking cancelled successfully!");
      } catch (err) {
        alert("Failed to cancel booking. Please try again.");
      }
    }
  };

  const handleDownloadInvoice = (booking) => {
    // Simulate invoice download
    const invoiceContent = `
      HOTEL BOOKING INVOICE
      =====================
      
      Booking ID: ${booking.id}
      Hotel: ${booking.Hotel?.name || "N/A"}
      Check-In: ${formatDate(booking.checkIn)}
      Check-Out: ${formatDate(booking.checkOut)}
      Guests: ${booking.guests}
      Total Price: LKR ${booking.totalPrice?.toLocaleString()}
      Status: ${booking.status}
      
      Thank you for your booking!
    `;
    
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${booking.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.Hotel?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id?.toString().includes(searchTerm) ||
                         booking.status?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
                         booking.status?.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const getTotalSpent = () => {
    return bookings
      .filter(b => b.status?.toLowerCase() === "confirmed" || b.status?.toLowerCase() === "paid")
      .reduce((total, booking) => total + (booking.totalPrice || 0), 0);
  };

  const getUpcomingBookings = () => {
    const today = new Date();
    return bookings.filter(booking => {
      const checkInDate = new Date(booking.checkIn);
      return checkInDate >= today && 
             (booking.status?.toLowerCase() === "confirmed" || booking.status?.toLowerCase() === "paid");
    });
  };

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-bookings-page">
      {/* Header Section */}
      <div className="container py-4" style={{ backgroundColor: 'white' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-2">
              <FaHotel className="me-3 text-primary" />
              My Hotel Bookings
            </h2>
            <p className="text-muted">Manage and view all your hotel reservations</p>
          </div>
          <Link to="/listings/hotels" className="btn btn-outline-primary">
            <FaHotel className="me-2" />
            Book New Hotel
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="stats-card p-4 rounded-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Bookings</h6>
                  <h3 className="fw-bold mb-0">{bookings.length}</h3>
                </div>
                <div className="icon-wrapper bg-primary-subtle rounded-circle p-3">
                  <FaCalendarAlt className="text-primary" size={24} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="stats-card p-4 rounded-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Spent</h6>
                  <h3 className="fw-bold mb-0">LKR {getTotalSpent().toLocaleString()}</h3>
                </div>
                <div className="icon-wrapper bg-success-subtle rounded-circle p-3">
                  <FaMoneyBillWave className="text-success" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>        
      </div>

      {/* Bookings List */}
      <div className="container py-3" style={{ backgroundColor: 'white' }}>
        {filteredBookings.length === 0 ? (
          <div className="text-center py-5">
            <div className="empty-state-icon mb-3">
              <FaHotel size={48} className="text-muted" />
            </div>
            <h4>No bookings found</h4>
            <p className="text-muted mb-4">You haven't made any hotel bookings yet.</p>
            <Link to="/hotels" className="btn btn-primary">
              <FaHotel className="me-2" />
              Explore Hotels
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {filteredBookings.map((booking, index) => (
              <div key={booking.id} className="col-12">
                <div className="booking-card">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body p-4">
                      <div className="row align-items-center">
                        {/* Hotel Info */}
                        <div className="col-lg-4 mb-3 mb-lg-0">
                          <div className="d-flex align-items-center">
                            <div className="hotel-image-placeholder me-3 rounded-3 overflow-hidden" 
                                 style={{ width: '80px', height: '80px' }}>
                              {booking.Hotel?.images?.[0] ? (
                                <img
                                  src={`http://localhost:5000${booking.Hotel.images[0]}`}
                                  alt={booking.Hotel.name}
                                  className="w-100 h-100 object-fit-cover"
                                />
                              ) : (
                                <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center">
                                  <FaHotel className="text-muted" size={24} />
                                </div>
                              )}
                            </div>
                            <div>
                              <h5 className="fw-bold mb-1">{booking.Hotel?.name || "Unknown Hotel"}</h5>
                              <small className="text-muted">Booking #{booking.id}</small>
                            </div>
                          </div>
                        </div>

                        {/* Booking Details */}
                        <div className="col-lg-5 mb-3 mb-lg-0">
                          <div className="row g-2">
                            <div className="col-6">
                              <div className="booking-detail-item">
                                <small className="text-muted d-block">Check-In</small>
                                <div className="d-flex align-items-center">
                                  <FaCalendarAlt className="me-2 text-primary" size={14} />
                                  <span className="fw-semibold">{formatDate(booking.checkIn)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="booking-detail-item">
                                <small className="text-muted d-block">Check-Out</small>
                                <div className="d-flex align-items-center">
                                  <FaCalendarAlt className="me-2 text-primary" size={14} />
                                  <span className="fw-semibold">{formatDate(booking.checkOut)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="booking-detail-item">
                                <small className="text-muted d-block">Guests</small>
                                <div className="d-flex align-items-center">
                                  <FaUser className="me-2 text-primary" size={14} />
                                  <span className="fw-semibold">{booking.guests}</span>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="booking-detail-item">
                                <small className="text-muted d-block">Total Price</small>
                                <div className="d-flex align-items-center">
                                  <FaMoneyBillWave className="me-2 text-primary" size={14} />
                                  <span className="fw-semibold">LKR {booking.totalPrice?.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status and Actions */}
                        <div className="col-lg-3">
                          <div className="d-flex flex-column gap-3">
                            <div className="status-badge">
                              {getStatusBadge(booking.status)}
                            </div>
                            
                            <div className="booking-actions d-flex gap-2">
                              <button
                                className="btn btn-outline-primary btn-sm flex-fill"
                                onClick={() => handleViewDetails(booking.id)}
                              >
                                <FaEye className="me-1" />
                                View
                              </button>
                              
                              {booking.status?.toLowerCase() === "pending payment" && (
                                <button
                                  className="btn btn-success btn-sm flex-fill"
                                  onClick={() => handlePayment(booking.id)}
                                >
                                  <FaCreditCard className="me-1" />
                                  Pay
                                </button>
                              )}

                              {(booking.status?.toLowerCase() === "confirmed" || 
                                booking.status?.toLowerCase() === "paid") && (
                                <button
                                  className="btn btn-outline-secondary btn-sm flex-fill"
                                  onClick={() => handleDownloadInvoice(booking)}
                                >
                                  <FaDownload className="me-1" />
                                  Invoice
                                </button>
                              )}

                              {booking.status?.toLowerCase() !== "cancelled" && 
                               booking.status?.toLowerCase() !== "pending payment" && (
                                <button
                                  className="btn btn-outline-danger btn-sm flex-fill"
                                  onClick={() => handleCancelBooking(booking.id)}
                                >
                                  <FaTrash className="me-1" />
                                  Cancel
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .customer-bookings-page {
          font-family: 'Inter', sans-serif;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .stats-card {
          background: white;
          border: 1px solid #e9ecef;
          transition: all 0.3s ease;
        }

        .stats-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          border-color: #00796b;
        }

        .icon-wrapper {
          transition: transform 0.3s ease;
        }

        .stats-card:hover .icon-wrapper {
          transform: scale(1.1);
        }

        .filter-section .form-control:focus,
        .filter-section .form-select:focus {
          border-color: #00796b;
          box-shadow: 0 0 0 0.2rem rgba(0, 121, 107, 0.25);
        }

        .booking-card {
          transition: all 0.3s ease;
        }

        .booking-card:hover {
          transform: translateY(-3px);
        }

        .booking-card .card {
          background: white;
          transition: all 0.3s ease;
        }

        .booking-card:hover .card {
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
        }

        .hotel-image-placeholder {
          transition: transform 0.3s ease;
        }

        .booking-card:hover .hotel-image-placeholder {
          transform: scale(1.05);
        }

        .booking-detail-item {
          padding: 8px;
          background: #f8f9fa;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .booking-card:hover .booking-detail-item {
          background: #e9ecef;
        }

        .status-badge {
          text-align: center;
        }

        .booking-actions .btn {
          transition: all 0.3s ease;
        }

        .booking-actions .btn:hover {
          transform: translateY(-2px);
        }

        .btn-primary {
          background: linear-gradient(135deg, #00796b, #004d40);
          border: none;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 121, 107, 0.4);
        }

        .btn-outline-primary {
          border-color: #00796b;
          color: #00796b;
        }

        .btn-outline-primary:hover {
          background: #00796b;
          color: white;
        }

        .empty-state-icon {
          opacity: 0.5;
        }

        /* Responsive Design */
        @media (max-width: 992px) {
          .booking-card .row {
            flex-direction: column;
          }
          
          .booking-detail-item {
            margin-bottom: 10px;
          }
          
          .booking-actions {
            flex-direction: column;
          }
        }

        @media (max-width: 768px) {
          .filter-section .col-md-6,
          .filter-section .col-md-4,
          .filter-section .col-md-2 {
            margin-bottom: 10px;
          }
          
          .stats-card {
            margin-bottom: 1rem;
          }
        }

        @media (max-width: 576px) {
          .hotel-image-placeholder {
            width: 60px !important;
            height: 60px !important;
          }
          
          .booking-detail-item {
            font-size: 0.9rem;
          }
          
          .booking-actions .btn {
            padding: 6px 12px;
            font-size: 0.85rem;
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
        .form-control:focus,
        .form-select:focus {
          outline: 2px solid #00796b;
          outline-offset: 2px;
        }

        /* Badge animations */
        .badge {
          transition: all 0.3s ease;
        }

        .badge:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}

export default CustomerHotelBookings;