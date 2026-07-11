const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainer.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/lessons', trainerController.getLessons);
router.get('/lessons/:slug', trainerController.getLesson);
router.post('/lessons/:slug/complete', trainerController.completeLesson);
router.get('/progress', trainerController.getProgress);

module.exports = router;
