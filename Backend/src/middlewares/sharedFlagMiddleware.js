
import jwt from "jsonwebtoken";

// middlewares/authenticateUserOrVendor.js
const authenticateUserOrVendor = (req, res, next) => {
  const token = req.cookies?.userToken; // ⬅️ Read from cookie

  if (!token) {
    return res.status(401).json({ message: "Authentication token missing in cookie" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ⬅️ Attach user data to req
    console.log("Authenticated user or vendor:", req.user); // ⬅️ Log for debugging
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authenticateUserOrVendor;
