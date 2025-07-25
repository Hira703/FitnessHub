const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

// Load environment variables
dotenv.config();

// Initialize app
const app = express();
const port = process.env.PORT || 5000;

// Create HTTP server to wrap Express app
const server = http.createServer(app);

// Setup Socket.IO with CORS allowed for your frontend origin
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // replace with your frontend URL
    methods: ["GET", "POST"],
  },
});

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
app.use("/api/messages", require("./routes/messageRoutes"));

// Test route
app.get("/", (req, res) => {
  res.send("💪 Fitness Tracker Backend Running");
});

// Socket.IO event handling
io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  socket.on("sendMessage", (data) => {
    // Broadcast new message to all connected clients
    io.emit("newMessage", data);
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// Start server with Socket.IO enabled
server.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
