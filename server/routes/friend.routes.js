const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friend.controller');

router.get('/', friendController.getFriends);
router.post('/request', friendController.sendFriendRequest);
router.patch('/accept/:id', friendController.acceptRequest);
router.patch('/reject/:id', friendController.rejectRequest);
router.delete('/:id', friendController.removeFriend);

module.exports = router;
