const notificationService = require('../services/notification.service');

const getNotifications = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const notifications = await notificationService.getUserNotifications(userId);
        
        return res.status(200).json({
            success: true,
            message: "Notifications retrieved successfully",
            data: notifications
        });
    } catch (error) {
        next(error);
    }
};

const markAsRead = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const notificationId = req.params.id;
        
        const notification = await notificationService.markAsRead(userId, notificationId);
        
        return res.status(200).json({
            success: true,
            message: "Notification marked as read",
            data: notification
        });
    } catch (error) {
        next(error);
    }
};

const markAllAsRead = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        await notificationService.markAllAsRead(userId);
        
        return res.status(200).json({
            success: true,
            message: "All notifications marked as read",
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead
};
