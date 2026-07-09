const { prisma } = require('../config/database');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const getProfileByUsername = async (username) => {
    const user = await prisma.user.findUnique({
        where: { username },
        select: {
            id: true,
            displayName: true,
            username: true,
            avatarUrl: true,
            bio: true,
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

    const { id, _count, ...profileData } = user;

    return {
        ...profileData,
        totalPosts: _count.posts,
        totalSessions: _count.sessions,
        totalFriends
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

const uploadAvatar = async (userId, fileBuffer) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'Cubit/avatars',
                resource_type: 'image',
                overwrite: true,
                quality: 'auto',
                fetch_format: 'auto',
                width: 512,
                height: 512,
                crop: 'fill',
                gravity: 'face'
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
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
