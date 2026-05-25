const jwt  = require("jsonwebtoken");
const User = require("../models/User");

/* ─────────────────────────────────────────────────────────
   Supports two ways to pass JWT:
   1. Authorization: Bearer <token>   — normal API calls
   2. ?token=<token> in URL           — direct browser links
      (preview/download PDFs in new tab)
─────────────────────────────────────────────────────────── */
const extractToken = (req) => {
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) return header.split(" ")[1];
  if (req.query.token) return req.query.token;
  return null;
};

const authMiddleware = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ success: false, message: "No token provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: "User not found" });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

const adminMiddleware = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ success: false, message: "No token provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(decoded.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }
    req.user = user;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = { authMiddleware, adminMiddleware };