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
const focusRoutes = require('./focus.routes');
const noteRoutes = require('./note.routes');
const ratingRoutes = require('./rating.routes');

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/sessions', sessionRoutes);
router.use('/solves', solveRoutes);
router.use('/stats', statsRoutes);
router.use('/trainer', trainerRoutes);
router.use('/community', communityRoutes);
router.use('/friends', friendRoutes);
router.use('/notifications', notificationRoutes);
router.use('/focus-tracks', focusRoutes);
router.use('/notes', noteRoutes);
router.use('/rating', ratingRoutes);

module.exports = router;
