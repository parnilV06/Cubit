const express = require('express');
const router = express.Router();
const communityController = require('../controllers/community.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.use(authMiddleware);

router.get('/leaderboard/pb', communityController.getPBLeaderboard);
router.get('/leaderboard/rating', communityController.getRatingLeaderboard);
router.get('/posts', communityController.getPosts);
router.post('/posts', (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message || 'File upload error'
            });
        }
        next();
    });
}, communityController.createPost);
router.get('/posts/:id', communityController.getPost);
router.delete('/posts/:id', communityController.deletePost);
router.post('/posts/:id/like', communityController.likePost);
router.delete('/posts/:id/like', communityController.unlikePost);
router.post('/posts/:id/comments', communityController.addComment);
router.delete('/comments/:id', communityController.deleteComment);

module.exports = router;
