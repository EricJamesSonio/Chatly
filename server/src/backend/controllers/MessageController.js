import MessageModel from "../models/MessageModel.js";
import { db } from "../../database/db.js";

const Message = new MessageModel(db);

// Get all messages between two users
export const getMessages = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const messages = await Message.getMessagesBetween(userId1, userId2);
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;
    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newMessage = await Message.createMessage(senderId, receiverId, message);

    // Emit via Socket.IO
    const io = req.app.get("io");
    io.to(`user_${receiverId}`).emit("new_message", newMessage);

    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// Get unread counts for a user
export const getUnreadCounts = async (req, res) => {
  try {
    const { userId } = req.params;
    const counts = await Message.getUnreadCounts(userId);
    res.json(counts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch unread counts" });
  }
};

// Mark messages as read
export const markAsRead = async (req, res) => {
  try {
    const { userId, senderId } = req.params;
    await Message.markMessagesAsRead(userId, senderId);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to mark messages as read" });
  }
};
