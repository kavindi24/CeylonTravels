// src/pages/dashboard/customer/MyBookings.jsx
import React, { useState } from 'react';
import { FaHotel, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaMoneyBillWave, FaSearch, FaFilter, FaEllipsisV, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

function MyBookings() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample booking data
  const bookings = [
    {
      id: 1,
      name: 'Luxury Beach Resort',
      location: 'Galle, Sri Lanka',
      date: '15 Oct 2023 - 20 Oct 2023',
      guests: 2,
      price: '$420',
      status: 'confirmed',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      name: 'Mountain Retreat',
      location: 'Nuwara Eliya, Sri Lanka',
      date: '22 Nov 2023 - 25 Nov 2023',
      guests: 1,
      price: '$380',
      status: 'pending',
      image: 'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },

    {
      id: 3,
      name: 'City Center Hotel',
      location: 'Colombo, Sri Lanka',
      date: '10 Jan 2024 - 12 Jan 2024',
      guests: 2,
      price: '$280',
      status: 'cancelled',
      image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  // Filter bookings based on active tab and search term
  const filteredBookings = bookings.filter(booking => {
    const matchesTab = activeTab === 'all' || booking.status === activeTab;
    const matchesSearch = booking.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          booking.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const statusBadge = (status) => {
    const statusClasses = {
      confirmed: 'bg-success',
      pending: 'bg-warning',
      cancelled: 'bg-danger'
    };
    
    return (
      <span className={`badge ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="my-bookings">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-dark fw-bold mb-1">My Bookings</h2>
          <p className="text-muted">Manage your upcoming and past travel reservations</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center">
          <FaHotel className="me-2" /> New Booking
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle text-muted">Total Bookings</h6>
                  <h3 className="card-title fw-bold mt-2">{bookings.length}</h3>
                </div>
                <div className="bg-primary p-3 rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '50px', height: '50px' }}>
                  <FaHotel className="text-white fs-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle text-muted">Confirmed</h6>
                  <h3 className="card-title fw-bold mt-2">{bookings.filter(b => b.status === 'confirmed').length}</h3>
                </div>
                <div className="bg-success p-3 rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '50px', height: '50px' }}>
                  <FaCalendarAlt className="text-white fs-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle text-muted">Pending</h6>
                  <h3 className="card-title fw-bold mt-2">{bookings.filter(b => b.status === 'pending').length}</h3>
                </div>
                <div className="bg-warning p-3 rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '50px', height: '50px' }}>
                  <FaCalendarAlt className="text-white fs-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle text-muted">Cancelled</h6>
                  <h3 className="card-title fw-bold mt-2">{bookings.filter(b => b.status === 'cancelled').length}</h3>
                </div>
                <div className="bg-danger p-3 rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '50px', height: '50px' }}>
                  <FaCalendarAlt className="text-white fs-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6 mb-3 mb-md-0">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <FaSearch className="text-muted" />
                </span>
                <input 
                  type="text" 
                  className="form-control border-start-0 ps-0" 
                  placeholder="Search bookings..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{border: '1px solid #ced4da', borderLeft: 'none'}}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex flex-wrap align-items-center justify-content-md-end">
                <span className="me-2 d-none d-md-block text-muted"><FaFilter /></span>
                <div className="btn-group" role="group">
                  <button 
                    type="button" 
                    className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('all')}
                  >
                    All
                  </button>
                  <button 
                    type="button" 
                    className={`btn ${activeTab === 'confirmed' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('confirmed')}
                  >
                    Confirmed
                  </button>
                  <button 
                    type="button" 
                    className={`btn ${activeTab === 'pending' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('pending')}
                  >
                    Pending
                  </button>
                  <button 
                    type="button" 
                    className={`btn ${activeTab === 'cancelled' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('cancelled')}
                  >
                    Cancelled
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3">
          <h5 className="m-0 fw-bold">All Bookings</h5>
          <span className="text-muted">{filteredBookings.length} results</span>
        </div>
        <div className="card-body p-0">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-5">
              <FaHotel className="text-muted mb-3" style={{ fontSize: '3rem' }} />
              <h5 className="text-muted">No bookings found</h5>
              <p className="text-muted">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {filteredBookings.map(booking => (
                <div key={booking.id} className="list-group-item p-4">
                  <div className="row align-items-center">
                    <div className="col-md-2 mb-3 mb-md-0">
                      <img 
                        src={booking.image} 
                        alt={booking.name} 
                        className="img-fluid rounded"
                        style={{ height: '80px', width: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="col-md-4 mb-3 mb-md-0">
                      <h6 className="fw-bold mb-1">{booking.name}</h6>
                      <p className="text-muted small mb-1">
                        <FaMapMarkerAlt className="me-1" />
                        {booking.location}
                      </p>
                      <p className="text-muted small mb-0">
                        <FaCalendarAlt className="me-1" />
                        {booking.date}
                      </p>
                    </div>
                    <div className="col-md-2 mb-3 mb-md-0">
                      <p className="text-muted small mb-1">
                        <FaUser className="me-1" />
                        {booking.guests} {booking.guests > 1 ? 'Guests' : 'Guest'}
                      </p>
                      <p className="text-muted small mb-0">
                        <FaMoneyBillWave className="me-1" />
                        {booking.price}
                      </p>
                    </div>
                    <div className="col-md-2 mb-3 mb-md-0">
                      {statusBadge(booking.status)}
                    </div>
                    <div className="col-md-2 text-md-end">
                      <div className="dropdown">
                        <button 
                          className="btn btn-sm btn-outline-secondary dropdown-toggle" 
                          type="button" 
                          data-bs-toggle="dropdown"
                        >
                          <FaEllipsisV />
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                          <li>
                            <button className="dropdown-item d-flex align-items-center">
                              <FaEye className="me-2" /> View Details
                            </button>
                          </li>
                          <li>
                            <button className="dropdown-item d-flex align-items-center">
                              <FaEdit className="me-2" /> Modify
                            </button>
                          </li>
                          <li>
                            <button className="dropdown-item d-flex align-items-center text-danger">
                              <FaTrash className="me-2" /> Cancel
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyBookings;