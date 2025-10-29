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
  try {
    const [friends] = await db.execute(
      "SELECT friend_id FROM friendlist WHERE user_id = ? AND status='accepted'",
      [userId]
    );

    const friendIds = friends.map(f => f.friend_id);
    friendIds.push(userId); // include user’s own posts

    if (friendIds.length === 0) {
      return res.json([]);
    }

    const placeholders = friendIds.map(() => "?").join(",");
    const [posts] = await db.execute(
      `SELECT * FROM posts WHERE user_id IN (${placeholders}) ORDER BY created_at DESC`,
      friendIds
    );

    const formattedPosts = posts.map(post => ({
      ...post,
      media: safeJSON(post.media),
      likes: safeJSON(post.likes),
      comments: safeJSON(post.comments),
    }));

    res.json(formattedPosts);
  } catch (err) {
    console.error("❌ getNewsFeed error:", err);
    res.status(500).json({ error: err.message });
  }
};
