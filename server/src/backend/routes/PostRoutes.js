import express from "express";
import * as PostController from "../controllers/PostController.js";
import { db } from "../../database/db.js";
import { upload } from "../config/cloudinary.js"; // ✅ use Cloudinary upload

const router = express.Router();

// ✅ Routes using Cloudinary upload middleware
router.post("/api/posts", upload.array("media", 5), PostController.createPost(db)); // accept up to 5 files
router.get("/api/posts", PostController.getPosts(db));
router.get("/api/posts/:postId", PostController.getPostById(db));
router.put("/api/posts/:postId", upload.array("media", 5), PostController.updatePost(db));
router.delete("/api/posts/:postId", PostController.deletePost(db));
router.post("/api/posts/:postId/like", PostController.likePost(db));
router.post("/api/posts/:postId/unlike", PostController.unlikePost(db));
router.post("/api/posts/:postId/comment", PostController.addComment(db));
router.delete("/api/posts/:postId/comment/:commentId", PostController.deleteComment(db));

export default router;
