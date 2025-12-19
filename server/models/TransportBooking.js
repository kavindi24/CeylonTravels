const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Transport = require("./Transport");

const TransportBooking = sequelize.define("TransportBooking", {
  pickupLocation: DataTypes.STRING,
  dropLocation: DataTypes.STRING,
  date: DataTypes.DATE,
  passengers: DataTypes.INTEGER,
  totalPrice: DataTypes.FLOAT,
  status: {
    type: DataTypes.STRING,
    defaultValue: "Pending"
  }
});

User.hasMany(TransportBooking, { foreignKey: "userId" });
TransportBooking.belongsTo(User, { foreignKey: "userId" });

Transport.hasMany(TransportBooking, { foreignKey: "transportId" });
TransportBooking.belongsTo(Transport, { foreignKey: "transportId" });

module.exports = TransportBooking;
