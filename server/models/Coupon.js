// models/Coupon.js
const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  percentOff: { type: Number, default: null },
  amountOff: { type: Number, default: null }, // in dollars
  duration: { type: String, enum: ["once", "repeating", "forever"], default: "once" },
  stripeId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Coupon", couponSchema);
