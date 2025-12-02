const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Destination = sequelize.define("Destination", {
  name: DataTypes.STRING,
  img: DataTypes.STRING,
  description: DataTypes.TEXT,
  bestFor: DataTypes.STRING,
  bestTime: DataTypes.STRING,
  weather: DataTypes.STRING,
  province: DataTypes.STRING,
  detailedDescription: DataTypes.TEXT,
  rating: { type: DataTypes.FLOAT, defaultValue: 0 },
  featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  hotels: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  categories: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  activities: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
});

module.exports = Destination;
