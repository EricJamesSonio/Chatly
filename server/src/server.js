import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

// ✅ Import your routes
import friendlistRoutes from "./backend/routes/FriendListRoutes.js";
import accountRoutes from "./backend/routes/AccountRoutes.js";
import authRoutes from "./backend/routes/AuthRoutes.js";
import userRoutes from "./backend/routes/UserRoutes.js";
import messageRoutes from "./backend/routes/MessageRoutes.js";
import postRoutes from "./backend/routes/PostRoutes.js";
import feedRoutes from "./backend/routes/FeedRoutes.js";

const app = express();
app.use(express.json());

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",                    // local dev
  "https://chatly-client-sen7.onrender.com"   // deployed client
];

// Enable CORS for all routes with credentials
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      console.warn(`CORS blocked: ${origin}`);
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Socket-ID'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  maxAge: 86400 // 24 hours
}));

// ✅ Create HTTP server
const server = createServer(app);

// ✅ Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
    allowedHeaders: ["my-custom-header", "Content-Type", "Authorization"],
    credentials: true,
    transports: ['websocket', 'polling']
  },
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000
});

// Handle Socket.IO connection errors
io.engine.on('connection_error', (err) => {
  console.error('Socket.IO connection error:', {
    code: err.code,
    message: err.message,
    context: err.context
  });
});

// ✅ Socket.IO connection
const onlineUsers = new Set();

io.on("connection", (socket) => {
  console.log(`🟢 New client connected: ${socket.id}`);

  socket.on("join", (userId) => {
    socket.userId = userId;
    onlineUsers.add(userId);
    console.log(`👤 User ${userId} joined`);
    io.emit("update_active_users", Array.from(onlineUsers));
  });

  socket.on("friend_update", (targetUserId) => {
    io.to(`user_${targetUserId}`).emit("refresh_friends");
  });

  socket.on("disconnect", () => {
    if (socket.userId) onlineUsers.delete(socket.userId);
    io.emit("update_active_users", Array.from(onlineUsers));
    console.log(`🔴 Client disconnected: ${socket.id}`);
  });
});

// ✅ Make Socket.IO accessible globally
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
app.get("/", (req, res) => {
  res.send("✅ Server is running with WebSockets!");
});

// ✅ Dynamic port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
