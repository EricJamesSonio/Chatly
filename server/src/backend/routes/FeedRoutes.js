import express from "express";
import { getNewsFeed } from "../controllers/FeedController.js";
import { db } from "../../database/db.js";

const router = express.Router();

router.get("/api/feed", getNewsFeed(db));

export default router;
