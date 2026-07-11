const { prisma } = require('../config/database');

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

module.exports = {
    getFriends,
    getRequests,
    sendFriendRequest,
    acceptRequest,
    rejectRequest,
    removeFriend
};
