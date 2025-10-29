import Post from "../models/PostModel.js";

const safeJSON = (value) => {
  try {
    if (!value) return [];
    if (typeof value === "object") return value;
    return JSON.parse(value);
  } catch {
    return [];
  }
};

export const getNewsFeed = (db) => async (req, res) => {
  const userId = parseInt(req.query.userId);
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    // 🧍 Fetch friends
    const [friends] = await db.execute(
      "SELECT friend_id FROM friendlist WHERE user_id = ? AND status = 'accepted'",
      [userId]
    );

    const friendIds = friends.map(f => f.friend_id);
    friendIds.push(userId); // include user’s own posts

    if (friendIds.length === 0) return res.json([]);

    const placeholders = friendIds.map(() => "?").join(",");

    // ✅ Fetch posts joined with users
    const [posts] = await db.execute(
      `SELECT p.id, p.user_id, u.name AS userName, p.content, p.media, p.likes, 
              p.created_at, p.updated_at
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.user_id IN (${placeholders})
       ORDER BY p.created_at DESC`,
      friendIds
    );

    // 🗨️ Fetch all comments for these posts
    const postIds = posts.map(p => p.id);
    let commentsByPost = {};

    if (postIds.length > 0) {
      const placeholdersComments = postIds.map(() => "?").join(",");
      const [comments] = await db.execute(
        `SELECT c.id, c.post_id, c.user_id, u.name AS userName, c.content, c.created_at
         FROM comments c
         JOIN users u ON c.user_id = u.id
         WHERE c.post_id IN (${placeholdersComments})
         ORDER BY c.created_at ASC`,
        postIds
      );

      comments.forEach(c => {
        if (!commentsByPost[c.post_id]) commentsByPost[c.post_id] = [];
        commentsByPost[c.post_id].push(c);
      });
    }

    // 🧩 Format and merge
    const formattedPosts = posts.map(post => ({
      ...post,
      media: safeJSON(post.media),
      likes: safeJSON(post.likes),
      comments: commentsByPost[post.id] || []
    }));

    res.json(formattedPosts);
  } catch (err) {
    console.error("❌ getNewsFeed error:", err);
    res.status(500).json({ error: err.message });
  }
};
