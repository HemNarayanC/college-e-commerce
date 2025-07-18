import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header for Bearer token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } 
    // Fallback: Token from cookie (optional)
    else if (req.headers.cookie?.includes("userToken=")) {
      token = req.headers.cookie.split("userToken=")[1].split(";")[0]; // in case of multiple cookies
    }

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded payload (e.g., id, role) to req.user
    console.log("Authenticated user:", req.user); 

    next(); // Proceed to next middleware/route
  } catch (err) {
    return res.status(403).json({ error: `Forbidden: ${err.message}` });
  }
};

export default auth;
