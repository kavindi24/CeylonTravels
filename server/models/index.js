const sequelize = require("../config/db");

const Destination = require("./Destination");
const Highlight = require("./Highlight");
const Provider = require("./Provider");
const Transport = require("./Transport");

/* ======================================================
   DESTINATION → HIGHLIGHTS  (One-to-Many)
====================================================== */
Destination.hasMany(Highlight, {
  foreignKey: "destinationId",
  onDelete: "CASCADE",
});
Highlight.belongsTo(Destination, {
  foreignKey: "destinationId",
});

/* ======================================================
   PROVIDER → TRANSPORTS  (One-to-Many)
====================================================== */
Provider.hasMany(Transport, {
  foreignKey: "providerId",
  onDelete: "CASCADE",
});
Transport.belongsTo(Provider, {
  foreignKey: "providerId",
});

/* ======================================================
   SYNC DATABASE
====================================================== */
async function syncDB() {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database synced successfully!");
  } catch (error) {
    console.error("Database sync error:", error);
  }
}

syncDB();

/* ======================================================
   EXPORT ALL MODELS
====================================================== */
module.exports = {
  Destination,
  Highlight,
  Provider,
  Transport,
};
