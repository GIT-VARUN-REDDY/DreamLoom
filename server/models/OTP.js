const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  identifier: { type: String, required: true },
  mobile:     { type: String, default: "" },
  otp:        { type: String, required: true },
  expiresAt:  { type: Date, required: true },
  attempts:   { type: Number, default: 0 },
  createdAt:  { type: Date, default: Date.now, expires: 300 },
});

module.exports = mongoose.model("OTP", otpSchema);