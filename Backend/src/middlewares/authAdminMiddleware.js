import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authenticateAdmin = async (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header for Bearer token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } 
    // Fallback: Token from cookie (optional)
    else if (req.headers.cookie?.includes("token=")) {
      token = req.headers.cookie.split("token=")[1].split(";")[0];
    }

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    req.user = { id: user._id, role: user.role, email: user.email };
    next();
  } catch (err) {
    return res.status(403).json({ error: `Forbidden: ${err.message}` });
  }
};

export default authenticateAdmin;
