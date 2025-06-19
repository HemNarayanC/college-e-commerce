import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authenticateVendor = async (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header for Bearer token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    // Fallback: Token from cookie named 'vendorToken'
    else if (req.headers.cookie?.includes("vendorToken=")) {
      token = req.headers.cookie
        .split("vendorToken=")[1]
        .split(";")[0]
        .trim();
    }

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id); // Use 'id', not 'userId'

    if (!user || user.role !== "vendor") {
      return res.status(403).json({ error: "Access denied. Vendors only." });
    }

    req.user = { id: user._id, role: user.role, email: user.email, vendorId: decoded.vendorId };
    next();
  } catch (err) {
    return res.status(403).json({ error: `Forbidden: ${err.message}` });
  }
};

export default authenticateVendor;
