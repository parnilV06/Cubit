const { prisma } = require('../config/database');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const getProfileByUsername = async (username, currentUserId = null) => {
    const user = await prisma.user.findUnique({
        where: { username },
        select: {
            id: true,
            displayName: true,
            username: true,
            avatarUrl: true,
            bio: true,
            totalRating: true,
            currentStreak: true,
            longestStreak: true,
            createdAt: true,
            _count: {
                select: {
                    posts: true,
                    sessions: true
                }
            }
        }
    });

    if (!user) return null;

    const totalFriends = await prisma.friendship.count({
        where: {
            status: 'ACCEPTED',
            OR: [
                { senderId: user.id },
                { receiverId: user.id }
            ]
        }
    });

    const totalSolves = await prisma.solve.count({
        where: { session: { userId: user.id } }
    });

    const pbSolve = await prisma.solve.findFirst({
        where: { session: { userId: user.id }, penalty: { not: 'DNF' } },
        orderBy: { time: 'asc' }
    });

    const avgResult = await prisma.solve.aggregate({
        where: { session: { userId: user.id }, penalty: { not: 'DNF' } },
        _avg: { time: true }
    });

    let relationshipStatus = 'NONE';
    let requestId = null;

    if (currentUserId) {
        if (currentUserId === user.id) {
            relationshipStatus = 'SELF';
        } else {
            const friendship = await prisma.friendship.findFirst({
                where: {
                    OR: [
                        { senderId: currentUserId, receiverId: user.id },
                        { senderId: user.id, receiverId: currentUserId }
                    ]
                }
            });

            if (friendship) {
                requestId = friendship.id;
                if (friendship.status === 'ACCEPTED') {
                    relationshipStatus = 'ACCEPTED';
                } else if (friendship.status === 'PENDING') {
                    relationshipStatus = friendship.senderId === currentUserId ? 'OUTGOING_PENDING' : 'INCOMING_PENDING';
                }
            }
        }
    }

    const { id, _count, ...profileData } = user;

    return {
        id,
        ...profileData,
        totalPosts: _count.posts,
        totalSessions: _count.sessions,
        totalFriends,
        totalSolves,
        pb: pbSolve ? (pbSolve.penalty === 'PLUS_TWO' ? pbSolve.time + 2000 : pbSolve.time) : null,
        avgSolve: avgResult._avg?.time || null,
        relationshipStatus,
        requestId,
        isOwnProfile: currentUserId ? currentUserId === user.id : false
    };
};

const updateProfile = async (userId, updateData) => {
    // Only extract the allowed fields
    const { displayName, bio } = updateData;
    
    // We construct the data object dynamically so we only update provided fields
    const dataToUpdate = {};
    if (displayName !== undefined) dataToUpdate.displayName = displayName;
    if (bio !== undefined) dataToUpdate.bio = bio;

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: dataToUpdate,
        select: {
            displayName: true,
            username: true,
            avatarUrl: true,
            bio: true,
            createdAt: true
        }
    });

    return updatedUser;
};

const uploadImageHelper = require('../utils/cloudinary');

const uploadAvatar = async (userId, fileBuffer) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const result = await uploadImageHelper.uploadImage(fileBuffer, 'Cubit/avatars', {
        overwrite: true,
        quality: 'auto',
        fetch_format: 'auto',
        width: 512,
        height: 512,
        crop: 'fill',
        gravity: 'face'
    });

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { avatarUrl: result.secure_url },
        select: {
            displayName: true,
            username: true,
            avatarUrl: true,
            bio: true,
            createdAt: true
        }
    });

    return updatedUser;
};

module.exports = {
    getProfileByUsername,
    updateProfile,
    uploadAvatar
};
