import express from 'express';
import FriendlistController from '../controllers/FriendListController.js';

const router = express.Router();

// POST /api/friends/add
router.post('/add', FriendlistController.addFriend);

// GET /api/friends/:user_id
router.get('/:user_id', FriendlistController.getFriends);

// GET /api/friends/pending/:user_id
router.get('/pending/:user_id', FriendlistController.getPending);

// PUT /api/friends/accept/:id
router.put('/accept/:id', FriendlistController.acceptRequest);

// PUT /api/friends/block/:id
router.put('/block/:id', FriendlistController.blockFriend);

// DELETE /api/friends/:id
router.delete('/:id', FriendlistController.deleteFriend);

export default router;
