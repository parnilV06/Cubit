const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.get('/:username', profileController.getProfileByUsername);
router.patch('/', authMiddleware, profileController.updateProfile);

router.post('/avatar', authMiddleware, (req, res, next) => {
    upload.single('avatar')(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message || 'File upload error'
            });
        }
        next();
    });
}, profileController.uploadAvatar);

module.exports = router;
