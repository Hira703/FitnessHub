// routes/admin/couponRoutes.js
const express = require("express");
const router = express.Router();
const verifyAdmin = require("../middlewares/verifyToken");

const { getAllCoupons, deleteCoupon, validateCoupon, createCoupon } = require("../controllers/CouponController");

// @route   POST /api/admin/create-coupon
// @desc    Admin creates a coupon
// @access  Private (Admin only)
router.post("/create-coupon", verifyAdmin, createCoupon);
router.get("/all-coupons", verifyAdmin, getAllCoupons);
router.delete("/delete-coupon/:id", verifyAdmin, deleteCoupon);


module.exports = router;
