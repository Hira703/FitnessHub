const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const Trainer = require('../models/Trainer');
const Class = require('../models/Class');
const Subscriber = require('../models/NewsletterSubscriber');

const Coupon = require("../models/Coupon"); // Adjust path based on your structure

exports.createPaymentIntent = async (req, res) => {
  const { price, couponCode } = req.body;

  try {
    let finalAmount = parseFloat(price); // initial price in dollars

    //  Step 1: Validate coupon if provided
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode });

      if (!coupon) {
        return res.status(400).json({ error: "Invalid coupon code." });
      }

      if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
        return res.status(400).json({ error: "Coupon has expired." });
      }

      if (coupon.percentOff) {
        finalAmount = finalAmount - (finalAmount * coupon.percentOff) / 100;
      } else if (coupon.amountOff) {
        finalAmount = finalAmount - coupon.amountOff;
      }

      if (finalAmount < 0) finalAmount = 0;
    }

    const amountInCents = Math.round(finalAmount * 100);

    //  Step 2: Create payment intent with final amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      payment_method_types: ["card"],
    });

    //  Step 3: Return secret and final amount (for UI display if needed)
    res.send({
      clientSecret: paymentIntent.client_secret,
      finalAmount: finalAmount.toFixed(2),
    });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).send({ error: error.message });
  }
};




exports.savePayment = async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();

    // increment booking count on Trainer
    // await Trainer.findByIdAndUpdate(payment.trainerId, {
    //   $inc: { bookingCount: 1 }
    // });

    // increment booking count on Class (based on classId from payment)
    if (payment.classId) {
      await Class.findByIdAndUpdate(payment.classId, {
        $inc: { bookingCount: 1 }
      });
    }

    res.status(201).send({ message: 'Payment saved and booking counts updated' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};




exports.getDetailedBookings = async (req, res) => {
  const userEmail = req.params.email;

  try {
    const uniqueTrainers = await Payment.aggregate([
      { $match: { userEmail } },

      // Join trainer
      {
        $lookup: {
          from: "trainers",
          localField: "trainerId",
          foreignField: "_id",
          as: "trainer"
        }
      },
      { $unwind: "$trainer" },

      // Join class
      {
        $lookup: {
          from: "classes",
          localField: "classId",
          foreignField: "_id",
          as: "class"
        }
      },
      { $unwind: "$class" },

      // Join slot
      {
        $lookup: {
          from: "slots",
          localField: "slotId",
          foreignField: "_id",
          as: "slot"
        }
      },
      { $unwind: "$slot" },

      // Group by trainerId to remove duplicates
      {
        $group: {
          _id: "$trainerId",
          trainer: { $first: "$trainer" },
          class: { $first: "$class" },
          slots: { $addToSet: "$slot" }, // if you want to show all booked slots
          package: { $first: "$package" },
          price: { $first: "$price" },
          bookingDate: { $first: "$bookingDate" },
        }
      },

      // Join reviews
      {
        $lookup: {
          from: "reviews",
          let: { trainerId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$trainerId", "$$trainerId"] }
              }
            },
            {
              $project: {
                rating: 1,
                comment: 1,
                memberId: 1,
                createdAt: 1
              }
            }
          ],
          as: "trainerReviews"
        }
      }
    ]);

    res.json(uniqueTrainers);
  } catch (err) {
    console.error("Error in getDetailedBookings:", err);
    res.status(500).json({ error: "Failed to fetch unique trainer bookings" });
  }
};
exports.getFinancialOverview = async (req, res) => {
  try {
    // 1. Total balance (sum of all payments)
    const totalBalanceAgg = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);
    const totalBalance = totalBalanceAgg[0]?.total || 0;

    // 2. Last 6 booking payment transactions (descending by bookingDate)
    const recentTransactions = await Payment.find({})
      .sort({ bookingDate: -1 })
      .limit(6)
      .select('userName userEmail price bookingDate status trainerName className package');

    // 3. Total newsletter subscribers
    const totalSubscribers = await Subscriber.countDocuments();

    // 4. Total paid members (distinct users who made payments)
    const paidMembers = await Payment.distinct('userEmail');
    const totalPaidMembers = paidMembers.length;

    res.json({
      totalBalance,
      recentPayments: recentTransactions,
      newsletterCount: totalSubscribers,
      paidMembersCount: totalPaidMembers,
    });
  } catch (error) {
    console.error('Financial overview error:', error);
    res.status(500).json({ message: 'Failed to load financial data' });
  }
};
exports.getBookedMembersByTrainerEmail = async (req, res) => {
  const trainerEmail = req.params.email;

  try {
    // Step 1: Find trainer ID by email
    const trainer = await Trainer.findOne({ email: trainerEmail });
    // console.log(trainer);

    if (!trainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }

    // Step 2: Find payments with that trainerId
    const payments = await Payment.find({ trainerId: trainer._id }).select("userName userEmail");

    // Step 3: Get unique members
    const uniqueMembersMap = new Map();
    payments.forEach(({ userName, userEmail }) => {
      if (!uniqueMembersMap.has(userEmail)) {
        uniqueMembersMap.set(userEmail, { name: userName, email: userEmail });
      }
    });

    const uniqueMembers = Array.from(uniqueMembersMap.values());

    res.status(200).json(uniqueMembers);
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ error: "Server error" });
  }
};
