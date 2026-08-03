const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/me', ratingController.getUserRatingSummary);
router.post('/reconcile', ratingController.reconcileUserRating);

module.exports = router;
