import FriendlistModel from "../models/FriendListModel.js";
import { db } from "../../database/db.js";

const friendModel = new FriendlistModel(db);

const FriendlistController = {
  // ✅ Send friend request
  async addFriend(req, res) {
    try {
      const { user_id, friend_id } = req.body;
      
      // Input validation
      if (!user_id || !friend_id) {
        console.warn('Missing required fields:', { user_id, friend_id });
        return res.status(400).json({ 
          error: "Missing required fields",
          details: { user_id: !user_id ? 'Missing' : 'Provided', friend_id: !friend_id ? 'Missing' : 'Provided' }
        });
      }
      
      if (user_id === friend_id) {
        console.warn('User attempted to add themselves as friend:', { user_id });
        return res.status(400).json({ error: "You can't add yourself as a friend" });
      }

      try {
        // Check for existing friend request
        const existing = await friendModel.checkExisting(user_id, friend_id);
        if (existing) {
          console.log('Friend request already exists:', { 
            user_id, 
            friend_id, 
            existingStatus: existing.status 
          });
          return res.status(400).json({ 
            error: "Friend request already exists",
            status: existing.status
          });
        }

        // Create new friend request
        console.log('Creating new friend request:', { user_id, friend_id });
        const id = await friendModel.create(user_id, friend_id);
        console.log('Friend request created with ID:', id);

        // Notify both users
        try {
          const io = req.app.get("io");
          io.to(`user_${user_id}`).emit("refresh_friends");
          io.to(`user_${friend_id}`).emit("refresh_friends");
          console.log('Refresh friends event emitted to both users');
        } catch (socketError) {
          console.error('Error emitting socket event:', socketError);
          // Continue with the response even if socket fails
        }

        return res.status(201).json({ 
          success: true,
          message: "Friend request sent", 
          request_id: id 
        });

      } catch (dbError) {
        console.error('Database operation failed:', {
          error: dbError.message,
          stack: dbError.stack,
          user_id,
          friend_id
        });
        throw dbError; // Will be caught by outer catch
      }

    } catch (error) {
      console.error("❌ addFriend error:", {
        message: error.message,
        stack: error.stack,
        body: req.body,
        timestamp: new Date().toISOString()
      });
      
      // More specific error messages based on error type
      const errorMessage = error.code === 'ER_DUP_ENTRY' 
        ? 'This friend request already exists' 
        : 'Failed to process friend request';
      
      res.status(500).json({ 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // ✅ Get all accepted friends
  async getFriends(req, res) {
    try {
      const { user_id } = req.params;
      const friends = await friendModel.getFriends(user_id);
      res.json(friends);
    } catch (error) {
      console.error("❌ getFriends error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },

  // ✅ Get pending requests (received)
  async getPending(req, res) {
    try {
      const { user_id } = req.params;
      const requests = await friendModel.getPendingRequests(user_id);
      res.json(requests);
    } catch (error) {
      console.error("❌ getPending error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },

  // ✅ Accept friend request
  async acceptRequest(req, res) {
    try {
      const { id } = req.params;
      const [request] = await friendModel.getById(id);
      if (!request) {
        return res.status(404).json({ error: "Friend request not found" });
      }

      await friendModel.acceptRequest(id);

      // ✅ Notify both users
      const io = req.app.get("io");
      io.to(`user_${request.user_id}`).emit("refresh_friends");
      io.to(`user_${request.friend_id}`).emit("refresh_friends");

      res.json({ message: "Friend request accepted" });
    } catch (error) {
      console.error("❌ acceptRequest error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },

  // ✅ Block user
  async blockFriend(req, res) {
    try {
      const { id } = req.params;
      await friendModel.blockFriend(id);
      res.json({ message: "User blocked" });
    } catch (error) {
      console.error("❌ blockFriend error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },

  // ✅ Unfriend / Remove
  async deleteFriend(req, res) {
    try {
      const { user_id, friend_id } = req.params;
      if (!user_id || !friend_id) {
        return res.status(400).json({ error: "Missing user_id or friend_id" });
      }

      await friendModel.deleteByUsers(user_id, friend_id);

      // ✅ Real-time refresh both sides
      const io = req.app.get("io");
      io.to(`user_${user_id}`).emit("refresh_friends");
      io.to(`user_${friend_id}`).emit("refresh_friends");

      res.json({ message: "Friend deleted successfully" });
    } catch (error) {
      console.error("❌ deleteFriend error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },

  // ✅ Get users who are NOT friends
  async getNonFriends(req, res) {
    try {
      const { user_id } = req.params;
      const users = await friendModel.getNonFriends(user_id);
      res.json(users);
    } catch (error) {
      console.error("❌ getNonFriends error:", error);
      res.status(500).json({ error: "Server error" });
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
      res.json({ status: "none" });
    } catch (err) {
      console.error("❌ getStatus error:", err);
      res.status(500).json({ error: "Failed to fetch friend status" });
    }
  },
};

export default FriendlistController;
