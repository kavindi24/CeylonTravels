// src/pages/public/DestinationDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function DestinationDetailsPage() {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/destinations/${id}`);
        setDestination(res.data);
      } catch (err) {
        console.error("Error fetching destination:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDestination();
  }, [id]);

  if (loading) return <p className="text-center mt-5">Loading destination...</p>;
  if (!destination) return <p className="text-center mt-5 text-muted">Destination not found.</p>;

  const mainImage = destination.img ? `http://localhost:5000${destination.img}` : "/placeholder.jpg";

  return (
    <div className="container my-4">
      <Link to="/listings/destinations" className="btn btn-secondary mb-3">
        &larr; Back to all destinations
      </Link>

      <div className="card shadow-sm">
        <img
          src={mainImage}
          alt={destination.name}
          className="card-img-top"
          style={{ objectFit: "cover", height: "400px" }}
          onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder.jpg"; }}
        />
        <div className="card-body">
          <h2 className="card-title">{destination.name}</h2>
          <p className="text-muted">{destination.province}</p>
          <p>{destination.description}</p>
          {destination.detailedDescription && <p>{destination.detailedDescription}</p>}

          <div className="mb-3">
            <strong>Best For:</strong> {destination.bestFor || "N/A"} <br />
            <strong>Best Time to Visit:</strong> {destination.bestTime || "N/A"} <br />
            <strong>Weather:</strong> {destination.weather || "N/A"} <br />
            <strong>Rating:</strong> {destination.rating || 0} / 5
          </div>

          {destination.hotels && destination.hotels.length > 0 && (
            <div className="mb-3">
              <strong>Nearby Hotels:</strong>
              <ul>
                {destination.hotels.map((hotel, idx) => (
                  <li key={idx}>{hotel}</li>
                ))}
              </ul>
            </div>
          )}

          {destination.categories && destination.categories.length > 0 && (
            <div className="mb-3">
              <strong>Categories:</strong> {destination.categories.join(", ")}
            </div>
          )}

          {destination.activities && destination.activities.length > 0 && (
            <div className="mb-3">
              <strong>Activities:</strong> {destination.activities.join(", ")}
            </div>
          )}

          {destination.Highlights && destination.Highlights.length > 0 && (
            <div className="mt-4">
              <h4>Highlights</h4>
              <div className="row">
                {destination.Highlights.map((highlight, idx) => {
                  const highlightImg = highlight.image
                    ? `http://localhost:5000${highlight.image}`
                    : "/placeholder.jpg";

                  return (
                    <div key={idx} className="col-md-4 mb-3">
                      <div className="card h-100">
                        <img
                          src={highlightImg}
                          alt={highlight.name}
                          className="card-img-top"
                          style={{ height: "150px", objectFit: "cover" }}
                          onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder.jpg"; }}
                        />
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title">{highlight.name}</h5>
                          <p className="card-text flex-grow-1">{highlight.description || "No description"}</p>
                          {highlight.bestTime && <small className="text-muted">Best Time: {highlight.bestTime}</small>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DestinationDetailsPage;
