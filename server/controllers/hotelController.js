const Hotel = require("../models/Hotel");

exports.getHotels = async (req, res) => {
  const hotels = await Hotel.findAll({
    where: { destinationId: req.params.destinationId }
  });
  res.json(hotels);
};

exports.getHotel = async (req, res) => {
  const hotel = await Hotel.findByPk(req.params.id);
  res.json(hotel);
};

exports.createHotel = async (req, res) => {
  const newHotel = await Hotel.create(req.body);
  res.json(newHotel);
};

exports.updateHotel = async (req, res) => {
  await Hotel.update(req.body, { where: { id: req.params.id } });
  const updated = await Hotel.findByPk(req.params.id);
  res.json(updated);
};

exports.deleteHotel = async (req, res) => {
  await Hotel.destroy({ where: { id: req.params.id } });
  res.json({ message: "Hotel deleted" });
};
