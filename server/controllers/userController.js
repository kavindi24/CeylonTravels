// /controllers/userController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ---------- REGISTER ----------
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, phone, country } = req.body;

    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      phone,
      country,
      role: 'user' // default
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        country: newUser.country,
        role: newUser.role
      },
    });

  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ---------- LOGIN ----------
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role // important for admin protection
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        country: user.country,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ---------- ADMIN: GET ALL USERS ----------
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'phone', 'country', 'role', 'createdAt']
    });

    return res.status(200).json(users);

  } catch (error) {
    console.error('Get All Users Error:', error);
    return res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

//---------- Get logged-in user info----------
exports.getLoggedUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'phone', 'country', 'role']
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error("Get Logged User Error:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ---------- UPDATE PROFILE ----------
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // comes from auth middleware

    const { username, phone, country } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username || user.username;
    user.phone = phone || user.phone;
    user.country = country || user.country;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        country: user.country,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Update Profile Error:", error.message);
    return res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};
