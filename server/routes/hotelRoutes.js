// routes/hotelRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const Hotel = require("../models/Hotel");
const Destination = require("../models/Destination");

// ---------------- Multer Setup ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ---------------- Create Hotel ----------------
router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    const data = req.body;
    const files = req.files || [];

    // Map uploaded images to array
    const images = files.map(f => "/uploads/" + f.filename);

    // Parse JSON fields
    const amenities = JSON.parse(data.amenities || "[]");
    const roomTypes = JSON.parse(data.roomTypes || "[]");
    const contact = JSON.parse(data.contact || "{}");
    const reviews = JSON.parse(data.reviews || "[]");

    // Create hotel
    const hotel = await Hotel.create({
      name: data.name,
      location: data.location,
      price: parseInt(data.price || 0),
      rating: parseFloat(data.rating || 0),
      description: data.description,
      fullDescription: data.fullDescription,
      images,
      amenities,
      roomTypes,
      contact,
      reviews,
      destinationId: data.destinationId,
    });

    res.json({ message: "Hotel created successfully", hotel });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- Get All Hotels ----------------
router.get("/", async (req, res) => {
  try {
    const hotels = await Hotel.findAll({
      include: { model: Destination, attributes: ["id", "name"] },
      order: [["createdAt", "DESC"]],
    });
    res.json(hotels);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- Get Single Hotel ----------------
router.get("/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id, {
      include: { model: Destination, attributes: ["id", "name"] },
    });
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });
    res.json(hotel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- Update Hotel ----------------
router.put("/:id", upload.array("images", 10), async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });

    const data = req.body;
    const files = req.files || [];

    // Map new images, fallback to old images if not provided
    const newImages = files.length > 0 ? files.map(f => "/uploads/" + f.filename) : hotel.images;

    // Parse JSON fields
    const amenities = JSON.parse(data.amenities || JSON.stringify(hotel.amenities));
    const roomTypes = JSON.parse(data.roomTypes || JSON.stringify(hotel.roomTypes));
    const contact = JSON.parse(data.contact || JSON.stringify(hotel.contact));
    const reviews = JSON.parse(data.reviews || JSON.stringify(hotel.reviews));

    await hotel.update({
      name: data.name,
      location: data.location,
      price: parseInt(data.price || hotel.price),
      rating: parseFloat(data.rating || hotel.rating),
      description: data.description,
      fullDescription: data.fullDescription,
      images: newImages,
      amenities,
      roomTypes,
      contact,
      reviews,
      destinationId: data.destinationId || hotel.destinationId,
    });

    res.json({ message: "Hotel updated successfully", hotel });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- Delete Hotel ----------------
router.delete("/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });

    await hotel.destroy();
    res.json({ message: "Hotel deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
