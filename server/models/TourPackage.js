const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Destination = require("./Destination");

const TourPackage = sequelize.define("TourPackage", {
  title: DataTypes.STRING,
  category: DataTypes.STRING,
  location: DataTypes.STRING,
  price: DataTypes.INTEGER,
  rating: DataTypes.FLOAT,
  duration: DataTypes.STRING,
  image: DataTypes.STRING,
  highlights: DataTypes.JSON,
});

// Associations
Destination.hasMany(TourPackage, { foreignKey: "destinationId", onDelete: "CASCADE" });
TourPackage.belongsTo(Destination, { foreignKey: "destinationId" });

module.exports = TourPackage;
