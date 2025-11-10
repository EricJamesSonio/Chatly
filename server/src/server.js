import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { db } from "./database/db.js";

// ✅ Import Routes
import friendlistRoutes from "./backend/routes/FriendListRoutes.js";
import accountRoutes from "./backend/routes/AccountRoutes.js";
import authRoutes from "./backend/routes/AuthRoutes.js";
import userRoutes from "./backend/routes/UserRoutes.js";
import messageRoutes from "./backend/routes/MessageRoutes.js";
import postRoutes from "./backend/routes/PostRoutes.js";
import feedRoutes from "./backend/routes/FeedRoutes.js";

const app = express();
app.use(express.json());

// ✅ CORS configuration (local + Render)
const allowedOrigins = [
  "http://localhost:5173",                    // local React dev
  "https://your-frontend-name.onrender.com"   // deployed frontend (replace this)
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ Create HTTP server
const server = createServer(app);

// ✅ Initialize Socket.IO with same CORS rules
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE"]
  }
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

// ✅ Make Socket.IO globally accessible
app.set("io", io);

// ✅ Routes
app.use("/api/friends", friendlistRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use(postRoutes);
app.use(feedRoutes);

// ✅ Base route (health check)
app.get("/", (req, res) => {
  res.send("✅ Server is running with WebSockets!");
});

// ✅ Dynamic port for Render
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
