const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Destination = require("./Destination");

const Hotel = sequelize.define("Hotel", {
  name: DataTypes.STRING,
  location: DataTypes.STRING,
  price: DataTypes.INTEGER,
  rating: DataTypes.FLOAT,
  images: DataTypes.JSON,
  description: DataTypes.TEXT,
  fullDescription: DataTypes.TEXT,
  amenities: DataTypes.JSON,
  roomTypes: DataTypes.JSON,
  contact: DataTypes.JSON,
  reviews: DataTypes.JSON,
});

// Associations
Destination.hasMany(Hotel, { foreignKey: "destinationId", onDelete: "CASCADE" });
Hotel.belongsTo(Destination, { foreignKey: "destinationId" });

module.exports = Hotel;
