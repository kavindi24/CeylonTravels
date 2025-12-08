const HotelBooking = require("../models/HotelBooking");
const Hotel = require("../models/Hotel");
const { Op } = require("sequelize");

/**
 * @desc Book a hotel
 * @route POST /api/hotel/book
 * @access Protected (User only)
 */
exports.bookHotel = async (req, res) => {
  try {
    const userId = req.user.id; // logged user from auth middleware
    const { hotelId, checkIn, checkOut, guests } = req.body;

    if (!hotelId || !checkIn || !checkOut) {
      return res.status(400).json({ message: "Hotel, check-in, and check-out are required." });
    }

    // Check if hotel exists
    const hotel = await Hotel.findByPk(hotelId);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    // Check if date range overlaps with an existing booking
    const existingBooking = await HotelBooking.findOne({
      where: {
        hotelId,
        [Op.or]: [
          {
            checkIn: { [Op.between]: [checkIn, checkOut] },
          },
          {
            checkOut: { [Op.between]: [checkIn, checkOut] },
          }
        ]
      }
    });

    if (existingBooking) {
      return res.status(409).json({ message: "Hotel is not available for the selected dates." });
    }

    // Calculate price
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = hotel.price * days;

    // Save booking
    const booking = await HotelBooking.create({
      userId,
      hotelId,
      checkIn,
      checkOut,
      guests: guests || 1,
      totalPrice,
      status: "Pending Payment"
    });

    res.status(201).json({
      message: "Hotel booked successfully. Proceed to payment.",
      booking,
      redirect: "/payment" // frontend will use this
    });

  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Booking failed", error: error.message });
  }
};


/**
 * @desc Fetch all bookings for logged-in user
 * @route GET /api/hotel/bookings
 * @access Protected
 */
exports.getUserHotelBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await HotelBooking.findAll({
      where: { userId },
      include: [{ model: Hotel }]
    });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
  }
};
