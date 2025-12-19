import React from "react";
import { Link } from "react-router-dom";

function CustomerDashboard() {
  // Session (current login) first, then persistent (old) localStorage
  const userName =
    sessionStorage.getItem("userName") ||
    localStorage.getItem("userName") ||
    "Customer";

  return (
    <div className="container py-5">
      {/* Header */}
      <div
        className="p-4 rounded-4 text-white mb-5"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h1 className="fw-bold mb-2">Welcome, {userName}</h1>

        <p className="lead opacity-90">
          Ready to explore and book your next adventure in Sri Lanka?
        </p>
      </div>

      {/* Quick Actions / Cards */}
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow-sm rounded-4 h-100 hover-scale">
            <div className="card-body text-center">
              <h5 className="card-title fw-bold mb-3">Book Hotels</h5>
              <p className="card-text text-muted">
                Browse and reserve your favorite hotels with ease.
              </p>
              <Link
                to="/listings/hotels"
                className="btn btn-primary rounded-pill mt-3"
              >
                Go to Hotels
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm rounded-4 h-100 hover-scale">
            <div className="card-body text-center">
              <h5 className="card-title fw-bold mb-3">My Bookings</h5>
              <p className="card-text text-muted">
                View and manage all your upcoming and past bookings.
              </p>
              <Link
                to="/dashboard/customer/hotels"
                className="btn btn-primary rounded-pill mt-3"
              >
                View Bookings
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm rounded-4 h-100 hover-scale">
            <div className="card-body text-center">
              <h5 className="card-title fw-bold mb-3">Profile Settings</h5>
              <p className="card-text text-muted">
                Update your personal info, password, and preferences.
              </p>
              <Link
                to="/dashboard/customer/profile"
                className="btn btn-primary rounded-pill mt-3"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

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

export default CustomerDashboard;