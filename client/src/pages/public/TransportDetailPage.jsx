// src/pages/public/TransportDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function TransportDetailsPage() {
  const { id } = useParams();
  const [transport, setTransport] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/transports/${id}`)
      .then((res) => setTransport(res.data))
      .catch((err) => console.error("Error loading transport:", err));
  }, [id]);

  if (!transport) return <div className="container py-5">Loading...</div>;

  return (
    <div className="container py-4">

      <Link to="/transports" className="btn btn-outline-secondary mb-3">
        ← Back to Transports
      </Link>

      {/* ---- Title ---- */}
      <h2 className="mb-4">{transport.vehicleType}</h2>

      {/* ---- Image Gallery ---- */}
      <div className="row mb-4">
        {transport.images && transport.images.length > 0 ? (
          transport.images.map((img, index) => (
            <div key={index} className="col-md-4 mb-3">
              <img
                src={`http://localhost:5000${img}`}
                alt="Transport"
                className="img-fluid rounded shadow-sm"
                style={{ height: "250px", objectFit: "cover", width: "100%" }}
              />
            </div>
          ))
        ) : (
          <p>No images available</p>
        )}
      </div>

      {/* ---- Transport Details ---- */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4>Transport Information</h4>
          <hr />
          <p><strong>Vehicle:</strong> {transport.vehicle}</p>

          <p><strong>Vehicle Type:</strong> {transport.vehicleType}</p>
          <p><strong>Seats:</strong> {transport.seats}</p>
          <p><strong>Price Per 1km:</strong> Rs. {transport.pricePer1km}</p>
          <p>
            <strong>Available:</strong>{" "}
            <span style={{ color: transport.available ? "green" : "red" }}>
              {transport.available ? "Yes" : "No"}
            </span>
          </p>
          <p><strong>Description:</strong> {transport.description}</p>

          <p>
            <strong>Features:</strong>{" "}
            {transport.features?.length > 0
              ? transport.features.join(", ")
              : "Not specified"}
          </p>
        </div>
      </div>

      {/* ---- Provider Details ---- */}
      {transport.Provider && (
        <div className="card shadow-sm">
          <div className="card-body">
            <h4>Provider Information</h4>
            <hr />

            <p><strong>Name:</strong> {transport.Provider.name}</p>
            <p><strong>Email:</strong> {transport.Provider.email}</p>
            <p><strong>Phone:</strong> {transport.Provider.phone}</p>
            <p><strong>Rating:</strong> ⭐ {transport.Provider.rating}</p>
            <p><strong>Completed Trips:</strong> {transport.Provider.completedTrips}</p>
            <p><strong>Since:</strong> {transport.Provider.since}</p>

            <p>
              <strong>Verified:</strong>{" "}
              <span style={{ color: transport.Provider.verified ? "green" : "red" }}>
                {transport.Provider.verified ? "Verified" : "Not Verified"}
              </span>
            </p>

            <a href={`tel:${transport.Provider.phone}`} className="btn btn-primary mt-3">
              📞 Contact Provider
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransportDetailsPage;
