import FriendlistModel from '../models/FriendListModel.js';
import { db } from '../../database/db.js';


const friendModel = new FriendlistModel(db);

const FriendlistController = {
  // Send friend request
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
      res.status(201).json({ message: 'Friend request sent', id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Get all friends
  async getFriends(req, res) {
    try {
      const { user_id } = req.params;
      const friends = await friendModel.getFriends(user_id);
      res.json(friends);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Get pending requests
  async getPending(req, res) {
    try {
      const { user_id } = req.params;
      const requests = await friendModel.getPendingRequests(user_id);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Accept friend request
  async acceptRequest(req, res) {
    try {
      const { id } = req.params;
      await friendModel.acceptRequest(id);
      res.json({ message: 'Friend request accepted' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Block user
  async blockFriend(req, res) {
    try {
      const { id } = req.params;
      await friendModel.blockFriend(id);
      res.json({ message: 'User blocked' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Delete friend or request
  async deleteFriend(req, res) {
    try {
      const { id } = req.params;
      await friendModel.delete(id);
      res.json({ message: 'Friend deleted or request removed' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

    // ✅ Get users who are NOT friends with this user
  async getNonFriends(req, res) {
    try {
      const { user_id } = req.params;
      const users = await friendModel.getNonFriends(user_id);
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

};

export default FriendlistController;
