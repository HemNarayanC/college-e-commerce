import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticateVendorOrAdmin = async (req, res, next) => {
  const token = req.cookies?.auth_token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || (!user.role.includes(vendor) && !user.role.includes(admin))) {
      return res.status(403).json({ message: "Forbidden: Access Denied" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
