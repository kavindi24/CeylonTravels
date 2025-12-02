const { TourPackage, Destination } = require("../models");

exports.addTourPackage = async (req, res) => {
  try {
    const data = JSON.parse(JSON.stringify(req.body)); // ensure object

    // Parse arrays safely
    const highlights = JSON.parse(data.highlights || "[]");

    const tourPackage = await TourPackage.create({
      title: data.title,
      category: data.category,
      location: data.location,
      price: parseInt(data.price || 0),
      rating: parseFloat(data.rating || 0),
      duration: data.duration,
      image: data.image || null,
      highlights,
      destinationId: data.destinationId
    });

    res.json({ message: "Tour package added successfully!", tourPackage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getTourPackages = async (req, res) => {
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
};

exports.getTourPackage = async (req, res) => {
  try {
    const pack = await TourPackage.findByPk(req.params.id, {
      include: { model: Destination, attributes: ["id", "name"] },
    });
    if (!pack) return res.status(404).json({ error: "Tour package not found" });
    res.json(pack);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateTourPackage = async (req, res) => {
  try {
    const pack = await TourPackage.findByPk(req.params.id);
    if (!pack) return res.status(404).json({ error: "Tour package not found" });

    const data = JSON.parse(JSON.stringify(req.body));

    const highlights = data.highlights ? JSON.parse(data.highlights) : pack.highlights;
    const reviews = data.reviews ? JSON.parse(data.reviews) : pack.reviews;

    await pack.update({
      title: data.title || pack.title,
      category: data.category || pack.category,
      location: data.location || pack.location,
      price: parseInt(data.price || pack.price),
      rating: parseFloat(data.rating || pack.rating),
      duration: data.duration || pack.duration,
      image: data.image || pack.image,
      highlights,
      destinationId: data.destinationId || pack.destinationId
    });

    res.json({ message: "Tour package updated successfully!", tourPackage: pack });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteTourPackage = async (req, res) => {
  try {
    const pack = await TourPackage.findByPk(req.params.id);
    if (!pack) return res.status(404).json({ error: "Tour package not found" });

    await pack.destroy();
    res.json({ message: "Tour package deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
