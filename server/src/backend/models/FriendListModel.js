export default class FriendlistModel {
  constructor(db) {
    this.db = db;
  }

  // Create a new friend request
  async create(user_id, friend_id) {
    const [result] = await this.db.execute(
      'INSERT INTO friendlist (user_id, friend_id, status) VALUES (?, ?, "pending")',
      [user_id, friend_id]
    );
    return result.insertId;
  }

  // ✅ Get all friends of a user (accepted only)
  async getFriends(user_id) {
    const [rows] = await this.db.execute(
      `
      SELECT 
        u.id,
        u.name,
        u.profile_image,
        u.location,
        u.hobbies,
        u.talents,
        u.facebook_url,
        u.tiktok_url,
        u.instagram_url,
        f.status,
        f.created_at
      FROM friendlist f
      JOIN users u 
        ON (u.id = f.friend_id AND f.user_id = ?) 
        OR (u.id = f.user_id AND f.friend_id = ?)
      WHERE f.status = 'accepted'
      `,
      [user_id, user_id]
    );
    return rows;
  }

  // ✅ Get pending friend requests (received by this user)
  async getPendingRequests(user_id) {
    const [rows] = await this.db.execute(
      `
      SELECT 
        f.id,
        f.user_id,
        f.friend_id,
        u.name,
        u.profile_image
      FROM friendlist f
      JOIN users u ON u.id = f.user_id
      WHERE f.friend_id = ? AND f.status = 'pending'
      `,
      [user_id]
    );
    return rows;
  }

  // ✅ Accept a friend request
  async acceptRequest(id) {
    await this.db.execute(
      'UPDATE friendlist SET status = "accepted" WHERE id = ?',
      [id]
    );
    return true;
  }

  // ✅ Block a friend
  async blockFriend(id) {
    await this.db.execute(
      'UPDATE friendlist SET status = "blocked" WHERE id = ?',
      [id]
    );
    return true;
  }

  // ✅ Delete friendship (unfriend or reject request)
  async delete(id) {
    await this.db.execute('DELETE FROM friendlist WHERE id = ?', [id]);
    return true;
  }

  // ✅ Check if friendship already exists (in either direction)
  async checkExisting(user_id, friend_id) {
    const [rows] = await this.db.execute(
      `
      SELECT * FROM friendlist 
      WHERE (user_id = ? AND friend_id = ?) 
         OR (user_id = ? AND friend_id = ?)
      `,
      [user_id, friend_id, friend_id, user_id]
    );
    return rows.length > 0 ? rows[0] : null;
  }
}
