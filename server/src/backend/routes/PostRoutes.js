import express from "express";
import * as PostController from "../controllers/PostController.js";
import { db } from "../../database/db.js";

const router = express.Router();

router.post("/api/posts", PostController.createPost(db));
router.get("/api/posts", PostController.getPosts(db));
router.get("/api/posts/:postId", PostController.getPostById(db));
router.put("/api/posts/:postId", PostController.updatePost(db));
router.delete("/api/posts/:postId", PostController.deletePost(db));
router.post("/api/posts/:postId/like", PostController.likePost(db));
router.post("/api/posts/:postId/unlike", PostController.unlikePost(db));
router.post("/api/posts/:postId/comment", PostController.addComment(db));
router.delete("/api/posts/:postId/comment/:commentId", PostController.deleteComment(db));

export default router;
