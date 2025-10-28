import express from "express";
import {
  getMessages,
  sendMessage,
  getUnreadCounts,
  markAsRead
} from "../controllers/MessageController.js";

const router = express.Router();

// Messages between users
router.get("/:userId1/:userId2", getMessages);

// Send a message
router.post("/", sendMessage);

// Unread counts
router.get("/unread/:userId", getUnreadCounts);

// Mark messages as read
router.post("/read/:userId/:senderId", markAsRead);

export default router;
