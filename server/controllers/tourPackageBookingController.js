const TourPackageBooking = require("../models/TourPackageBooking");
const TourPackage = require("../models/TourPackage");
const { Op } = require("sequelize");

/**
 * @desc Book a tour package
 * @route POST /api/tour-packages/book
 * @access Protected (User only)
 */
exports.bookTourPackage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { packageId, startDate, endDate, guests } = req.body;

    if (!packageId || !startDate || !endDate) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const tourPackage = await TourPackage.findByPk(packageId);
    if (!tourPackage) return res.status(404).json({ message: "Tour package not found" });

    const existingBooking = await TourPackageBooking.findOne({
      where: {
        packageId,
        [Op.or]: [
          { startDate: { [Op.between]: [startDate, endDate] } },
          { endDate: { [Op.between]: [startDate, endDate] } },
        ],
      },
    });

    if (existingBooking) {
      return res.status(409).json({ message: "Tour package is not available for selected dates." });
    }

    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const totalPrice = tourPackage.price * days * (guests || 1);

    const booking = await TourPackageBooking.create({
      userId,
      packageId,
      startDate,
      endDate,
      guests: guests || 1,
      totalPrice,
      status: "Pending Payment",
    });

    res.status(201).json({
      message: "Tour package booked successfully. Proceed to payment.",
      booking,
      redirect: "/payment",
    });

  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Booking failed", error: error.message });
  }
};

/**
 * @desc Fetch all tour package bookings for logged-in user
 * @route GET /api/tour-packages/bookings
 * @access Protected
 */
exports.getUserTourBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await TourPackageBooking.findAll({
      where: { userId },
      include: [{ model: TourPackage }],
      order: [["createdAt", "DESC"]],
    }); 
    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Fetch Bookings Error:", error);
    res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
  }
};
