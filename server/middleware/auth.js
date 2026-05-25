const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* ─────────────────────────────────────────────────────────
   Token support (ROBUST for mobile + web + WebView):
   1. Authorization: Bearer <token>
   2. ?token=<token> (URL fallback)
   3. body.token (mobile FormData fallback)
─────────────────────────────────────────────────────────── */
const extractToken = (req) => {
  // 1. Header (standard)
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    return header.split(" ")[1];
  }

  // 2. Query param (browser links / fallback)
  if (req.query?.token) {
    return req.query.token;
  }

  // 3. Body fallback (important for mobile FormData / WebView issues)
  if (req.body?.token) {
    return req.body.token;
  }

  return null;
};

const authMiddleware = async (req, res, next) => {
  try {
    const token = extractToken(req);

    // 🔍 DEBUG (very important for mobile issue)
    console.log("AUTH HEADERS:", req.headers.authorization);
    console.log("TOKEN RECEIVED:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    req.user = user;
    next();

  } catch (err) {
    console.log("JWT ERROR:", err.message); // 🔥 IMPORTANT DEBUG

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: err.message
    });
  }
};

const adminMiddleware = async (req, res, next) => {
  try {
    const token = extractToken(req);

    console.log("ADMIN AUTH TOKEN:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required"
      });
    }

    req.user = user;
    next();

  } catch (err) {
    console.log("ADMIN JWT ERROR:", err.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: err.message
    });
  }
};

module.exports = { authMiddleware, adminMiddleware };