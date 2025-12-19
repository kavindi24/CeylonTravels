const express = require("express");
const router = express.Router();
const HotelBooking = require("../models/HotelBooking");
const User = require("../models/User");
const Hotel = require("../models/Hotel");

// GET all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await HotelBooking.findAll({
      include: [
        { model: User, attributes: ["id", "name", "email"] },
        { model: Hotel, attributes: ["id", "name"] }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// UPDATE booking status
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await HotelBooking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    booking.status = status;
    await booking.save();

    res.json({ message: "Status updated", booking });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
