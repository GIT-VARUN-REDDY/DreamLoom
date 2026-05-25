const mongoose = require("mongoose");

const storybookSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  babyName:    { type: String, required: true },
  parentName:  { type: String, default: "" },
  photos:      [{ type: String }],
  pdfFile:     { type: String },
  amountPaid:  { type: Number, default: 0 },
  paymentId:   { type: String, default: "" },
  orderId:     { type: String, default: "" },
  status:      { type: String, enum: ["pending","paid","generated"], default: "pending" },
  createdAt:   { type: Date, default: Date.now },
});

module.exports = mongoose.model("Storybook", storybookSchema);