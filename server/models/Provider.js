const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Provider = sequelize.define("Provider", {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
  rating: DataTypes.FLOAT,
  completedTrips: DataTypes.INTEGER,
  since: DataTypes.STRING,
  verified: { type: DataTypes.BOOLEAN, defaultValue: false },
});

module.exports = Provider;
