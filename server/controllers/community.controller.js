const communityService = require('../services/community.service');

const getPosts = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const posts = await communityService.getPosts(req.user.id, parseInt(page) || 1, parseInt(limit) || 10);
        return res.status(200).json({ success: true, message: "Posts fetched successfully", data: posts });
    } catch (error) {
        next(error);
    }
};

const createPost = async (req, res, next) => {
    try {
        const post = await communityService.createPost(req.user.id, req.body, req.file);
        return res.status(201).json({ success: true, message: "Post created successfully", data: post });
    } catch (error) {
        next(error);
    }
};

const getPost = async (req, res, next) => {
    try {
        const post = await communityService.getPost(req.user.id, req.params.id);
        return res.status(200).json({ success: true, message: "Post fetched successfully", data: post });
    } catch (error) {
        next(error);
    }
};

const deletePost = async (req, res, next) => {
    try {
        await communityService.deletePost(req.user.id, req.params.id);
        return res.status(200).json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
        next(error);
    }
};

const likePost = async (req, res, next) => {
    try {
        await communityService.likePost(req.user.id, req.params.id);
        return res.status(200).json({ success: true, message: "Post liked successfully" });
    } catch (error) {
        next(error);
    }
};

const unlikePost = async (req, res, next) => {
    try {
        await communityService.unlikePost(req.user.id, req.params.id);
        return res.status(200).json({ success: true, message: "Post unliked successfully" });
    } catch (error) {
        next(error);
    }
};

const addComment = async (req, res, next) => {
    try {
        const comment = await communityService.addComment(req.user.id, req.params.id, req.body);
        return res.status(201).json({ success: true, message: "Comment added successfully", data: comment });
    } catch (error) {
        next(error);
    }
};

const deleteComment = async (req, res, next) => {
    try {
        await communityService.deleteComment(req.user.id, req.params.id);
        return res.status(200).json({ success: true, message: "Comment deleted successfully" });
    } catch (error) {
        next(error);
    }
};

const getPBLeaderboard = async (req, res, next) => {
    try {
        const { puzzleType, scope, limit } = req.query;
        const result = await communityService.getPBLeaderboard(req.user.id, { puzzleType, scope, limit });
        return res.status(200).json({
            success: true,
            message: "PB Leaderboard fetched successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const getRatingLeaderboard = async (req, res, next) => {
    try {
        const { scope, limit } = req.query;
        const result = await communityService.getRatingLeaderboard(req.user.id, { scope, limit });
        return res.status(200).json({
            success: true,
            message: "Rating Leaderboard fetched successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getPosts,
    createPost,
    getPost,
    deletePost,
    likePost,
    unlikePost,
    addComment,
    deleteComment,
    getPBLeaderboard,
    getRatingLeaderboard
};
