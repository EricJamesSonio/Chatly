import Post from "../models/PostModel.js";

const postModel = (db) => new Post(db);

export const createPost = (db) => async (req, res) => {
  try {
    const { user_id, content, media } = req.body;

    const [result] = await db.execute(
      "INSERT INTO posts (user_id, content, media) VALUES (?, ?, ?)",
      [user_id, content, JSON.stringify(media || [])]
    );

    const [newPost] = await db.execute(
      "SELECT * FROM posts WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      message: "Post created",
      post: newPost[0], // ✅ includes created_at
    });
  } catch (err) {
    console.error("❌ createPost error:", err);
    res.status(500).json({ error: err.message });
  }
};


export const getPosts = (db) => async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [posts] = await postModel(db).getAll(limit, offset);

    // ✅ Parse JSON columns
    const formattedPosts = posts.map(post => ({
      ...post,
      media: safeJSON(post.media),
      likes: safeJSON(post.likes),
      comments: safeJSON(post.comments),
    }));

    res.json(formattedPosts);
  } catch (err) {
    console.error("❌ getPosts error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Helper function to safely parse JSON fields
const safeJSON = (data) => {
  try {
    return typeof data === "string" ? JSON.parse(data) : (data || []);
  } catch {
    return [];
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
    // 1️⃣ Insert new comment
    const [result] = await db.execute(
      "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)",
      [postId, user_id, content]
    );

    const commentId = result.insertId;

    // 2️⃣ Fetch the newly created comment (with timestamp)
    const [newComment] = await db.execute(
      "SELECT * FROM comments WHERE id = ?",
      [commentId]
    );

    // 3️⃣ Return the new comment object
    res.status(201).json({
      message: "Comment added",
      comment: newComment[0], // includes id, user_id, content, created_at
    });
  } catch (err) {
    console.error("❌ addComment error:", err);
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
