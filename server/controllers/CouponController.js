// controllers/couponController.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Coupon = require("../models/Coupon");

exports.createCoupon = async (req, res) => {
  try {
    const { code, percentOff, amountOff, duration } = req.body;

    const stripeCoupon = await stripe.coupons.create({
      id: code,
      name: code,
      percent_off: percentOff || undefined,
      amount_off: amountOff ? amountOff * 100 : undefined,
      currency: amountOff ? "usd" : undefined,
      duration,
    });

    const newCoupon = new Coupon({
      code,
      percentOff,
      amountOff,
      duration,
      stripeId: stripeCoupon.id,
    });

    await newCoupon.save();
    res.status(201).json({ success: true, coupon: newCoupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Get all coupons (Admin only)
exports.getAllCoupons = async (req, res) => {
    try {
      const coupons = await Coupon.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, coupons });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  // Delete a coupon (Admin only)
  exports.deleteCoupon = async (req, res) => {
    try {
      const { id } = req.params;
  
      const coupon = await Coupon.findById(id);
      if (!coupon) {
        return res.status(404).json({ success: false, message: "Coupon not found" });
      }
  
      // Delete from Stripe
      await stripe.coupons.del(coupon.stripeId);
  
      // Delete from DB
      await Coupon.findByIdAndDelete(id);
  
      res.status(200).json({ success: true, message: "Coupon deleted" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  // Validate coupon (used in checkout)
 