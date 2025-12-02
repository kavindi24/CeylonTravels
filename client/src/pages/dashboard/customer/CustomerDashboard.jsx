// src/pages/dashboard/customer/CustomerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { FaHotel, FaMapMarkerAlt, FaStar, FaRegStar, FaEye} from 'react-icons/fa';
import { RiCalendarEventFill } from 'react-icons/ri';

function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  
  // Sample data for demonstration
  const stats = [
    { 
      label: 'Upcoming Trips', 
      value: 2, 
      icon: <RiCalendarEventFill />, 
      color: 'primary',
      change: '+1 from last month'
    },
    { 
      label: 'Hotels Booked', 
      value: 3, 
      icon: <FaHotel />, 
      color: 'success',
      change: '+2 from last month'
    },
    { 
      label: 'Destinations', 
      value: 5, 
      icon: <FaMapMarkerAlt />, 
      color: 'info',
      change: '+3 this year'
    },
    { 
      label: 'Loyalty Points', 
      value: 1250, 
      icon: <FaStar />, 
      color: 'warning',
      change: '150 points earned'
    },
  ];

  const recentBookings = [
    { 
      id: 1, 
      name: 'Luxury Beach Resort', 
      date: '15 Oct 2023', 
      checkIn: '15 Oct 2023',
      checkOut: '18 Oct 2023',
      status: 'Confirmed', 
      price: 'LKR 14,200',
      type: 'Hotel',
      image: 'https://media-cdn.tripadvisor.com/media/photo-s/2b/ab/90/48/the-beaches-are-awarded.jpg'
    },
    { 
      id: 2, 
      name: 'Mountain Retreat', 
      date: '22 Nov 2023',
      checkIn: '22 Nov 2023',
      checkOut: '25 Nov 2023',
      status: 'Pending', 
      price: 'LKR 13,800',
      type: 'Hotel',
      image: 'https://www.ceyloninsidertravels.com/wp-content/uploads/2024/09/Santani-Sri-Lanka-Luxury-Wellness-Resorts-33.jpg'
    },
    { 
      id: 3, 
      name: 'Cultural Tour Package', 
      date: '05 Dec 2023',
      checkIn: '05 Dec 2023',
      checkOut: '08 Dec 2023',
      status: 'Confirmed', 
      price: 'LKR 25,500',
      type: 'Tour',
      image: 'https://touronesrilanka.com/wp-content/uploads/2021/09/2.jpg'
    },
  ];

  const recommended = [
    { 
      id: 1, 
      name: 'Cultural Tour', 
      location: 'Kandy', 
      price: 'LKR 5,800', 
      rating: 4.8,
      reviews: 124,
      image: '/images/kandy-tour.jpg',
      duration: '3 days',
      type: 'Tour'
    },
    { 
      id: 2, 
      name: 'Beach Paradise', 
      location: 'Mirissa', 
      price: 'LKR 8,200', 
      rating: 4.6,
      reviews: 89,
      image: '/images/mirissa-beach.jpg',
      duration: '4 days',
      type: 'Hotel'
    },
  ];

 
  // Simulate loading state
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Confirmed': { class: 'bg-success', text: 'Confirmed' },
      'Pending': { class: 'bg-warning', text: 'Pending' },
      'Cancelled': { class: 'bg-danger', text: 'Cancelled' },
      'Completed': { class: 'bg-info', text: 'Completed' }
    };
    
    const config = statusConfig[status] || statusConfig.Pending;
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-warning" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaRegStar key="half" className="text-warning" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-warning" />);
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className="customer-dashboard">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-dashboard">
      {/* Welcome Section */}
      <div className="welcome-section mb-4">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h2 className="text-dark fw-bold mb-2">Hello, Kavindi! 👋</h2>
            <p className="text-muted mb-0">
              Ready for your next adventure? You've booked {recentBookings.length} trips and visited {stats[2].value} destinations this year!
            </p>
          </div>
          <div className="col-md-4 text-md-end">
            
          </div>
        </div>
      </div>

     

      {/* Stats Cards */}
      <div className="row mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-xl-3 col-lg-6 col-md-6 mb-3">
            <div className="card border-0 shadow-sm h-100 hover-shadow">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-subtitle text-muted">{stat.label}</h6>
                    <h3 className="card-title fw-bold mt-2 mb-1">{stat.value}</h3>
                    <small className="text-muted">{stat.change}</small>
                  </div>
                  <div className={`bg-${stat.color}-light p-3 rounded-circle d-flex align-items-center justify-content-center`}
                    style={{ width: '60px', height: '60px' }}>
                    {React.cloneElement(stat.icon, { className: `text-${stat.color} fs-4` })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        {/* Recent Bookings */}
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3">
              <h5 className="m-0 fw-bold">Recent Bookings</h5>
              <div>
                <button 
                  className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button 
                  className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setActiveTab('all')}
                >
                  View All
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Accommodation/Tour</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Status</th>
                      <th>Price</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map(booking => (
                      <tr key={booking.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="flex-shrink-0">
                              <div 
                                className="bg-light rounded"
                                style={{ width: '40px', height: '40px' }}
                              ></div>
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <div className="fw-bold">{booking.name}</div>
                              <small className="text-muted">{booking.type}</small>
                            </div>
                          </div>
                        </td>
                        <td>{booking.checkIn}</td>
                        <td>{booking.checkOut}</td>
                        <td>{getStatusBadge(booking.status)}</td>
                        <td className="fw-bold">{booking.price}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary">
                            <FaEye className="me-1" />
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended For You */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3">
              <h5 className="m-0 fw-bold">Recommended For You</h5>
              <button className="btn btn-sm btn-outline-primary">See All</button>
            </div>
            <div className="card-body">
              {recommended.map(item => (
                <div key={item.id} className="card mb-3 border-0 shadow-sm hover-shadow">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="card-title fw-bold mb-1">{item.name}</h6>
                        <p className="card-text text-muted small mb-1">
                          <FaMapMarkerAlt className="me-1" />
                          {item.location} • {item.duration}
                        </p>
                        <div className="d-flex align-items-center">
                          <div className="d-flex me-2">
                            {renderStars(item.rating)}
                          </div>
                          <small className="text-muted">
                            {item.rating} ({item.reviews} reviews)
                          </small>
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold text-primary fs-5">{item.price}</div>
                        <small className="text-muted">per person</small>
                      </div>
                    </div>
                    <button className="btn btn-sm btn-primary w-100 mt-2">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
              
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;