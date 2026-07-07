const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainer.controller');

router.get('/lessons', trainerController.getLessons);
router.get('/lessons/:slug', trainerController.getLesson);
router.post('/lessons/:id/complete', trainerController.completeLesson);
router.get('/progress', trainerController.getProgress);

module.exports = router;
