import React, { useState } from "react";
import {
  FaCog,
  FaSave,
  FaEnvelope,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaTools,
  FaMoon
} from "react-icons/fa";

function Settings() {
  const [settings, setSettings] = useState({
    siteName: "Ceylon Travels",
    adminEmail: "admin@ceylontravels.lk",
    currency: "LKR",
    autoConfirmBookings: true,
    cancellationHours: 48,
    paymentsEnabled: true,
    maintenanceMode: false,
    darkMode: false
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSave = () => {
    alert("✅ Settings saved successfully (Demo only)");
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div
        className="p-4 rounded-4 text-white mb-5"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
        }}
      >
        <h1 className="fw-bold mb-2">
          <FaCog className="me-2" />
          Admin Settings
        </h1>
        <p className="lead opacity-90">
          Manage system preferences and configuration
        </p>
      </div>

      {/* Settings Sections */}
      <div className="row g-4">

        {/* General Settings */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">General Settings</h5>

              <div className="mb-3">
                <label className="form-label">Site Name</label>
                <input
                  type="text"
                  className="form-control color-black"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleChange}
                   style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
        }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  <FaEnvelope className="me-2" />
                  Admin Email
                </label>
                <input
                  type="email"
                  className="form-control color-black"
                  name="adminEmail"
                  value={settings.adminEmail}
                  onChange={handleChange}
                   style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
        }}
                />
              </div>

              <div>
                <label className="form-label">
                  <FaMoneyBillWave className="me-2" />
                  Currency
                </label>
                <select
                  className="form-select"
                  name="currency"
                  value={settings.currency}
                  onChange={handleChange}
                   style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
        }}
                >
                  <option value="LKR">LKR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Settings */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Booking Settings</h5>

              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="autoConfirmBookings"
                  checked={settings.autoConfirmBookings}
                  onChange={handleChange}
                />
                <label className="form-check-label">
                  Auto-confirm bookings
                </label>
              </div>

              <div>
                <label className="form-label">
                  <FaCalendarAlt className="me-2" />
                  Free Cancellation (hours)
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="cancellationHours"
                  value={settings.cancellationHours}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Payment Settings</h5>

              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="paymentsEnabled"
                  checked={settings.paymentsEnabled}
                  onChange={handleChange}
                />
                <label className="form-check-label">
                  Enable Online Payments (Demo)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">System Settings</h5>

              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                />
                <label className="form-check-label">
                  <FaTools className="me-2" />
                  Maintenance Mode
                </label>
              </div>

              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="darkMode"
                  checked={settings.darkMode}
                  onChange={handleChange}
                />
                <label className="form-check-label">
                  <FaMoon className="me-2" />
                  Dark Mode (Demo)
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="text-end mt-4">
        <button className="btn btn-primary px-4 py-2" onClick={handleSave}>
          <FaSave className="me-2" />
          Save Settings
        </button>
      </div>
    </div>
  );
}

export default Settings;
