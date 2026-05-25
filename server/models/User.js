const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  mobile:        { type: String, required: true, unique: true, trim: true },
  email:         { type: String, trim: true, default: "" },
  name:          { type: String, trim: true, default: "" },
  role:          { type: String, enum: ["user", "admin"], default: "user" },
  isFirstThirty: { type: Boolean, default: false },
  discountUsed:  { type: Boolean, default: false },
  totalOrders:   { type: Number, default: 0 },
  createdAt:     { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);