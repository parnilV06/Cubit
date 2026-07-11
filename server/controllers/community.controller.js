const communityService = require('../services/community.service');

const getPosts = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const posts = await communityService.getPosts(req.user.id, parseInt(page) || 1, parseInt(limit) || 10);
        return res.status(200).json({ success: true, message: "Posts fetched successfully", data: posts });
    } catch (error) { next(error); }
};

const createPost = async (req, res, next) => {
    try {
        const post = await communityService.createPost(req.user.id, req.body, req.file);
        return res.status(201).json({ success: true, message: "Post created successfully", data: post });
    } catch (error) { next(error); }
};

const getPost = async (req, res, next) => {
    try {
        const post = await communityService.getPost(req.user.id, req.params.id);
        return res.status(200).json({ success: true, message: "Post fetched successfully", data: post });
    } catch (error) {
        if (error.message === "Post not found") {
            return res.status(404).json({ success: false, message: error.message });
        }
        next(error); 
    }
};

const deletePost = async (req, res, next) => {
    try {
        await communityService.deletePost(req.user.id, req.params.id);
        return res.status(200).json({ success: true, message: "Post deleted successfully" });
    } catch (error) { 
        if (error.message === "Post not found") {
            return res.status(404).json({ success: false, message: error.message });
        }
        if (error.message === "Unauthorized to delete this post") {
            return res.status(403).json({ success: false, message: error.message });
        }
        next(error); 
    }
};

const likePost = async (req, res, next) => {
    try {
        await communityService.likePost(req.user.id, req.params.id);
        return res.status(200).json({ success: true, message: "Post liked successfully" });
    } catch (error) { 
        if (error.message === "Post not found") {
            return res.status(404).json({ success: false, message: error.message });
        }
        if (error.message === "Post already liked") {
            return res.status(400).json({ success: false, message: error.message });
        }
        next(error); 
    }
};

const unlikePost = async (req, res, next) => {
    try {
        await communityService.unlikePost(req.user.id, req.params.id);
        return res.status(200).json({ success: true, message: "Post unliked successfully" });
    } catch (error) { 
        if (error.message === "Like not found") {
            return res.status(400).json({ success: false, message: error.message });
        }
        next(error); 
    }
};

const addComment = async (req, res, next) => {
    try {
        const comment = await communityService.addComment(req.user.id, req.params.id, req.body);
        return res.status(201).json({ success: true, message: "Comment added successfully", data: comment });
    } catch (error) { 
        if (error.message === "Post not found") {
            return res.status(404).json({ success: false, message: error.message });
        }
        if (error.message === "Content is required") {
            return res.status(400).json({ success: false, message: error.message });
        }
        next(error); 
    }
};

const deleteComment = async (req, res, next) => {
    try {
        await communityService.deleteComment(req.user.id, req.params.id);
        return res.status(200).json({ success: true, message: "Comment deleted successfully" });
    } catch (error) { 
        if (error.message === "Comment not found") {
            return res.status(404).json({ success: false, message: error.message });
        }
        if (error.message === "Unauthorized to delete this comment") {
            return res.status(403).json({ success: false, message: error.message });
        }
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
    deleteComment
};
