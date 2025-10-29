export default class Post {
  constructor(db) {
    this.db = db;
  }

  // Get all posts with pagination
  getAll(limit = 10, offset = 0) {
    return this.db.execute(
      "SELECT * FROM posts ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );
  }

  // Get post by ID
  getById(id) {
    return this.db.execute("SELECT * FROM posts WHERE id = ?", [id]);
  }

  // Create new post
  create({ user_id, content, media }) {
    return this.db.execute(
      "INSERT INTO posts (user_id, content, media) VALUES (?, ?, ?)",
      [user_id, content, JSON.stringify(media || [])]
    );
  }

  // Update post
  update(id, { content, media }) {
    return this.db.execute(
      "UPDATE posts SET content = ?, media = ? WHERE id = ?",
      [content, JSON.stringify(media || []), id]
    );
  }

  // Delete post
  delete(id) {
    return this.db.execute("DELETE FROM posts WHERE id = ?", [id]);
  }

  // Like post
  likePost(postId, userId) {
    return this.db.execute(
      "UPDATE posts SET likes = JSON_ARRAY_APPEND(likes, '$', ?) WHERE id = ? AND JSON_CONTAINS(likes, ?, '$') = 0",
      [userId, postId, JSON.stringify(userId)]
    );
  }

  // Unlike post
  unlikePost(postId, userId) {
    return this.db.execute(
      "UPDATE posts SET likes = JSON_REMOVE(likes, JSON_UNQUOTE(JSON_SEARCH(likes, 'one', ?))) WHERE id = ?",
      [userId, postId]
    );
  }

  // Add comment
  addComment({ post_id, user_id, content }) {
    return this.db.execute(
      "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)",
      [post_id, user_id, content]
    );
  }

  // Delete comment
  deleteComment(commentId) {
    return this.db.execute("DELETE FROM comments WHERE id = ?", [commentId]);
  }

  // Get comments of a post
  getComments(postId) {
    return this.db.execute("SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC", [postId]);
  }
}
