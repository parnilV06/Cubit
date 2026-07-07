const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');

router.get('/', profileController.getProfile);
router.patch('/', profileController.updateProfile);
router.post('/avatar', profileController.uploadAvatar);

module.exports = router;
