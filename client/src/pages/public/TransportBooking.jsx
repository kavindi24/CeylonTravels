import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function TransportBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transport, setTransport] = useState(null);

  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);

  const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

  useEffect(() => {
    const fetchTransport = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/transports/${id}`);
        setTransport(res.data);
      } catch (err) {
        console.error("Failed to load transport", err);
      }
    };
    fetchTransport();
  }, [id]);

  const handleBooking = async () => {
    if (!token) {
      alert("You must login first!");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/transports/book",
        {
          transportId: id,
          pickupLocation,
          dropLocation,
          date,
          passengers,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Transport booked successfully!");
      navigate("/dashboard/customer");
    } catch (err) {
      console.error(err);
      alert("Booking failed!");
    }
  };

  if (!transport) return <p>Loading transport details...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Book Transport</h2>
      
      <div className="border p-4 rounded mb-4">
        <h3 className="text-xl font-semibold">{transport.name}</h3>
        <p>Type: {transport.vehicleType}</p>
        <p>Price per km: Rs. {transport.pricePer1km}</p>
      </div>

      <div className="mb-3">
        <label className="block font-medium">Pickup Location</label>
        <input
          type="text"
          value={pickupLocation}
          className="border w-full p-2"
          onChange={(e) => setPickupLocation(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="block font-medium">Drop Location</label>
        <input
          type="text"
          value={dropLocation}
          className="border w-full p-2"
          onChange={(e) => setDropLocation(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="block font-medium">Pickup Date</label>
        <input
          type="date"
          value={date}
          className="border w-full p-2"
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="mb-5">
        <label className="block font-medium">Passengers</label>
        <input
          type="number"
          value={passengers}
          min="1"
          className="border w-full p-2"
          onChange={(e) => setPassengers(e.target.value)}
        />
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleBooking}
      >
        Book Now
      </button>
    </div>
  );
}

export default TransportBooking;
