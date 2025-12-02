const express = require("express");
const router = express.Router();
const { getAllUsers, adminLogin } = require("../controllers/adminController");

// Admin login stays protected
router.post("/login", adminLogin);

// Make users route public (remove adminAuth)
router.get("/users", getAllUsers);

module.exports = router;
