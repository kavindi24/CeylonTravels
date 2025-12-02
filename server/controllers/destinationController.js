const { Destination, Highlight } = require("../models");

exports.addDestination = async (req, res) => {
  try {
    const data = JSON.parse(JSON.stringify(req.body)); // Ensure object
    const files = req.files || {};

    // Main image
    if (files.image && files.image[0]) {
      data.img = "/uploads/" + files.image[0].filename;
    }

    // Parse arrays
    data.hotels = JSON.parse(data.hotels || "[]");
    data.categories = JSON.parse(data.categories || "[]");
    data.activities = JSON.parse(data.activities || "[]");

    // Parse highlights
    let highlights = JSON.parse(data.highlights || "[]");
    // attach uploaded images to highlights if available
    if (files.highlights) {
      highlights = highlights.map((h, i) => ({
        ...h,
        image: "/uploads/" + files.highlights[i].filename
      }));
    }

    const destination = await Destination.create(data);

    // Save highlights
    for (const h of highlights) {
      await Highlight.create({ ...h, destinationId: destination.id });
    }

    res.json({ message: "Destination added successfully!", destination });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getDestinations = async (req, res) => {
  const destinations = await Destination.findAll({ include: Highlight });
  res.json(destinations);
};
