// ── authRoutes.js ─────────────────────────────────────
const express = require("express");
const router  = express.Router();
const { sendOTP, verifyOTP, verifyAdminPassword, debugBrevo } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/auth");

router.post("/send-otp",    sendOTP);
router.post("/verify-otp",  verifyOTP);
router.post("/admin-login", verifyAdminPassword);
router.get("/me",           authMiddleware, (req,res) => res.json({ success:true, user:req.user }));
router.get("/debug-brevo",  debugBrevo);

module.exports = router;