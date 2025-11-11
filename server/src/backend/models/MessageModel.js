export default class MessageModel {
  constructor(db) {
    this.db = db;
  }

  async getMessagesBetween(userId1, userId2) {
    const [rows] = await this.db.execute(
      `SELECT * FROM messages
       WHERE (sender_id = ? AND receiver_id = ?)
       OR (sender_id = ? AND receiver_id = ?)
       ORDER BY created_at ASC`,
      [userId1, userId2, userId2, userId1]
    );
    return rows;
  }

  async createMessage(senderId, receiverId, message) {
    const [result] = await this.db.execute(
      `INSERT INTO messages (sender_id, receiver_id, message)
       VALUES (?, ?, ?)`,
      [senderId, receiverId, message]
    );

    return {
      id: result.insertId,
      sender_id: senderId,
      receiver_id: receiverId,
      message,
      created_at: new Date(),
      is_read: 0,
    };
  }

  async getUnreadCounts(userId) {
    const [rows] = await this.db.execute(
      `SELECT sender_id, COUNT(*) AS unread_count
       FROM messages
       WHERE receiver_id = ? AND is_read = 0
       GROUP BY sender_id`,
      [userId]
    );

    const counts = {};
    rows.forEach((row) => {
      counts[row.sender_id] = row.unread_count;
    });

    return counts;
  }

  async markMessagesAsRead(userId, senderId) {
    await this.db.execute(
      `UPDATE messages
       SET is_read = 1
       WHERE receiver_id = ? AND sender_id = ? AND is_read = 0`,
      [userId, senderId]
    );
  }

  async getLastMessagesForUser(userId) {
    const [rows] = await this.db.execute(
      `SELECT m.*, u.name, u.profile_image
       FROM messages m
       JOIN users u ON u.id = m.sender_id
       WHERE m.receiver_id = ?
       ORDER BY m.created_at DESC`,
      [userId]
    );
    return rows;
  }
}
