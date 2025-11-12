import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

// ✅ Import routes
import friendlistRoutes from "./backend/routes/FriendListRoutes.js";
import accountRoutes from "./backend/routes/AccountRoutes.js";
import authRoutes from "./backend/routes/AuthRoutes.js";
import userRoutes from "./backend/routes/UserRoutes.js";
import messageRoutes from "./backend/routes/MessageRoutes.js";
import postRoutes from "./backend/routes/PostRoutes.js";
import feedRoutes from "./backend/routes/FeedRoutes.js";

const app = express();

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://chatly-client-sen7.onrender.com"
];

// ✅ CORS FIRST!
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn(`CORS blocked: ${origin}`);
    return callback(new Error("CORS not allowed"), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Socket-ID'],
}));

// ✅ Now parse JSON
app.use(express.json());

// ✅ Create HTTP + Socket.io server
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by Socket.IO CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  },
});

const onlineUsers = new Set();

io.on("connection", (socket) => {
  console.log(`🟢 Client connected: ${socket.id}`);

  socket.on("join", (userId) => {
    socket.userId = userId;
    onlineUsers.add(userId);
    io.emit("update_active_users", Array.from(onlineUsers));
  });

  socket.on("friend_update", (targetUserId) => {
    io.to(`user_${targetUserId}`).emit("refresh_friends");
  });

  socket.on("disconnect", () => {
    if (socket.userId) onlineUsers.delete(socket.userId);
    io.emit("update_active_users", Array.from(onlineUsers));
    console.log(`🔴 Disconnected: ${socket.id}`);
  });
});

app.set("io", io);

// ✅ Routes
app.use("/api/friends", friendlistRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use(postRoutes);
app.use(feedRoutes);

// ✅ Health check
app.get("/", (req, res) => res.send("✅ Server is running with WebSockets!"));

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
