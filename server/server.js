const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

// Load environment variables
dotenv.config();

// Initialize app
const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/trainers", require("./routes/trainerRoutes"));
app.use("/api/classes", require("./routes/classRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/slots", require("./routes/slotRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/forums", require("./routes/forumRoutes"));
app.use("/api/newsletter", require("./routes/newsletterRoutes"));
// app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/coupons", require("./routes/couponRoutes"));

app.get("/", (req, res) => {
  res.send("💪 Fitness Tracker Backend Running");
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
