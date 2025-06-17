// middlewares/authMiddleware.js

import jwt from "jsonwebtoken";
import User from "../models/User";

// Replace this with your secret (store in env in production)
const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user to request (optional: fetch from DB)
    const user = await User.findById(decoded.userId).select("-passwordHash");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    req.user = user; // You can access user info in routes using req.user
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized: Token invalid or expired" });
  }
};

export default authenticate;
