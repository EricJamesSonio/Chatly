import MessageModel from "../models/MessageModel.js";
import { db } from "../../database/db.js";

// ✅ Create instance
const Message = new MessageModel(db);

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

export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;
    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newMessage = await Message.createMessage(senderId, receiverId, message);

    const io = req.app.get("io");
    io.to(`user_${receiverId}`).emit("new_message", newMessage);

    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
};
