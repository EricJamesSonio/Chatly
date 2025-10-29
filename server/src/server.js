import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import { db } from "./database/db.js";

// Existing routes
import friendlistRoutes from "./backend/routes/FriendListRoutes.js";
import accountRoutes from "./backend/routes/AccountRoutes.js";
import authRoutes from "./backend/routes/AuthRoutes.js";
import userRoutes from "./backend/routes/UserRoutes.js";
import messageRoutes from "./backend/routes/MessageRoutes.js";

// New routes
import postRoutes from "./backend/routes/PostRoutes.js";
import feedRoutes from "./backend/routes/FeedRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Create HTTP server
const server = createServer(app);

// ✅ Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend port
    methods: ["GET", "POST", "DELETE"],
  },
});

// ✅ Handle socket connections
const onlineUsers = new Set();

io.on("connection", (socket) => {
  console.log(`🟢 New client connected: ${socket.id}`);

  // When user joins
  socket.on("join", (userId) => {
    socket.userId = userId;
    onlineUsers.add(userId);
    console.log(`👤 User ${userId} joined their room`);

    // Broadcast updated active users
    io.emit("update_active_users", Array.from(onlineUsers));
  });

  // Friend updates
  socket.on("friend_update", (targetUserId) => {
    io.to(`user_${targetUserId}`).emit("refresh_friends");
  });

  // Disconnect
  socket.on("disconnect", () => {
    if (socket.userId) onlineUsers.delete(socket.userId);
    io.emit("update_active_users", Array.from(onlineUsers));
    console.log(`🔴 Client disconnected: ${socket.id}`);
  });
});

// Make Socket.IO globally accessible
app.set("io", io);

// ✅ Routes
app.use("/api/friends", friendlistRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// New post/feed routes
app.use(postRoutes);
app.use(feedRoutes);

// Base route
app.get("/", (req, res) => {
  res.send("✅ Server is running with WebSockets!");
});

const PORT = 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
