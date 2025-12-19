const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  bookTransport,
  getUserTransportBookings
} = require("../controllers/transportBookingController");

router.post("/book", auth, bookTransport);
router.get("/bookings", auth, getUserTransportBookings);

module.exports = router;
