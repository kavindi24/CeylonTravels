const sequelize = require("../config/db");

// Import all models
const Destination = require("./Destination");
const Highlight = require("./Highlight");
const Provider = require("./Provider");
const Transport = require("./Transport");
const Hotel = require("./Hotel");
const User = require("./User");
const HotelBooking = require("./HotelBooking");
const TourPackage = require("./TourPackage");
const TourPackageBooking = require("./TourPackageBooking");

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

// DESTINATION → TOUR PACKAGES (1:M)
Destination.hasMany(TourPackage, { foreignKey: "destinationId", onDelete: "CASCADE" });
TourPackage.belongsTo(Destination, { foreignKey: "destinationId" });

// USER → HOTEL BOOKINGS (1:M)
User.hasMany(HotelBooking, { foreignKey: "userId", onDelete: "CASCADE" });
HotelBooking.belongsTo(User, { foreignKey: "userId" });

// USER → TOUR PACKAGE BOOKINGS (1:M)
User.hasMany(TourPackageBooking, { foreignKey: "userId", onDelete: "CASCADE" });
TourPackageBooking.belongsTo(User, { foreignKey: "userId" });

// TOUR PACKAGE → TOUR PACKAGE BOOKINGS (1:M)
TourPackage.hasMany(TourPackageBooking, { foreignKey: "packageId", onDelete: "CASCADE" });
TourPackageBooking.belongsTo(TourPackage, { foreignKey: "packageId" });

// HOTEL → HOTEL BOOKINGS (1:M)
Hotel.hasMany(HotelBooking, { foreignKey: "hotelId", onDelete: "CASCADE" });
HotelBooking.belongsTo(Hotel, { foreignKey: "hotelId" });




// ====================
// Sync DB
// ====================
async function syncDB() {
  try {
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
  TourPackage,          
  TourPackageBooking,   
};
