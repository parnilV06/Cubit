const express = require('express');
const router = express.Router();
const communityController = require('../controllers/community.controller');

router.get('/posts', communityController.getPosts);
router.post('/posts', communityController.createPost);
router.get('/posts/:id', communityController.getPost);
router.delete('/posts/:id', communityController.deletePost);
router.post('/posts/:id/like', communityController.likePost);
router.delete('/posts/:id/like', communityController.unlikePost);
router.post('/posts/:id/comments', communityController.addComment);
router.delete('/comments/:id', communityController.deleteComment);

module.exports = router;
