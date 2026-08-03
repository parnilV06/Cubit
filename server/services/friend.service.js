const { prisma } = require('../config/database');
const notificationService = require('./notification.service');

const getOtherUser = (friendship, currentUserId) => {
    return friendship.senderId === currentUserId ? friendship.receiver : friendship.sender;
};

const formatUser = (user) => ({
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    bio: user.bio
});

const getFriends = async (userId) => {
    const friendships = await prisma.friendship.findMany({
        where: {
            status: 'ACCEPTED',
            OR: [
                { senderId: userId },
                { receiverId: userId }
            ]
        },
        include: {
            sender: true,
            receiver: true
        }
    });

    return friendships.map(f => {
        const otherUser = formatUser(getOtherUser(f, userId));
        return {
            friendshipId: f.id,
            ...otherUser
        };
    });
};

const getRequests = async (userId) => {
    const requests = await prisma.friendship.findMany({
        where: {
            status: 'PENDING',
            OR: [
                { senderId: userId },
                { receiverId: userId }
            ]
        },
        include: {
            sender: true,
            receiver: true
        }
    });

    const incoming = [];
    const outgoing = [];

    requests.forEach(req => {
        const formatted = {
            requestId: req.id,
            createdAt: req.createdAt
        };
        if (req.receiverId === userId) {
            formatted.sender = formatUser(req.sender);
            incoming.push(formatted);
        } else {
            formatted.receiver = formatUser(req.receiver);
            outgoing.push(formatted);
        }
    });

    return { incoming, outgoing };
};

const sendFriendRequest = async (userId, targetUsername) => {
    const targetUser = await prisma.user.findUnique({
        where: { username: targetUsername }
    });

    if (!targetUser) {
        throw new Error("Target user not found");
    }

    if (targetUser.id === userId) {
        throw new Error("Cannot send a friend request to yourself");
    }

    const existingFriendship = await prisma.friendship.findFirst({
        where: {
            OR: [
                { senderId: userId, receiverId: targetUser.id },
                { senderId: targetUser.id, receiverId: userId }
            ]
        }
    });

    if (existingFriendship) {
        if (existingFriendship.status === 'ACCEPTED') {
            throw new Error("You are already friends with this user");
        }
        if (existingFriendship.status === 'PENDING') {
            if (existingFriendship.senderId === userId) {
                throw new Error("Duplicate request: You have already sent a friend request to this user");
            } else {
                throw new Error("Reverse pending request: This user has already sent you a friend request. Please check your incoming requests");
            }
        }
    }

    await prisma.friendship.create({
        data: {
            senderId: userId,
            receiverId: targetUser.id,
            status: 'PENDING'
        }
    });

    const currentUser = await prisma.user.findUnique({ where: { id: userId } });
    await notificationService.notify({
        recipientId: targetUser.id,
        type: 'FRIEND_REQUEST',
        title: 'New Friend Request',
        message: `${currentUser.username} sent you a friend request.`
    });
};

const acceptRequest = async (userId, requestId) => {
    const friendship = await prisma.friendship.findUnique({
        where: { id: requestId }
    });

    if (!friendship) {
        throw new Error("Friend request not found");
    }

    if (friendship.receiverId !== userId) {
        throw new Error("Unauthorized to accept this request");
    }

    if (friendship.status !== 'PENDING') {
        throw new Error("Friend request must be PENDING to accept");
    }

    await prisma.friendship.update({
        where: { id: requestId },
        data: {
            status: 'ACCEPTED',
            acceptedAt: new Date()
        }
    });

    const currentUser = await prisma.user.findUnique({ where: { id: userId } });
    await notificationService.notify({
        recipientId: friendship.senderId,
        type: 'FRIEND_ACCEPTED',
        title: 'Friend Request Accepted',
        message: `${currentUser.username} accepted your friend request.`
    });
};

const rejectRequest = async (userId, requestId) => {
    const friendship = await prisma.friendship.findUnique({
        where: { id: requestId }
    });

    if (!friendship) {
        throw new Error("Friend request not found");
    }

    if (friendship.receiverId !== userId) {
        throw new Error("Unauthorized to reject this request");
    }

    await prisma.friendship.delete({
        where: { id: requestId }
    });
};

const removeFriend = async (userId, friendshipId) => {
    const friendship = await prisma.friendship.findUnique({
        where: { id: friendshipId }
    });

    if (!friendship) {
        throw new Error("Friendship not found");
    }

    if (friendship.senderId !== userId && friendship.receiverId !== userId) {
        throw new Error("Unauthorized to delete this friendship");
    }

    await prisma.friendship.delete({
        where: { id: friendshipId }
    });
};

const searchUsers = async (currentUserId, query) => {
    if (!query || typeof query !== 'string' || !query.trim()) {
        return [];
    }

    const q = query.trim();

    const users = await prisma.user.findMany({
        where: {
            OR: [
                { username: { contains: q, mode: 'insensitive' } },
                { displayName: { contains: q, mode: 'insensitive' } }
            ]
        },
        select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            bio: true
        },
        take: 20
    });

    if (users.length === 0) return [];

    const targetUserIds = users.filter(u => u.id !== currentUserId).map(u => u.id);

    const friendships = targetUserIds.length > 0 ? await prisma.friendship.findMany({
        where: {
            OR: [
                { senderId: currentUserId, receiverId: { in: targetUserIds } },
                { senderId: { in: targetUserIds }, receiverId: currentUserId }
            ]
        }
    }) : [];

    const friendshipMap = new Map();
    friendships.forEach(f => {
        const otherId = f.senderId === currentUserId ? f.receiverId : f.senderId;
        friendshipMap.set(otherId, f);
    });

    return users.map(user => {
        if (user.id === currentUserId) {
            return {
                ...user,
                relationshipStatus: 'SELF',
                requestId: null
            };
        }

        const friendship = friendshipMap.get(user.id);
        let relationshipStatus = 'NONE';
        let requestId = null;

        if (friendship) {
            requestId = friendship.id;
            if (friendship.status === 'ACCEPTED') {
                relationshipStatus = 'ACCEPTED';
            } else if (friendship.status === 'PENDING') {
                if (friendship.senderId === currentUserId) {
                    relationshipStatus = 'OUTGOING_PENDING';
                } else {
                    relationshipStatus = 'INCOMING_PENDING';
                }
            }
        }

        return {
            ...user,
            relationshipStatus,
            requestId
        };
    });
};

module.exports = {
    getFriends,
    getRequests,
    sendFriendRequest,
    acceptRequest,
    rejectRequest,
    removeFriend,
    searchUsers
};

