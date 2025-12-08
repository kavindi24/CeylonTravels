const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // extracted user {id, email, role}
    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
