import express from "express";
import { getMessages, sendMessage } from "../controllers/MessageController.js";

const router = express.Router();

// Get all messages between two users
router.get("/:userId1/:userId2", getMessages);

// Send a new message
router.post("/", sendMessage);

export default router;
