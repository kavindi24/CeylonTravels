const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  bookTourPackage,getUserTourBookings
} = require("../controllers/tourPackageBookingController");

// Book tour package
router.post("/book", auth, bookTourPackage);

// Get bookings for logged user
router.get("/bookings", auth, getUserTourBookings);

module.exports = router;
