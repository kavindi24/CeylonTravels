const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Hotel = require("./Hotel");
const User = require("./User");

const HotelBooking = sequelize.define("HotelBooking", {
  checkIn: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  checkOut: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  guests: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Pending", // Pending | Confirmed | Cancelled
  }
});

// Associations
User.hasMany(HotelBooking, { foreignKey: "userId", onDelete: "CASCADE" });
HotelBooking.belongsTo(User, { foreignKey: "userId" });

Hotel.hasMany(HotelBooking, { foreignKey: "hotelId", onDelete: "CASCADE" });
HotelBooking.belongsTo(Hotel, { foreignKey: "hotelId" });

module.exports = HotelBooking;
