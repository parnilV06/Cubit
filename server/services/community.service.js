const { prisma } = require('../config/database');
const uploadImageHelper = require('../utils/cloudinary');
const notificationService = require('./notification.service');

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

    if (post.authorId !== userId) {
        const currentUser = await prisma.user.findUnique({ where: { id: userId } });
        await notificationService.notify({
            recipientId: post.authorId,
            type: 'POST_LIKE',
            title: 'New Like',
            message: `${currentUser.username} liked your post.`
        });
    }
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

    if (post.authorId !== userId) {
        const currentUser = await prisma.user.findUnique({ where: { id: userId } });
        await notificationService.notify({
            recipientId: post.authorId,
            type: 'COMMENT',
            title: 'New Comment',
            message: `${currentUser.username} commented on your post.`
        });
    }

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

const getPBLeaderboard = async (currentUserId, options = {}) => {
    const { puzzleType = 'THREE_BY_THREE', scope = 'global', limit = 50 } = options;

    const PUZZLE_MAP = {
        '2x2': 'TWO_BY_TWO',
        '3x3': 'THREE_BY_THREE',
        '4x4': 'FOUR_BY_FOUR',
        '5x5': 'FIVE_BY_FIVE',
        'TWO_BY_TWO': 'TWO_BY_TWO',
        'THREE_BY_THREE': 'THREE_BY_THREE',
        'FOUR_BY_FOUR': 'FOUR_BY_FOUR',
        'FIVE_BY_FIVE': 'FIVE_BY_FIVE'
    };

    const targetPuzzle = PUZZLE_MAP[puzzleType] || 'THREE_BY_THREE';
    const isFriendsScope = scope.toLowerCase() === 'friends';

    let allowedUserIds = null;

    if (isFriendsScope && currentUserId) {
        const friendships = await prisma.friendship.findMany({
            where: {
                status: 'ACCEPTED',
                OR: [
                    { senderId: currentUserId },
                    { receiverId: currentUserId }
                ]
            },
            select: { senderId: true, receiverId: true }
        });

        const friendIds = friendships.map(f => f.senderId === currentUserId ? f.receiverId : f.senderId);
        allowedUserIds = [currentUserId, ...friendIds];
    }

    const solveWhere = {
        penalty: { not: 'DNF' },
        session: {
            puzzleType: targetPuzzle,
            ...(allowedUserIds ? { userId: { in: allowedUserIds } } : {})
        }
    };

    const solves = await prisma.solve.findMany({
        where: solveWhere,
        select: {
            id: true,
            time: true,
            penalty: true,
            createdAt: true,
            session: {
                select: {
                    userId: true,
                    user: {
                        select: {
                            id: true,
                            username: true,
                            displayName: true,
                            avatarUrl: true
                        }
                    }
                }
            }
        }
    });

    const userPBMap = new Map();

    for (const solve of solves) {
        const userId = solve.session.userId;
        const user = solve.session.user;
        const effectiveTime = solve.penalty === 'PLUS_TWO' ? solve.time + 2000 : solve.time;

        if (!userPBMap.has(userId)) {
            userPBMap.set(userId, {
                user,
                pbTime: effectiveTime,
                pbCreatedAt: solve.createdAt
            });
        } else {
            const existing = userPBMap.get(userId);
            if (effectiveTime < existing.pbTime) {
                existing.pbTime = effectiveTime;
                existing.pbCreatedAt = solve.createdAt;
            } else if (effectiveTime === existing.pbTime && new Date(solve.createdAt) < new Date(existing.pbCreatedAt)) {
                existing.pbCreatedAt = solve.createdAt;
            }
        }
    }

    const pbList = Array.from(userPBMap.values());
    pbList.sort((a, b) => {
        if (a.pbTime !== b.pbTime) {
            return a.pbTime - b.pbTime;
        }
        const timeA = new Date(a.pbCreatedAt).getTime();
        const timeB = new Date(b.pbCreatedAt).getTime();
        if (timeA !== timeB) {
            return timeA - timeB;
        }
        return a.user.id.localeCompare(b.user.id);
    });

    const rankedEntries = pbList.map((entry, index) => ({
        rank: index + 1,
        userId: entry.user.id,
        username: entry.user.username,
        displayName: entry.user.displayName,
        avatarUrl: entry.user.avatarUrl,
        time: entry.pbTime,
        formattedTime: (entry.pbTime / 1000).toFixed(2) + 's',
        isCurrentUser: currentUserId ? entry.user.id === currentUserId : false
    }));

    const entryUserIds = rankedEntries.filter(e => !e.isCurrentUser).map(e => e.userId);
    const friendships = (currentUserId && entryUserIds.length > 0) ? await prisma.friendship.findMany({
        where: {
            OR: [
                { senderId: currentUserId, receiverId: { in: entryUserIds } },
                { senderId: { in: entryUserIds }, receiverId: currentUserId }
            ]
        }
    }) : [];

    const friendshipMap = new Map();
    friendships.forEach(f => {
        const otherId = f.senderId === currentUserId ? f.receiverId : f.senderId;
        friendshipMap.set(otherId, f);
    });

    const enrichEntry = (entry) => {
        if (entry.isCurrentUser) {
            return { ...entry, relationshipStatus: 'SELF', requestId: null };
        }
        const f = friendshipMap.get(entry.userId);
        let relationshipStatus = 'NONE';
        let requestId = null;
        if (f) {
            requestId = f.id;
            if (f.status === 'ACCEPTED') relationshipStatus = 'ACCEPTED';
            else if (f.status === 'PENDING') relationshipStatus = f.senderId === currentUserId ? 'OUTGOING_PENDING' : 'INCOMING_PENDING';
        }
        return { ...entry, relationshipStatus, requestId };
    };

    const maxLimit = Math.max(1, parseInt(limit) || 50);
    const topEntries = rankedEntries.slice(0, maxLimit).map(enrichEntry);
    const rawCurrentUserEntry = rankedEntries.find(e => e.isCurrentUser);
    const currentUserEntry = rawCurrentUserEntry ? enrichEntry(rawCurrentUserEntry) : null;

    return {
        puzzleType: targetPuzzle,
        scope: isFriendsScope ? 'friends' : 'global',
        entries: topEntries,
        totalEntries: rankedEntries.length,
        currentUserEntry
    };
};

const getRatingLeaderboard = async (currentUserId, options = {}) => {
    const { scope = 'global', limit = 50 } = options;
    const isFriendsScope = scope === 'friends';

    let eligibleUserIds = null;

    if (isFriendsScope && currentUserId) {
        const friendships = await prisma.friendship.findMany({
            where: {
                status: 'ACCEPTED',
                OR: [
                    { senderId: currentUserId },
                    { receiverId: currentUserId }
                ]
            }
        });

        const friendIds = friendships.map(f =>
            f.senderId === currentUserId ? f.receiverId : f.senderId
        );
        eligibleUserIds = [currentUserId, ...friendIds];
    }

    const whereClause = eligibleUserIds ? { id: { in: eligibleUserIds } } : {};

    const users = await prisma.user.findMany({
        where: whereClause,
        orderBy: [
            { totalRating: 'desc' },
            { username: 'asc' }
        ],
        select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            totalRating: true,
            currentStreak: true,
            longestStreak: true
        }
    });

    const rankedEntries = users.map((user, index) => {
        const ratingVal = user.totalRating ? Number(user.totalRating) : 0;
        return {
            rank: index + 1,
            userId: user.id,
            username: user.username,
            displayName: user.displayName,
            avatarUrl: user.avatarUrl,
            rating: Number(ratingVal.toFixed(2)),
            formattedRating: ratingVal.toFixed(2),
            streak: {
                current: user.currentStreak || 0,
                longest: user.longestStreak || 0
            },
            isCurrentUser: currentUserId ? user.id === currentUserId : false
        };
    });

    const entryUserIds = rankedEntries.filter(e => !e.isCurrentUser).map(e => e.userId);
    const friendships = (currentUserId && entryUserIds.length > 0) ? await prisma.friendship.findMany({
        where: {
            OR: [
                { senderId: currentUserId, receiverId: { in: entryUserIds } },
                { senderId: { in: entryUserIds }, receiverId: currentUserId }
            ]
        }
    }) : [];

    const friendshipMap = new Map();
    friendships.forEach(f => {
        const otherId = f.senderId === currentUserId ? f.receiverId : f.senderId;
        friendshipMap.set(otherId, f);
    });

    const enrichEntry = (entry) => {
        if (entry.isCurrentUser) {
            return { ...entry, relationshipStatus: 'SELF', requestId: null };
        }
        const f = friendshipMap.get(entry.userId);
        let relationshipStatus = 'NONE';
        let requestId = null;
        if (f) {
            requestId = f.id;
            if (f.status === 'ACCEPTED') relationshipStatus = 'ACCEPTED';
            else if (f.status === 'PENDING') relationshipStatus = f.senderId === currentUserId ? 'OUTGOING_PENDING' : 'INCOMING_PENDING';
        }
        return { ...entry, relationshipStatus, requestId };
    };

    const maxLimit = Math.max(1, parseInt(limit) || 50);
    const topEntries = rankedEntries.slice(0, maxLimit).map(enrichEntry);
    const rawCurrentUserEntry = rankedEntries.find(e => e.isCurrentUser);
    const currentUserEntry = rawCurrentUserEntry ? enrichEntry(rawCurrentUserEntry) : null;

    return {
        scope: isFriendsScope ? 'friends' : 'global',
        entries: topEntries,
        totalEntries: rankedEntries.length,
        currentUserEntry
    };
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
