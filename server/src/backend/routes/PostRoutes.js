import express from "express";
import * as PostController from "../controllers/PostController.js";
import { db } from "../../database/db.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});
const upload = multer({ storage });

// ✅ Routes
router.post("/api/posts", upload.array("media"), PostController.createPost(db)); // accept files
router.get("/api/posts", PostController.getPosts(db));
router.get("/api/posts/:postId", PostController.getPostById(db));
router.put("/api/posts/:postId", upload.array("media"), PostController.updatePost(db));
router.delete("/api/posts/:postId", PostController.deletePost(db));
router.post("/api/posts/:postId/like", PostController.likePost(db));
router.post("/api/posts/:postId/unlike", PostController.unlikePost(db));
router.post("/api/posts/:postId/comment", PostController.addComment(db));
router.delete("/api/posts/:postId/comment/:commentId", PostController.deleteComment(db));

export default router;
