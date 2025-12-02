const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const Destination = require("../models/Destination");
const Highlight = require("../models/Highlight");

// ---------------- Multer Setup ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

// Use upload.fields() to allow multiple file fields
const upload = multer({ storage });

// ---------------- Create Destination + Highlights ----------------
router.post("/full-create", upload.fields([
  { name: "images", maxCount: 10 },            // Destination images
  { name: "highlightImages", maxCount: 10 }    // Highlight images
]), async (req, res) => {
  try {
    const body = req.body;

    // Destination images
    const images = (req.files["images"] || []).map(file => "/uploads/" + file.filename);

    // Create Destination
    const destination = await Destination.create({
      name: body.name,
      img: images[0] || "",  // first image as main img
      description: body.description,
      detailedDescription: body.detailedDescription,
      bestFor: body.bestFor,
      bestTime: body.bestTime,
      weather: body.weather,
      province: body.province,
      rating: parseFloat(body.rating || 0),
      featured: body.featured === "true" || body.featured === true,
      hotels: body.hotels ? body.hotels.split(",").map(h => h.trim()) : [],
      categories: body.categories ? body.categories.split(",").map(c => c.trim()) : [],
      activities: body.activities ? body.activities.split(",").map(a => a.trim()) : [],
    });

    // Highlights
    let highlights = [];
    if (body.highlights) {
      const highlightsData = JSON.parse(body.highlights);
      const highlightFiles = req.files["highlightImages"] || [];
      for (let i = 0; i < highlightsData.length; i++) {
        const h = highlightsData[i];
        const highlight = await Highlight.create({
          name: h.name,
          description: h.description,
          image: highlightFiles[i] ? "/uploads/" + highlightFiles[i].filename : h.image || "",
          bestTime: h.bestTime,
          tips: h.tips,
          destinationId: destination.id
        });
        highlights.push(highlight);
      }
    }

    res.json({ destination, highlights });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- Get All Destinations ----------------
router.get("/", async (req, res) => {
  try {
    const destinations = await Destination.findAll({ include: Highlight });
    res.json(destinations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- Get Single Destination ----------------
router.get("/:id", async (req, res) => {
  try {
    const destination = await Destination.findByPk(req.params.id, { include: Highlight });
    if (!destination) return res.status(404).json({ error: "Destination not found" });
    res.json(destination);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- Update Destination + Highlights ----------------
router.put("/full-update/:id", upload.fields([
  { name: "images", maxCount: 10 },
  { name: "highlightImages", maxCount: 10 }
]), async (req, res) => {
  try {
    const body = req.body;
    const destination = await Destination.findByPk(req.params.id, { include: Highlight });
    if (!destination) return res.status(404).json({ error: "Destination not found" });

    // Update Destination
    const destImages = req.files["images"]?.map(f => "/uploads/" + f.filename) || [destination.img];
    await destination.update({
      name: body.name || destination.name,
      img: destImages[0],
      description: body.description || destination.description,
      detailedDescription: body.detailedDescription || destination.detailedDescription,
      bestFor: body.bestFor || destination.bestFor,
      bestTime: body.bestTime || destination.bestTime,
      weather: body.weather || destination.weather,
      province: body.province || destination.province,
      rating: parseFloat(body.rating || destination.rating),
      featured: body.featured === "true" || body.featured === true || destination.featured,
      hotels: body.hotels ? body.hotels.split(",").map(h => h.trim()) : destination.hotels,
      categories: body.categories ? body.categories.split(",").map(c => c.trim()) : destination.categories,
      activities: body.activities ? body.activities.split(",").map(a => a.trim()) : destination.activities,
    });

    // Replace all highlights if provided
    if (body.highlights) {
      await Highlight.destroy({ where: { destinationId: destination.id } });
      const highlightsData = JSON.parse(body.highlights);
      const highlightFiles = req.files["highlightImages"] || [];
      for (let i = 0; i < highlightsData.length; i++) {
        const h = highlightsData[i];
        await Highlight.create({
          name: h.name,
          description: h.description,
          image: highlightFiles[i] ? "/uploads/" + highlightFiles[i].filename : h.image || "",
          bestTime: h.bestTime,
          tips: h.tips,
          destinationId: destination.id
        });
      }
    }

    const updated = await Destination.findByPk(req.params.id, { include: Highlight });
    res.json(updated);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- Delete Destination ----------------
router.delete("/:id", async (req, res) => {
  try {
    const destination = await Destination.findByPk(req.params.id);
    if (!destination) return res.status(404).json({ error: "Destination not found" });
    await destination.destroy();
    res.json({ message: "Destination deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
