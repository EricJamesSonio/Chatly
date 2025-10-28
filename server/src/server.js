import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import { db } from "./database/db.js";
import friendlistRoutes from "./backend/routes/FriendListRoutes.js";
import accountRoutes from "./backend/routes/AccountRoutes.js";
import authRoutes from "./backend/routes/AuthRoutes.js";
import userRoutes from "./backend/routes/UserRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Create HTTP server
const server = createServer(app);

// ✅ Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // or your frontend port
    methods: ["GET", "POST", "DELETE"],
  },
});

// ✅ Handle socket connections
io.on("connection", (socket) => {
  console.log(`🟢 New client connected: ${socket.id}`);

  // When user joins (optional for tracking)
  socket.on("join", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`👤 User ${userId} joined their room`);
  });

  // Listen for friend updates (coming from backend logic)
  socket.on("friend_update", (targetUserId) => {
    console.log(`🔔 Friend update for user ${targetUserId}`);
    io.to(`user_${targetUserId}`).emit("refresh_friends");
  });

  socket.on("disconnect", () => {
    console.log(`🔴 Client disconnected: ${socket.id}`);
  });
});

// ✅ Make Socket.IO globally accessible (optional)
app.set("io", io);

// Routes
app.use("/api/friends", friendlistRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Base route
app.get("/", (req, res) => {
  res.send("✅ Server is running with WebSockets!");
});

const PORT = 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
