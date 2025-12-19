import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminManageBookings() {
  const [bookings, setBookings] = useState([]);

  // Load bookings
  const fetchBookings = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/hotel-bookings");
      setBookings(response.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  // Change booking status
  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/hotel-bookings/${id}/status`, { status });
      fetchBookings(); // Refresh table
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Manage Hotel Bookings</h2>

      <table className="table table-bordered table-striped text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Customer</th>
            <th>Hotel</th>
            <th>Check-In</th>
            <th>Check-Out</th>
            <th>Guests</th>
            <th>Total Price (LKR)</th>
            <th>Status</th>
            <th>Update</th>
          </tr>
        </thead>

        <tbody>
          {bookings.length === 0 && (
            <tr>
              <td colSpan="9">No bookings found.</td>
            </tr>
          )}

          {bookings.map((b, index) => (
            <tr key={b.id}>
              <td>{index + 1}</td>
              <td>{b.User?.name}</td>
              <td>{b.Hotel?.name}</td>
              <td>{new Date(b.checkIn).toDateString()}</td>
              <td>{new Date(b.checkOut).toDateString()}</td>
              <td>{b.guests}</td>
              <td>{b.totalPrice}</td>
              <td>
                <span
                  className={`badge ${
                    b.status === "Pending"
                      ? "bg-warning"
                      : b.status === "Confirmed"
                      ? "bg-success"
                      : "bg-danger"
                  }`}
                >
                  {b.status}
                </span>
              </td>

              <td>
                <select
                  className="form-select"
                  style={{ width: "140px" }}
                  value={b.status}
                  onChange={(e) => updateStatus(b.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminManageBookings;
