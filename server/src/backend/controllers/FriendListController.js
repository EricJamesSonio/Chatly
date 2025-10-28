import FriendlistModel from '../models/FriendListModel.js';
import { db } from '../../database/db.js';

const friendModel = new FriendlistModel(db);

const FriendlistController = {
  // ✅ Send friend request
  async addFriend(req, res) {
    try {
      const { user_id, friend_id } = req.body;
      if (!user_id || !friend_id) {
        return res.status(400).json({ error: 'Missing user_id or friend_id' });
      }
      if (user_id === friend_id) {
        return res.status(400).json({ error: "You can't add yourself" });
      }

      const existing = await friendModel.checkExisting(user_id, friend_id);
      if (existing) {
        return res.status(400).json({ error: 'Friend request already exists' });
      }

      const id = await friendModel.create(user_id, friend_id);

      // ✅ Emit WebSocket events to both users
      const io = req.app.get('io');
      io.to(`user_${user_id}`).emit('refresh_friends');
      io.to(`user_${friend_id}`).emit('refresh_friends');

      res.status(201).json({ message: 'Friend request sent', id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // ✅ Get all friends
  async getFriends(req, res) {
    try {
      const { user_id } = req.params;
      const friends = await friendModel.getFriends(user_id);
      res.json(friends);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  // ✅ Get pending requests
  async getPending(req, res) {
    try {
      const { user_id } = req.params;
      const requests = await friendModel.getPendingRequests(user_id);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  // ✅ Accept friend request
  async acceptRequest(req, res) {
    try {
      const { id } = req.params;
      const [request] = await friendModel.getById(id);
      await friendModel.acceptRequest(id);

      // ✅ Notify both users in real-time
      const io = req.app.get('io');
      io.to(`user_${request.user_id}`).emit('refresh_friends');
      io.to(`user_${request.friend_id}`).emit('refresh_friends');

      res.json({ message: 'Friend request accepted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // ✅ Block user
  async blockFriend(req, res) {
    try {
      const { id } = req.params;
      await friendModel.blockFriend(id);
      res.json({ message: 'User blocked' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  // ✅ Unfriend / Remove
  async deleteFriend(req, res) {
    try {
      const { user_id, friend_id } = req.params;
      if (!user_id || !friend_id) {
        return res.status(400).json({ error: 'Missing user_id or friend_id' });
      }

      await friendModel.deleteByUsers(user_id, friend_id);

      // ✅ Notify both users instantly
      const io = req.app.get('io');
      io.to(`user_${user_id}`).emit('refresh_friends');
      io.to(`user_${friend_id}`).emit('refresh_friends');

      res.json({ message: 'Friend deleted or request removed' });
    } catch (error) {
      console.error('❌ Delete friend error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // ✅ Get users who are NOT friends
  async getNonFriends(req, res) {
    try {
      const { user_id } = req.params;
      const users = await friendModel.getNonFriends(user_id);
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  // ✅ Get friend status
  async getStatus(req, res) {
    try {
      const { user_id, friend_id } = req.params;
      const [rows] = await db.execute(
        `
        SELECT status 
        FROM friendlist
        WHERE (user_id = ? AND friend_id = ?)
           OR (user_id = ? AND friend_id = ?)
        LIMIT 1
        `,
        [user_id, friend_id, friend_id, user_id]
      );

      if (rows.length > 0) return res.json({ status: rows[0].status });
      res.json({ status: 'none' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch friend status' });
    }
  },
};

export default FriendlistController;
