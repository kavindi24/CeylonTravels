const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateProfile, getLoggedUser } = require('../controllers/userController');
const auth = require("../middleware/auth");

// Register
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

// Get logged-in user
router.get("/me", auth, getLoggedUser);

// Update profile
router.put("/update-profile", auth, updateProfile);

module.exports = router;
