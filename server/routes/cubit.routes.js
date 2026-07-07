// master router file to mount all routers and sub routes to /api endpoint 
const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const profileRoutes = require('./profile.routes');
const sessionRoutes = require('./session.routes');
const solveRoutes = require('./solve.routes');
const statsRoutes = require('./stats.routes');
const trainerRoutes = require('./trainer.routes');
const communityRoutes = require('./community.routes');
const friendRoutes = require('./friend.routes');
const notificationRoutes = require('./notification.routes');
const searchRoutes = require('./search.routes');

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/sessions', sessionRoutes);
router.use('/solves', solveRoutes);
router.use('/stats', statsRoutes);
router.use('/trainer', trainerRoutes);
router.use('/community', communityRoutes);
router.use('/friends', friendRoutes);
router.use('/notifications', notificationRoutes);
router.use('/search', searchRoutes);

module.exports = router;
