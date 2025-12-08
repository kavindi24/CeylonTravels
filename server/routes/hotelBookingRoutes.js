const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { bookHotel, getUserHotelBookings } = require("../controllers/hotelBookingController");

router.post("/book", auth, bookHotel);
router.get("/bookings", auth, getUserHotelBookings);

module.exports = router;
