const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Provider = require("./Provider");

const Transport = sequelize.define("Transport", {
  vehicleType: DataTypes.STRING,
  images: DataTypes.JSON,
  seats: DataTypes.INTEGER,
  features: DataTypes.JSON,
  pricePer1km: DataTypes.INTEGER,
  available: DataTypes.BOOLEAN,
  vehicle: DataTypes.STRING,
  description: DataTypes.TEXT,
});

// Relations
Provider.hasMany(Transport, { foreignKey: "providerId" });
Transport.belongsTo(Provider, { foreignKey: "providerId" });

module.exports = Transport;
