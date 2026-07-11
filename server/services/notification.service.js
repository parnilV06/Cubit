const { prisma } = require('../config/database');
const { emitToUser } = require('../utils/socket');

/**
 * Create a new notification and emit a socket event.
 */
const notify = async ({ recipientId, type, title, message }) => {
    // Persist notification to DB first (Source of Truth)
    const notification = await prisma.notification.create({
        data: {
            userId: recipientId,
            type,
            title,
            message,
            isRead: false
        }
    });

    console.log("================================");
    console.log("NOTIFICATION SERVICE LOG");
    console.log("Notification created. ID:", notification.id);
    console.log("Recipient ID:", recipientId);
    console.log("Event being emitted:", 'notification:new');
    console.log("================================");

    // Emit socket event to connected client
    emitToUser(recipientId, 'notification:new', {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        isRead: notification.isRead,
        createdAt: notification.createdAt
    });

    return notification;
};

/**
 * Get all notifications for a specific user, sorted newest first.
 */
const getUserNotifications = async (userId) => {
    const notifications = await prisma.notification.findMany({
        where: {
            userId
        },
        orderBy: {
            createdAt: 'desc'
        },
        select: {
            id: true,
            type: true,
            title: true,
            message: true,
            isRead: true,
            createdAt: true
        }
    });

    return notifications;
};

/**
 * Mark a single notification as read.
 */
const markAsRead = async (userId, notificationId) => {
    // Check ownership first
    const notification = await prisma.notification.findUnique({
        where: { id: notificationId }
    });

    if (!notification) {
        throw new Error('Notification not found');
    }

    if (notification.userId !== userId) {
        throw new Error('Unauthorized access to notification');
    }

    const updatedNotification = await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
        select: {
            id: true,
            type: true,
            title: true,
            message: true,
            isRead: true,
            createdAt: true
        }
    });

    return updatedNotification;
};

/**
 * Mark all unread notifications as read for a user.
 */
const markAllAsRead = async (userId) => {
    await prisma.notification.updateMany({
        where: {
            userId,
            isRead: false
        },
        data: {
            isRead: true
        }
    });
};

module.exports = {
    notify,
    getUserNotifications,
    markAsRead,
    markAllAsRead
};
