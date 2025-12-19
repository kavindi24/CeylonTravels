const TransportBooking = require("../models/TransportBooking");
const Transport = require("../models/Transport");

exports.bookTransport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { transportId, pickupLocation, dropLocation, date, passengers } = req.body;
    
    const transport = await Transport.findByPk(transportId);
    if (!transport) return res.status(404).json({ message: "Transport not found" });

    const totalPrice = passengers * transport.price;

    const booking = await TransportBooking.create({
      userId,
      transportId,
      pickupLocation,
      dropLocation,
      date,
      passengers,
      totalPrice,
    });

    res.status(201).json({ message: "Transport booked", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking failed", error: err.message });
  }
};

exports.getUserTransportBookings = async (req, res) => {
  try {
    const bookings = await TransportBooking.findAll({
      where: { userId: req.user.id },
      include: [{ model: Transport }]
    });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};
