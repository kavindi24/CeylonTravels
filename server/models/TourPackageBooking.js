const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const TourPackage = require("./TourPackage");

const TourPackageBooking = sequelize.define("TourPackageBooking", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  packageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },

  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },

  guests: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },

  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  status: {
    type: DataTypes.ENUM("Pending Payment", "Confirmed", "Cancelled"),
    defaultValue: "Pending Payment",
  },
});

// ================= ASSOCIATIONS =================

// A user can book many tour packages
User.hasMany(TourPackageBooking, { foreignKey: "userId", onDelete: "CASCADE" });
TourPackageBooking.belongsTo(User, { foreignKey: "userId" });

// A tour package can have many bookings
TourPackage.hasMany(TourPackageBooking, { foreignKey: "packageId", onDelete: "CASCADE" });
TourPackageBooking.belongsTo(TourPackage, { foreignKey: "packageId" });

module.exports = TourPackageBooking;
