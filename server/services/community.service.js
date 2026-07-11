const { prisma } = require('../config/database');
const uploadImageHelper = require('../utils/cloudinary');

const buildPostResponse = (post, currentUserId) => {
    // If comments are included in the query (like for a single post), we map them.
    // Otherwise, we omit the comments array from the response.
    let comments = undefined;
    let commentCount = 0;

    if (post.comments) {
        comments = post.comments.map(comment => ({
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            author: {
                id: comment.author.id,
                username: comment.author.username,
                displayName: comment.author.displayName,
                avatarUrl: comment.author.avatarUrl
            }
        }));
        commentCount = post.comments.length;
    } else if (post._count && post._count.comments !== undefined) {
        commentCount = post._count.comments;
    }

    return {
        id: post.id,
        type: post.type,
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl || null,
        createdAt: post.createdAt,
        author: {
            id: post.author.id,
            username: post.author.username,
            displayName: post.author.displayName,
            avatarUrl: post.author.avatarUrl
        },
        solve: post.solve ? {
            time: post.solve.time,
            penalty: post.solve.penalty
        } : null,
        likeCount: post.likes ? post.likes.length : 0,
        commentCount: commentCount,
        isLiked: post.likes ? post.likes.some(like => like.userId === currentUserId) : false,
        ...(comments && { comments })
    };
};

const getPosts = async (userId, page, limit) => {
    const skip = (page - 1) * limit;
    
    const posts = await prisma.post.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
            author: true,
            solve: true,
            likes: true, // Need this to compute isLiked and likeCount
            _count: {
                select: { comments: true }
            }
        }
    });

    return posts.map(post => buildPostResponse(post, userId));
};

const createPost = async (userId, data, file) => {
    const { type, title, content, solveId } = data;

    if (!content) {
        throw new Error("Content is required");
    }

    if ((type === 'PB_SHARE' || type === 'SOLVE_SHARE') && solveId) {
        const solve = await prisma.solve.findUnique({
            where: { id: solveId },
            include: { session: true }
        });

        if (!solve) {
            throw new Error("Solve not found");
        }

        if (solve.session.userId !== userId) {
            throw new Error("Invalid solve ownership");
        }
        
        const existingPostWithSolve = await prisma.post.findUnique({
            where: { solveId }
        });
        
        if (existingPostWithSolve) {
            throw new Error("Solve is already attached to another post");
        }
    }

    let imageUrl = null;
    if (file) {
        const result = await uploadImageHelper.uploadImage(file.buffer, 'Cubit/posts');
        imageUrl = result.secure_url;
    }

    const post = await prisma.post.create({
        data: {
            authorId: userId,
            type,
            title,
            content,
            imageUrl,
            solveId: (type === 'PB_SHARE' || type === 'SOLVE_SHARE') ? (solveId || null) : null
        },
        include: {
            author: true,
            solve: true,
            likes: true,
            _count: {
                select: { comments: true }
            }
        }
    });

    return buildPostResponse(post, userId);
};

const getPost = async (userId, postId) => {
    const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
            author: true,
            solve: true,
            likes: true,
            comments: {
                orderBy: { createdAt: 'asc' },
                include: {
                    author: true
                }
            }
        }
    });

    if (!post) {
        throw new Error("Post not found");
    }

    return buildPostResponse(post, userId);
};

const deletePost = async (userId, postId) => {
    const post = await prisma.post.findUnique({
        where: { id: postId }
    });

    if (!post) {
        throw new Error("Post not found");
    }

    if (post.authorId !== userId) {
        throw new Error("Unauthorized to delete this post");
    }

    await prisma.post.delete({
        where: { id: postId }
    });
};

const likePost = async (userId, postId) => {
    const post = await prisma.post.findUnique({
        where: { id: postId }
    });

    if (!post) {
        throw new Error("Post not found");
    }

    const existingLike = await prisma.postLike.findUnique({
        where: {
            userId_postId: {
                userId,
                postId
            }
        }
    });

    if (existingLike) {
        throw new Error("Post already liked");
    }

    await prisma.postLike.create({
        data: {
            userId,
            postId
        }
    });
};

const unlikePost = async (userId, postId) => {
    const existingLike = await prisma.postLike.findUnique({
        where: {
            userId_postId: {
                userId,
                postId
            }
        }
    });

    if (!existingLike) {
        throw new Error("Like not found");
    }

    await prisma.postLike.delete({
        where: {
            userId_postId: {
                userId,
                postId
            }
        }
    });
};

const addComment = async (userId, postId, data) => {
    const { content } = data;

    if (!content) {
        throw new Error("Content is required");
    }

    const post = await prisma.post.findUnique({
        where: { id: postId }
    });

    if (!post) {
        throw new Error("Post not found");
    }

    const comment = await prisma.comment.create({
        data: {
            postId,
            authorId: userId,
            content
        },
        include: {
            author: true
        }
    });

    return {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        author: {
            id: comment.author.id,
            username: comment.author.username,
            displayName: comment.author.displayName,
            avatarUrl: comment.author.avatarUrl
        }
    };
};

const deleteComment = async (userId, commentId) => {
    const comment = await prisma.comment.findUnique({
        where: { id: commentId }
    });

    if (!comment) {
        throw new Error("Comment not found");
    }

    if (comment.authorId !== userId) {
        throw new Error("Unauthorized to delete this comment");
    }

    await prisma.comment.delete({
        where: { id: commentId }
    });
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
