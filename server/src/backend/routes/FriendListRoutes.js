import express from 'express';
import FriendlistController from '../controllers/FriendListController.js';

const router = express.Router();

router.post('/add', FriendlistController.addFriend);

router.get('/pending/:user_id', FriendlistController.getPending);
router.get('/not-friends/:user_id', FriendlistController.getNonFriends); // ✅ must come before /:user_id
router.get('/:user_id', FriendlistController.getFriends);

router.put('/accept/:id', FriendlistController.acceptRequest);
router.put('/block/:id', FriendlistController.blockFriend);
router.get("/status/:user_id/:friend_id", FriendlistController.getStatus);

router.delete('/:user_id/:friend_id', FriendlistController.deleteFriend);


export default router;
