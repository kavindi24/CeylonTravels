const express = require("express");
const router = express.Router();
const Destination = require("../models/Destination");
const Hotel = require("../models/Hotel");

router.get("/", async (req, res) => {
  const { query, category } = req.query;
  const q = query?.toLowerCase() || "";

  try {
    let results = [];

    if (category === "destinations") {
      results = await Destination.findAll({
        where: {
          name: sequelize.where(
            sequelize.fn("LOWER", sequelize.col("name")),
            "LIKE",
            `%${q}%`
          ),
        },
      });
    } else if (category === "hotels") {
      results = await Hotel.findAll({
        where: {
          name: sequelize.where(
            sequelize.fn("LOWER", sequelize.col("name")),
            "LIKE",
            `%${q}%`
          ),
        },
      });
    } else {
      const [dests, hotels] = await Promise.all([
        Destination.findAll({
          where: {
            name: sequelize.where(
              sequelize.fn("LOWER", sequelize.col("name")),
              "LIKE",
              `%${q}%`
            ),
          },
        }),
        Hotel.findAll({
          where: {
            name: sequelize.where(
              sequelize.fn("LOWER", sequelize.col("name")),
              "LIKE",
              `%${q}%`
            ),
          },
        }),
      ]);
      results = [...dests, ...hotels]; // Merge
    }

    res.json(results);
  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).json({ error: "Search failed" });
  }
});

module.exports = router;