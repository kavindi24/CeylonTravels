// src/pages/dashboard/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import {
  FaUsers,
  FaHotel,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaMapMarkedAlt,
  FaCar,
  FaClipboardList
} from 'react-icons/fa';

function AdminDashboard() {
  const navigate = useNavigate();

  // Format currency to LKR
  const formatLKR = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const [stats, setStats] = useState({
    users: 0,
    destinations: 0,
    hotels: 0,
    providers: 0,
    transports: 0,
    bookings: 0,
    revenue: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard stats loading error:", err);
      }
    };
    loadStats();
  }, []);

  const cards = [
    {
      title: "Total Users",
      value: stats.users,
      icon: <FaUsers className="text-primary" />,
      color: "primary"
    },
    {
      title: "Total Destinations",
      value: stats.destinations,
      icon: <FaMapMarkedAlt className="text-success" />,
      color: "success"
    },
    {
      title: "Total Hotels",
      value: stats.hotels,
      icon: <FaHotel className="text-warning" />,
      color: "warning"
    },
    {
      title: "Total Providers",
      value: stats.providers,
      icon: <FaClipboardList className="text-info" />,
      color: "info"
    },
    {
      title: "Total Transports",
      value: stats.transports,
      icon: <FaCar className="text-danger" />,
      color: "danger"
    },
    {
      title: "Total Bookings",
      value: stats.bookings,
      icon: <FaCalendarCheck className="text-primary" />,
      color: "primary"
    },
    {
      title: "Revenue",
      value: formatLKR(stats.revenue),
      icon: <FaMoneyBillWave className="text-success" />,
      color: "success"
    },
  ];

  return (
    <div className="admin-dashboard py-5 container">

      {/* Header */}
      <div className=" justify-content-between align-items-center mb-8">
      <div
        className="p-4 rounded-4 text-white mb-5"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h1 className="fw-bold mb-2">Welcome, to Ceylon Travels Admin Dashboard</h1>
        <p className="lead opacity-90">
          Admin Dashboard - Manage Users, Listings, and Reports
        </p>
      </div>
    
      </div>

      {/* Stats Cards */}
      <div className="row mb-5">
        {cards.map((stat, index) => (
          <div className="col-xl-3 col-md-6 mb-4" key={index}>
            <div className="card border-0 shadow-sm h-100 custom-card">
              <div className="card-body p-4">


                <h3 className="fw-bold mb-1" style={{ color: '#1f2937' }}>
                  {stat.value}
                </h3>
                <p className="text-muted mb-0">{stat.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm custom-card">
            <div className="card-header bg-white border-0 pt-4">
              <h5 className="fw-semibold mb-0" style={{ color: '#1f2937' }}>
                Quick Actions
              </h5>
            </div>

            <div className="card-body">
              <div className="row text-center">

                <div className="col-md-3 col-6 mb-3">
                  <button
                    className="btn btn-outline-primary w-100 py-3 rounded-3"
                    onClick={() => navigate("/dashboard/admin/users")}
                  >
                    <FaUsers className="mb-2" style={{ fontSize: '1.5rem' }} />
                    <br /> Manage Users
                  </button>
                </div>

                <div className="col-md-3 col-6 mb-3">
                  <button
                    className="btn btn-outline-success w-100 py-3 rounded-3"
                    onClick={() => navigate("/dashboard/admin/destinations")}
                  >
                    <FaMapMarkedAlt className="mb-2" style={{ fontSize: '1.5rem' }} />
                    <br /> Destinations
                  </button>
                </div>

                <div className="col-md-3 col-6 mb-3">
                  <button
                    className="btn btn-outline-warning w-100 py-3 rounded-3"
                    onClick={() => navigate("/dashboard/admin/hotels")}
                  >
                    <FaHotel className="mb-2" style={{ fontSize: '1.5rem' }} />
                    <br /> Hotels
                  </button>
                </div>

                <div className="col-md-3 col-6 mb-3">
                  <button
                    className="btn btn-outline-info w-100 py-3 rounded-3"
                    onClick={() => navigate("/dashboard/admin/transports")}
                  >
                    <FaCar className="mb-2" style={{ fontSize: '1.5rem' }} />
                    <br /> Transports
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
            {/* Custom CSS */}
      <style>{`
        .hover-scale {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-scale:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
      `}</style>

    </div>
  );
}

export default AdminDashboard;
