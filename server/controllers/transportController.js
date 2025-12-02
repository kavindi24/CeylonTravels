const { Transport, Provider } = require("../models");

// ---------------- Get all transports ----------------
exports.getTransports = async (req, res) => {
  try {
    const transports = await Transport.findAll({ include: Provider });
    res.json(transports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ---------------- Get single transport ----------------
exports.getTransport = async (req, res) => {
  try {
    const transport = await Transport.findByPk(req.params.id, { include: Provider });
    res.json(transport);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ---------------- Create transport + provider ----------------
exports.createTransport = async (req, res) => {
  try {
    const data = req.body;

    const provider = await Provider.create({
      name: data.providerName,
      email: data.providerEmail,
      phone: data.providerPhone,
      rating: data.providerRating || 0,
      completedTrips: data.providerCompletedTrips || 0,
      since: data.providerSince || new Date().getFullYear(),
      verified: data.providerVerified || false,
    });

    const transport = await Transport.create({
      vehicleType: data.vehicleType,
      images: data.images || [],
      seats: data.seats,
      features: data.features || [],
      pricePer1km: data.pricePer1km,
      available: data.available !== undefined ? data.available : true,
      vehicle: data.vehicle,
      description: data.description,
      providerId: provider.id
    });

    res.json({ transport, provider });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ---------------- Update transport + provider ----------------
exports.updateTransport = async (req, res) => {
  try {
    const data = req.body;

    const transport = await Transport.findByPk(req.params.id, { include: Provider });
    if (!transport) return res.status(404).json({ error: "Transport not found" });

    await transport.update({
      vehicleType: data.vehicleType || transport.vehicleType,
      images: data.images || transport.images,
      seats: data.seats || transport.seats,
      features: data.features || transport.features,
      pricePer1km: data.pricePer1km || transport.pricePer1km,
      available: data.available !== undefined ? data.available : transport.available,
      vehicle: data.vehicle || transport.vehicle,
      description: data.description || transport.description,
    });

    if (transport.Provider) {
      await transport.Provider.update({
        name: data.providerName || transport.Provider.name,
        email: data.providerEmail || transport.Provider.email,
        phone: data.providerPhone || transport.Provider.phone,
        rating: data.providerRating || transport.Provider.rating,
        completedTrips: data.providerCompletedTrips || transport.Provider.completedTrips,
        since: data.providerSince || transport.Provider.since,
        verified: data.providerVerified !== undefined ? data.providerVerified : transport.Provider.verified,
      });
    }

    res.json({ transport });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ---------------- Delete transport + provider ----------------
exports.deleteTransport = async (req, res) => {
  try {
    const transport = await Transport.findByPk(req.params.id, { include: Provider });
    if (!transport) return res.status(404).json({ error: "Transport not found" });

    if (transport.Provider) await transport.Provider.destroy();
    await transport.destroy();

    res.json({ message: "Transport + Provider deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
