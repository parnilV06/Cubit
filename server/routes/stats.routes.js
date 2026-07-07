const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');

router.get('/', statsController.getDashboard);
router.get('/trend', statsController.getTrend);
router.get('/distribution', statsController.getDistribution);
router.get('/progress', statsController.getProgress);
router.get('/recent', statsController.getRecentSessions);

module.exports = router;
