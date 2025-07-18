import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authenticateVendor = async (req, res, next) => {
  try {
    let token = null;

    // First check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    // Fallback: check cookie
    else if (req.headers.cookie?.includes("userToken=")) {
      token = req.headers.cookie
        .split("userToken=")[1]
        .split(";")[0]
        .trim();
    }

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (
      !user ||
      !user.role ||
      !Array.isArray(user.role) ||
      !user.role.includes("vendor")git 
    ) {
      return res.status(403).json({ error: "Access denied. Vendors only." });
    }

    // Attach vendor user data
    req.user = {
      id: user._id,
      role: user.role,
      email: user.email,
      vendorId: decoded.vendorId || null, // optional if embedded in token
    };

    next();
  } catch (err) {
    return res.status(403).json({ error: `Forbidden: ${err.message}` });
  }
};

export default authenticateVendor;
