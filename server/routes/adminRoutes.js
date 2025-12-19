const express = require("express");
const router = express.Router();
const { 
  adminLogin, 
  getAllUsers, 
  getAllHotelBookings,
  updateHotelBookingStatus
} = require("../controllers/adminController");

// Admin login
router.post("/login", adminLogin);

// Get all users
router.get("/users", getAllUsers);

// Get all hotel bookings
router.get("/hotel-bookings", getAllHotelBookings);


// Update hotel booking status
router.put("/hotel-bookings/:id/status", updateHotelBookingStatus);


module.exports = router;
