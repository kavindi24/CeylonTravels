import React from "react";
import {
  FaChartBar,
  FaHotel,
  FaRoute,
  FaCar,
  FaUsers,
  FaMoneyBillWave,
  FaDownload,
  FaCalendarAlt
} from "react-icons/fa";

function Reports() {
  const reports = [
    {
      title: "Hotel Bookings",
      value: 42,
      icon: <FaHotel />,
      color: "primary"
    },
    {
      title: "Tour Bookings",
      value: 31,
      icon: <FaRoute />,
      color: "success"
    },
    {
      title: "Transport Bookings",
      value: 18,
      icon: <FaCar />,
      color: "warning"
    },
    {
      title: "Active Users",
      value: 120,
      icon: <FaUsers />,
      color: "info"
    }
  ];

  const recentReports = [
    {
      id: 1,
      type: "Hotel Booking",
      date: "2025-01-10",
      amount: 45000,
      status: "Completed"
    },
    {
      id: 2,
      type: "Tour Package",
      date: "2025-01-11",
      amount: 78000,
      status: "Completed"
    },
    {
      id: 3,
      type: "Transport Booking",
      date: "2025-01-12",
      amount: 12000,
      status: "Pending"
    }
  ];

  const formatLKR = (amount) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0
    }).format(amount);

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
          <FaChartBar className="me-2" />
          Reports & Analytics
        </h1>
        <p className="lead opacity-90">
          Overview of bookings, users, and revenue (Demo Data)
        </p>
      </div>

      {/* Summary Cards */}
      <div className="row mb-5">
        {reports.map((report, index) => (
          <div className="col-xl-3 col-md-6 mb-4" key={index}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4 text-center">
                <div
                  className={`text-${report.color} mb-2`}
                  style={{ fontSize: "1.8rem" }}
                >
                  {report.icon}
                </div>
                <h3 className="fw-bold mb-1">{report.value}</h3>
                <p className="text-muted mb-0">{report.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Section */}
      <div className="row mb-5">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">
                <FaMoneyBillWave className="me-2 text-success" />
                Revenue Summary
              </h5>

              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between">
                  <span>Hotel Revenue</span>
                  <strong>{formatLKR(320000)}</strong>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Tour Revenue</span>
                  <strong>{formatLKR(410000)}</strong>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Transport Revenue</span>
                  <strong>{formatLKR(145000)}</strong>
                </li>
                <li className="list-group-item d-flex justify-content-between fw-bold">
                  <span>Total Revenue</span>
                  <span>{formatLKR(875000)}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Export */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">
                <FaDownload className="me-2 text-primary" />
                Export Reports
              </h5>

              <p className="text-muted">
                Download monthly or yearly reports (Demo)
              </p>

              <div className="d-flex gap-3">
                <button className="btn btn-outline-primary">
                  <FaCalendarAlt className="me-2" />
                  Monthly Report
                </button>
                <button className="btn btn-outline-success">
                  <FaCalendarAlt className="me-2" />
                  Yearly Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Reports;
