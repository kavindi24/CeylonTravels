// server/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = require('./config/db');

// Import models
require('./models/User');
require('./models/Admin');
require('./models/Destination');
require('./models/Highlight');
require('./models/Hotel');
require('./models/TourPackage');
require('./models/Provider');
require('./models/Transport');

// Import routes
const userRoutes = require('./routes/userRoutes');  
const adminRoutes = require('./routes/adminRoutes'); 
const hotelRoutes = require("./routes/hotelRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const tourPackageRoutes = require("./routes/tourPackageRoutes");
const transportRoutes = require("./routes/transportRoutes");

// Import models for associations
require("./models/Provider");
require("./models/Transport");

const { Destination, Highlight } = require("./models"); 

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // serve images


// Test route
app.get('/', (req, res) => res.send('🚀 Server running'));

// API routes
app.use('/api/users', userRoutes);         // user login/register
app.use('/api/admins', adminRoutes);       // admin login + get users
app.use("/api/hotels", hotelRoutes);
app.use("/api/tour-packages", tourPackageRoutes);
app.use("/api/transports",require("./routes/transportRoutes"));
app.use("/api/destinations", require("./routes/destinationRoutes"));
app.use("/api/search", require("./routes/searchRoutes"));

// Sync DB
sequelize.sync({ alter: true })
  .then(() => console.log('📦 Models synced'))
  .catch(err => console.error('❌ Sync error:', err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server started on http://localhost:${PORT}`));
 