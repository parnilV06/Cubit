const notImplemented = async (req, res) => {
    return res.status(501).json({
        success: false,
        message: "Not implemented yet"
    });
};

module.exports = {
    getPosts: notImplemented,
    createPost: notImplemented,
    getPost: notImplemented,
    deletePost: notImplemented,
    likePost: notImplemented,
    unlikePost: notImplemented,
    addComment: notImplemented,
    deleteComment: notImplemented
};
