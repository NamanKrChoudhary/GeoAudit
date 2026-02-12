import jwt from "jsonwebtoken";
import User from "../models/User.model.js"; // Ensure this import exists!

// ADD THE 'async' KEYWORD HERE
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // NOW THE 'await' WILL WORK CORRECTLY
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = user; // Now req.user.email is available for your controller!
    next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Keep your dummy adminOnly as is
export const adminOnly = (req, res, next) => {
  next();
};
