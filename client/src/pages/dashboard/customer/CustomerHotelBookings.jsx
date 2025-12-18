import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCreditCard,
  FaHotel,
  FaCalendarAlt,
  FaUsers,
  FaMoneyBillWave,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaEye,
  FaDownload,
  FaStar,
  FaMapMarkerAlt,
  FaTrash
} from "react-icons/fa";
import HotelBooking from "../../public/HotelBooking";

function CustomerHotelBookings() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/hotel-booking/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBookings(res.data);
        setFilteredBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setBookings([]);
        setFilteredBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    let result = [...bookings];

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(booking => booking.status === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.createdAt || b.checkIn) - new Date(a.createdAt || a.checkIn);
        case "priceHigh":
          return b.totalPrice - a.totalPrice;
        case "priceLow":
          return a.totalPrice - b.totalPrice;
        case "dateAsc":
          return new Date(a.checkIn) - new Date(b.checkIn);
        default:
          return 0;
      }
    });

    setFilteredBookings(result);
  }, [bookings, statusFilter, sortBy]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Confirmed":
        return <FaCheckCircle className="text-success" />;
      case "Pending":
      case "Pending Payment":
        return <FaClock className="text-warning" />;
      case "Cancelled":
        return <FaTimesCircle className="text-danger" />;
      default:
        return <FaClock className="text-muted" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "success";
      case "Pending":
      case "Pending Payment":
        return "warning";
      case "Cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  const handleViewDetails = (booking) => {
    navigate(`/hotels/${booking.id}`);
  };
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      await axios.put(
        `http://localhost:5000/api/hotel-booking/${bookingId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: "Cancelled" }
          : booking
      ));
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  const handleDownloadInvoice = (bookingId) => {
    // In a real app, this would download a PDF invoice
    alert("Invoice download feature would be implemented here");
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const totalBookings = bookings.length;
  const totalSpent = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
  const upcomingBookings = bookings.filter(b => 
    new Date(b.checkIn) > new Date() && b.status === "Confirmed"
  ).length;

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
    <div className="hotel-bookings-page">
      {/* Header */}
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold display-5 mb-2">My Hotel Bookings</h1>
            <p className="text-muted">Manage and track all your hotel reservations</p>
          </div>
          <Link to="/listings/hotels" className="btn btn-outline-primary">
            <FaArrowLeft className="me-2" />
            Book New Hotel
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="stats-card card border-0 shadow-sm rounded-3 h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div className="stats-icon-wrapper bg-primary rounded-circle p-3 me-3">
                    <FaHotel className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="fw-bold mb-0">{totalBookings}</h3>
                    <p className="text-muted mb-0">Total Bookings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stats-card card border-0 shadow-sm rounded-3 h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div className="stats-icon-wrapper bg-success rounded-circle p-3 me-3">
                    <FaCalendarAlt className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="fw-bold mb-0">{upcomingBookings}</h3>
                    <p className="text-muted mb-0">Upcoming Stays</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stats-card card border-0 shadow-sm rounded-3 h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div className="stats-icon-wrapper bg-info rounded-circle p-3 me-3">
                    <FaMoneyBillWave className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="fw-bold mb-0">LKR {totalSpent.toLocaleString()}</h3>
                    <p className="text-muted mb-0">Total Spent</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="card border-0 shadow-sm rounded-3 mb-4">
          <div className="card-body p-4">
            <div className="row align-items-center">
              <div className="col-md-6 mb-3 mb-md-0">
                <div className="d-flex align-items-center">
                  <span className="fw-semibold me-3">Filter by:</span>
                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      className={`btn btn-outline-primary ${statusFilter === "all" ? "active" : ""}`}
                      onClick={() => setStatusFilter("all")}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      className={`btn btn-outline-primary ${statusFilter === "Confirmed" ? "active" : ""}`}
                      onClick={() => setStatusFilter("Confirmed")}
                    >
                      Confirmed
                    </button>
                    <button
                      type="button"
                      className={`btn btn-outline-primary ${statusFilter === "Pending Payment" ? "active" : ""}`}
                      onClick={() => setStatusFilter("Pending Payment")}
                    >
                      Pending
                    </button>
                    <button
                      type="button"
                      className={`btn btn-outline-primary ${statusFilter === "Cancelled" ? "active" : ""}`}
                      onClick={() => setStatusFilter("Cancelled")}
                    >
                      Cancelled
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-center justify-content-md-end">
                  <span className="fw-semibold me-3">Sort by:</span>
                  <select 
                    className="form-select w-auto"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="date">Newest First</option>
                    <option value="dateAsc">Oldest First</option>
                    <option value="priceHigh">Price (High to Low)</option>
                    <option value="priceLow">Price (Low to High)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-5">
            <div className="empty-state mb-4">
              <FaHotel className="text-muted mb-3" size={64} />
              <h4>No bookings found</h4>
              <p className="text-muted mb-4">You haven't made any hotel bookings yet</p>
              <Link to="/hotels" className="btn btn-primary">
                Explore Hotels
              </Link>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="col-12">
                <div className="booking-card card border-0 shadow-sm rounded-3 h-100">
                  <div className="card-body p-4">
                    <div className="row align-items-center">
                      {/* Hotel Info */}
                      <div className="col-lg-5 mb-3 mb-lg-0">
                        <div className="d-flex">
                          <div className="hotel-image-wrapper me-3">
                            <img
                              src={booking.Hotel?.images?.[0] ? 
                                `http://localhost:5000${booking.Hotel.images[0]}` : 
                                "/placeholder.jpg"}
                              alt={booking.Hotel?.name}
                              className="hotel-image rounded-3"
                            />
                          </div>
                          <div>
                            <h5 className="fw-bold mb-1">{booking.Hotel?.name || "Hotel Name N/A"}</h5>
                            <div className="d-flex align-items-center mb-2">
                              <FaMapMarkerAlt className="text-muted me-2" size={12} />
                              <small className="text-muted">{booking.Hotel?.location || "Location N/A"}</small>
                            </div>
                            <div className="d-flex align-items-center">
                              <FaStar className="text-warning me-1" size={14} />
                              <small className="fw-semibold">{booking.Hotel?.rating || "N/A"}</small>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="col-lg-4 mb-3 mb-lg-0">
                        <div className="booking-details">
                          <div className="d-flex mb-2">
                            <div className="me-4">
                              <small className="text-muted d-block">Check-in</small>
                              <div className="d-flex align-items-center">
                                <FaCalendarAlt className="text-primary me-2" size={14} />
                                <span className="fw-semibold">{formatDate(booking.checkIn)}</span>
                              </div>
                            </div>
                            <div>
                              <small className="text-muted d-block">Check-out</small>
                              <div className="d-flex align-items-center">
                                <FaCalendarAlt className="text-primary me-2" size={14} />
                                <span className="fw-semibold">{formatDate(booking.checkOut)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex">
                            <div className="me-4">
                              <small className="text-muted d-block">Guests</small>
                              <div className="d-flex align-items-center">
                                <FaUsers className="text-primary me-2" size={14} />
                                <span className="fw-semibold">{booking.guests}</span>
                              </div>
                            </div>
                            <div>
                              <small className="text-muted d-block">Nights</small>
                              <div className="fw-semibold">
                                {calculateNights(booking.checkIn, booking.checkOut)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="col-lg-3">
                        <div className="text-lg-end">
                          <div className="price-section mb-3">
                            <h4 className="text-primary fw-bold">
                              LKR {booking.totalPrice?.toLocaleString()}
                            </h4>
                            <div className={`badge bg-${getStatusColor(booking.status)} px-3 py-2 rounded-pill`}>
                              {getStatusIcon(booking.status)}
                              <span className="ms-2">{booking.status}</span>
                            </div>
                          </div>

                          <div className="action-buttons d-flex gap-2">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleViewDetails(booking)}
                            >
                              <FaEye className="me-1" />
                              Details
                            </button>
                            
                            {booking.status === "Pending Payment" && (
                              <Link
                                to={`/payment/${booking.id}`}   // or just "/payment" if you don't use the id
                                className="btn btn-success btn-sm"
                              >
                                <FaCreditCard className="me-1" />
                                Pay Now
                              </Link>
                            )}

                            {booking.status === "Confirmed" && (
                              <>
                                <button
                                  className="btn btn-outline-info btn-sm"
                                  onClick={() => handleDownloadInvoice(booking.id)}
                                >
                                  <FaDownload className="me-1" />
                                  Invoice
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleCancelBooking(booking.id)}
                                >
                                  <FaTrash className="me-1" />
                                  Cancel
                                </button>
                              </>
                            )}
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
        .hotel-bookings-page {
          background: #f8f9fa;
          min-height: calc(100vh - 76px);
        }

        .stats-card {
          transition: all 0.3s ease;
          background: white;
        }

        .stats-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
        }

        .stats-icon-wrapper {
          transition: transform 0.3s ease;
        }

        .stats-card:hover .stats-icon-wrapper {
          transform: scale(1.1);
        }

        .booking-card {
          transition: all 0.3s ease;
          background: white;
        }

        .booking-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12) !important;
          border-color: #00796b;
        }

        .hotel-image-wrapper {
          width: 100px;
          height: 100px;
        }

        .hotel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .booking-card:hover .hotel-image {
          transform: scale(1.05);
        }

        .btn-outline-primary.active {
          background: #00796b;
          color: white;
          border-color: #00796b;
        }

        .btn-outline-primary:not(.active) {
          color: #00796b;
          border-color: #00796b;
        }

        .btn-outline-primary:not(.active):hover {
          background: #00796b;
          color: white;
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

        .btn-success {
          background: linear-gradient(135deg, #28a745, #1e7e34);
          border: none;
          transition: all 0.3s ease;
        }

        .btn-success:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
        }

        .btn-outline-info {
          color: #17a2b8;
          border-color: #17a2b8;
        }

        .btn-outline-info:hover {
          background: #17a2b8;
          color: white;
        }

        .btn-outline-danger {
          color: #dc3545;
          border-color: #dc3545;
        }

        .btn-outline-danger:hover {
          background: #dc3545;
          color: white;
        }

        .empty-state {
          padding: 3rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .badge {
          font-weight: 500;
          font-size: 0.85rem;
          display: inline-flex;
          align-items: center;
        }

        .action-buttons {
          flex-wrap: wrap;
        }

        .form-select {
          border-color: #00796b;
          color: #00796b;
        }

        .form-select:focus {
          border-color: #00796b;
          box-shadow: 0 0 0 0.2rem rgba(0, 121, 107, 0.25);
        }

        /* Responsive Design */
        @media (max-width: 992px) {
          .hotel-image-wrapper {
            width: 80px;
            height: 80px;
          }
          
          .action-buttons {
            justify-content: flex-start;
          }
        }

        @media (max-width: 768px) {
          .stats-card .card-body {
            padding: 1.5rem;
          }
          
          .booking-details .d-flex {
            flex-direction: column;
            gap: 10px;
          }
          
          .booking-details .me-4 {
            margin-right: 0 !important;
            margin-bottom: 10px;
          }
          
          .text-lg-end {
            text-align: left !important;
          }
          
          .action-buttons {
            justify-content: flex-start;
          }
        }

        @media (max-width: 576px) {
          .hotel-image-wrapper {
            width: 60px;
            height: 60px;
          }
          
          .btn-group .btn {
            padding: 5px 10px;
            font-size: 0.875rem;
          }
          
          .form-select {
            width: 100% !important;
          }
        }

        /* Animation */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .booking-card {
          animation: fadeIn 0.5s ease;
        }
      `}</style>
    </div>
  );
}

export default CustomerHotelBookings;