const sequelize = require("../config/db");

// Import all models
const Destination = require("./Destination");
const Highlight = require("./Highlight");
const Provider = require("./Provider");
const Transport = require("./Transport");
const Hotel = require("./Hotel");
const User = require("./User");
const HotelBooking = require("./HotelBooking");

// ====================
// Associations
// ====================

// DESTINATION → HIGHLIGHTS (1:M)
Destination.hasMany(Highlight, { foreignKey: "destinationId", onDelete: "CASCADE" });
Highlight.belongsTo(Destination, { foreignKey: "destinationId" });

// PROVIDER → TRANSPORTS (1:M)
Provider.hasMany(Transport, { foreignKey: "providerId", onDelete: "CASCADE" });
Transport.belongsTo(Provider, { foreignKey: "providerId" });

// DESTINATION → HOTELS (1:M)
Destination.hasMany(Hotel, { foreignKey: "destinationId", onDelete: "CASCADE" });
Hotel.belongsTo(Destination, { foreignKey: "destinationId" });

// USER → HOTEL BOOKINGS (1:M)
User.hasMany(HotelBooking, { foreignKey: "userId", onDelete: "CASCADE" });
HotelBooking.belongsTo(User, { foreignKey: "userId" });

// HOTEL → HOTEL BOOKINGS (1:M)
Hotel.hasMany(HotelBooking, { foreignKey: "hotelId", onDelete: "CASCADE" });
HotelBooking.belongsTo(Hotel, { foreignKey: "hotelId" });

// ====================
// Sync DB
// ====================
async function syncDB() {
  try {
    // Use { alter: true } to avoid dropping tables, only adjust columns
    await sequelize.sync({ alter: true });
    console.log("Database synced successfully!");
  } catch (error) {
    console.error("Database sync error:", error);
  }
}

syncDB();

// ====================
// Export all models
// ====================
module.exports = {
  Destination,
  Highlight,
  Provider,
  Transport,
  Hotel,
  User,
  HotelBooking,
};
