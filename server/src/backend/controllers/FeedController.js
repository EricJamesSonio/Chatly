import Post from "../models/PostModel.js";

export const getNewsFeed = (db) => async (req, res) => {
  const userId = parseInt(req.query.userId);
  try {
    const [friends] = await db.execute(
      "SELECT friend_id FROM friendlist WHERE user_id = ? AND status='accepted'",
      [userId]
    );
    const friendIds = friends.map(f => f.friend_id);

    // Include the user themselves
    friendIds.push(userId);

    // If friendIds is empty, just fetch user's own posts
    if (friendIds.length === 0) {
      return res.json([]);
    }

    const placeholders = friendIds.map(() => "?").join(",");
    const [posts] = await db.execute(
      `SELECT * FROM posts WHERE user_id IN (${placeholders}) ORDER BY created_at DESC`,
      friendIds
    );

    res.json(posts ?? []); // Always return an array
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
