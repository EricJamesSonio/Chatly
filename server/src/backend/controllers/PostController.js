import Post from "../models/PostModel.js";

const postModel = (db) => new Post(db);

export const createPost = (db) => async (req, res) => {
  try {
    const { user_id, content, media } = req.body;
    const [result] = await postModel(db).create({ user_id, content, media });
    res.status(201).json({ id: result.insertId, message: "Post created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPosts = (db) => async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  try {
    const [posts] = await postModel(db).getAll(limit, offset);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPostById = (db) => async (req, res) => {
  const { postId } = req.params;
  try {
    const [posts] = await postModel(db).getById(postId);
    if (!posts.length) return res.status(404).json({ message: "Post not found" });
    res.json(posts[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePost = (db) => async (req, res) => {
  const { postId } = req.params;
  const { content, media } = req.body;
  try {
    await postModel(db).update(postId, { content, media });
    res.json({ message: "Post updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePost = (db) => async (req, res) => {
  const { postId } = req.params;
  try {
    await postModel(db).delete(postId);
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const likePost = (db) => async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;
  try {
    await postModel(db).likePost(postId, userId);
    res.json({ message: "Post liked" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const unlikePost = (db) => async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;
  try {
    await postModel(db).unlikePost(postId, userId);
    res.json({ message: "Post unliked" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addComment = (db) => async (req, res) => {
  const { postId } = req.params;
  const { user_id, content } = req.body;
  try {
    const [result] = await postModel(db).addComment({ post_id: postId, user_id, content });
    res.status(201).json({ commentId: result.insertId, message: "Comment added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteComment = (db) => async (req, res) => {
  const { commentId } = req.params;
  try {
    await postModel(db).deleteComment(commentId);
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
