const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const Transport = require("../models/Transport");
const Provider = require("../models/Provider");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ---------------- Create Transport + Provider ----------------
router.post("/full-create", upload.array("images", 10), async (req, res) => {
  try {
    const body = req.body;
    const files = req.files || [];

    const images = files.map(file => "/uploads/" + file.filename);

    // Create Provider
    const provider = await Provider.create({
      name: body.providerName,
      email: body.providerEmail,
      phone: body.providerPhone,
      rating: parseFloat(body.providerRating || 0),
      completedTrips: parseInt(body.providerCompletedTrips || 0),
      since: parseInt(body.providerSince || new Date().getFullYear()),
      verified: body.providerVerified === 'true' || body.providerVerified === true,
    });

    // Create Transport
    const transport = await Transport.create({
      vehicleType: body.vehicleType,
      images,
      seats: parseInt(body.seats),
      features: body.features ? body.features.split(",").map(f => f.trim()) : [],
      pricePer1km: parseFloat(body.pricePer1km),
      available: body.available === 'false' ? false : true,
      vehicle: body.vehicle,
      description: body.description,
      providerId: provider.id
    });

    res.json({ transport, provider });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

// ---------------- Get All Transports ----------------
router.get("/", async (req, res) => {
  try {
    const transports = await Transport.findAll({ include: Provider });
    res.json(transports);
    } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
    }
});

// ---------------- Get Single Transport ----------------
router.get("/:id", async (req, res) => {
  try {
    const transport = await Transport.findByPk(req.params.id, { include: Provider });
    if (!transport) return res.status(404).json({ error: "Transport not found" });
    res.json(transport);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- Update Transport + Provider ----------------
router.put("/full-update/:id", upload.array("images", 10), async (req, res) => {
  try {
    const body = req.body;
    const files = req.files || [];
    const transport = await Transport.findByPk(req.params.id, { include: Provider });
    if (!transport) return res.status(404).json({ error: "Transport not found" });
    const images = files.length > 0 ? files.map(file => "/uploads/" + file.filename) : transport.images;
    // Update Provider
    await transport.Provider.update({
        name: body.providerName,
        email: body.providerEmail,
        phone: body.providerPhone,
        rating: parseFloat(body.providerRating || transport.Provider.rating),
        completedTrips: parseInt(body.providerCompletedTrips || transport.Provider.completedTrips),
        since: parseInt(body.providerSince || transport.Provider.since),
        verified: body.providerVerified === 'true' || body.providerVerified === true || transport.Provider.verified,
    });
    // Update Transport
    await transport.update({
        vehicleType: body.vehicleType,
        images,
        seats: parseInt(body.seats),
        features: body.features ? body.features.split(",").map(f => f.trim()) : transport.features,
        pricePer1km: parseFloat(body.pricePer1km),
        available: body.available === 'false' ? false : true,
        vehicle: body.vehicle,
        description: body.description,
    });
      res.json({ transport });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });
// ---------------- Delete Transport ----------------
router.delete("/:id", async (req, res) => {
  try {
    const transport = await Transport.findByPk(req.params.id);
    if (!transport) return res.status(404).json({ error: "Transport not found" });
    await transport.destroy();
    res.json({ message: "Transport deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
