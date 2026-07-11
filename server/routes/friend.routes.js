const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friend.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/', friendController.getFriends);
router.get('/requests', friendController.getRequests);
router.post('/request', friendController.sendFriendRequest);
router.patch('/request/:id/accept', friendController.acceptRequest);
router.patch('/request/:id/reject', friendController.rejectRequest);
router.delete('/:id', friendController.removeFriend);

module.exports = router;
