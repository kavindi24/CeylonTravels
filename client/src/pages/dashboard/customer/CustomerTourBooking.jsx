import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaEye,
  FaDownload,
  FaStar,
  FaMapMarkerAlt
} from "react-icons/fa";

function CustomerTourBookings() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const navigate = useNavigate();

useEffect(() => {
  const fetchBookings = async () => {
    try {
      const token =
        localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await axios.get(
        "http://localhost:5000/api/tour-packages/bookings",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Tour bookings from API:", res.data); // <-- add this

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
          return new Date(b.createdAt || b.startDate) - new Date(a.createdAt || a.startDate);
        case "dateAsc":
          return new Date(a.startDate) - new Date(b.startDate);
        case "priceHigh":
          return b.totalPrice - a.totalPrice;
        case "priceLow":
          return a.totalPrice - b.totalPrice;
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
      case "Pending Payment":
        return "warning";
      case "Cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  const handleViewDetails = (booking) => {
    navigate(`/tour-packages/${booking.id}`);
  };

  const handleDownloadInvoice = (bookingId) => {
    alert("Invoice download feature would be implemented here");
  };

  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const totalBookings = bookings.length;
  const totalSpent = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
  const upcomingBookings = bookings.filter(b => 
    new Date(b.startDate) > new Date() && b.status === "Confirmed"
  ).length;

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading your tour bookings...</p>
      </div>
    );
  }

  return (
    <div className="tour-bookings-page">
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold display-5 mb-2">My Tour Bookings</h1>
            <p className="text-muted">Manage and track all your tour reservations</p>
          </div>
          <Link to="/tour-packages" className="btn btn-outline-primary">
            <FaArrowLeft className="me-2" />
            Book New Tour
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-3 h-100 p-4">
              <h3 className="fw-bold mb-0">{totalBookings}</h3>
              <p className="text-muted mb-0">Total Bookings</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-3 h-100 p-4">
              <h3 className="fw-bold mb-0">{upcomingBookings}</h3>
              <p className="text-muted mb-0">Upcoming Tours</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-3 h-100 p-4">
              <h3 className="fw-bold mb-0">LKR {totalSpent.toLocaleString()}</h3>
              <p className="text-muted mb-0">Total Spent</p>
            </div>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="card border-0 shadow-sm rounded-3 mb-4 p-4">
          <div className="row align-items-center">
            <div className="col-md-6 mb-3 mb-md-0">
              <span className="fw-semibold me-3">Filter by:</span>
              <div className="btn-group" role="group">
                <button className={`btn btn-outline-primary ${statusFilter==="all"?"active":""}`} onClick={()=>setStatusFilter("all")}>All</button>
                <button className={`btn btn-outline-primary ${statusFilter==="Confirmed"?"active":""}`} onClick={()=>setStatusFilter("Confirmed")}>Confirmed</button>
                <button className={`btn btn-outline-primary ${statusFilter==="Pending Payment"?"active":""}`} onClick={()=>setStatusFilter("Pending Payment")}>Pending</button>
                <button className={`btn btn-outline-primary ${statusFilter==="Cancelled"?"active":""}`} onClick={()=>setStatusFilter("Cancelled")}>Cancelled</button>
              </div>
            </div>
            <div className="col-md-6 text-md-end">
              <span className="fw-semibold me-3">Sort by:</span>
              <select className="form-select w-auto d-inline-block" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
                <option value="date">Newest First</option>
                <option value="dateAsc">Oldest First</option>
                <option value="priceHigh">Price (High to Low)</option>
                <option value="priceLow">Price (Low to High)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Booking List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-5">
            <h4>No bookings found</h4>
            <p className="text-muted">You haven't made any tour bookings yet.</p>
            <Link to="/tour-packages" className="btn btn-primary">Explore Tours</Link>
          </div>
        ) : (
          <div className="row g-4">
            {filteredBookings.map((b) => (
              <div key={b.id} className="col-12">
                <div className="card border-0 shadow-sm rounded-3 h-100 p-4">
                  <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                      <h5 className="fw-bold">{b.TourPackage?.title || "Tour Name N/A"}</h5>
                      <div className="d-flex align-items-center mb-2">
                        <FaMapMarkerAlt className="text-muted me-2" />
                        <small className="text-muted">{b.TourPackage?.location || "Location N/A"}</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <FaStar className="text-warning me-1" />
                        <small className="fw-semibold">{b.TourPackage?.rating || "N/A"}</small>
                      </div>
                    </div>

                    <div className="text-end">
                      <p><strong>From:</strong> {formatDate(b.startDate)}</p>
                      <p><strong>To:</strong> {formatDate(b.endDate)}</p>
                      <p><strong>Guests:</strong> {b.guests}</p>
                      <p><strong>Days:</strong> {calculateDays(b.startDate, b.endDate)}</p>
                      <h5 className="text-primary fw-bold">LKR {b.totalPrice?.toLocaleString()}</h5>
                      <div className={`badge bg-${getStatusColor(b.status)} py-2 px-3 rounded-pill`}>
                        {getStatusIcon(b.status)}
                        <span className="ms-2">{b.status}</span>
                      </div>
                      <div className="mt-2 d-flex gap-2 flex-wrap">
                        <button className="btn btn-outline-primary btn-sm" onClick={()=>handleViewDetails(b)}>
                          <FaEye className="me-1"/> Details
                        </button>
                        {b.status === "Confirmed" && (
                          <button className="btn btn-outline-info btn-sm" onClick={()=>handleDownloadInvoice(b.id)}>
                            <FaDownload className="me-1"/> Invoice
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom styles */}
      <style jsx>{`
        .tour-bookings-page { background:#f8f9fa; min-height:calc(100vh - 76px);}
        .card:hover { transform: translateY(-3px); box-shadow:0 8px 25px rgba(0,0,0,0.12);}
        .btn-outline-primary.active { background:#00796b; color:white; border-color:#00796b; }
        .btn-outline-primary:not(.active){ color:#00796b; border-color:#00796b; }
        .btn-outline-primary:not(.active):hover{ background:#00796b; color:white; }
      `}</style>
    </div>
  );
}

export default CustomerTourBookings;
