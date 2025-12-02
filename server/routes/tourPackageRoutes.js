const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const TourPackage = require("../models/TourPackage");
const Destination = require("../models/Destination");

// ---------------- Multer Setup ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ---------------- Create Tour Package ----------------
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const data = req.body;
    const file = req.file;

    // Image upload
    const image = file ? "/uploads/" + file.filename : null;

    // Parse JSON fields
    const highlights = JSON.parse(data.highlights || "[]");

    const tourPackage = await TourPackage.create({
      title: data.title,
      category: data.category,
      location: data.location,
      price: parseInt(data.price || 0),
      rating: parseFloat(data.rating || 0),
      duration: data.duration,
      image,
      highlights,
      destinationId: data.destinationId,
    });

    res.json({ message: "Tour package created successfully", tourPackage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- Get All Tour Packages ----------------
router.get("/", async (req, res) => {
  try {
    const packages = await TourPackage.findAll({
      include: { model: Destination, attributes: ["id", "name"] },
      order: [["createdAt", "DESC"]],
    });
    res.json(packages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- Get Single Tour Package ----------------
router.get("/:id", async (req, res) => {
  try {
    const tourPackage = await TourPackage.findByPk(req.params.id, {
      include: { model: Destination, attributes: ["id", "name"] },
    });
    if (!tourPackage) return res.status(404).json({ error: "Tour package not found" });
    res.json(tourPackage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- Update Tour Package ----------------
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const tourPackage = await TourPackage.findByPk(req.params.id);
    if (!tourPackage) return res.status(404).json({ error: "Tour package not found" });

    const data = req.body;
    const file = req.file;

    const image = file ? "/uploads/" + file.filename : tourPackage.image;

    const highlights = JSON.parse(data.highlights || JSON.stringify(tourPackage.highlights));

    await tourPackage.update({
      title: data.title,
      category: data.category,
      location: data.location,
      price: parseInt(data.price || tourPackage.price),
      rating: parseFloat(data.rating || tourPackage.rating),
      duration: data.duration,
      image,
      highlights,
      destinationId: data.destinationId || tourPackage.destinationId,
    });

    res.json({ message: "Tour package updated successfully", tourPackage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- Delete Tour Package ----------------
router.delete("/:id", async (req, res) => {
  try {
    const tourPackage = await TourPackage.findByPk(req.params.id);
    if (!tourPackage) return res.status(404).json({ error: "Tour package not found" });

    await tourPackage.destroy();
    res.json({ message: "Tour package deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
