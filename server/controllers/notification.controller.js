const notificationService = require('../services/notification.service');

const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await notificationService.getUserNotifications(userId);
        
        return res.status(200).json({
            success: true,
            message: "Notifications retrieved successfully",
            data: notifications
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while fetching notifications'
        });
    }
};

const markAsRead = async (req, res) => {
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
        console.error('Error marking notification as read:', error);
        if (error.message === 'Notification not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        if (error.message === 'Unauthorized access to notification') {
            return res.status(403).json({
                success: false,
                message: error.message
            });
        }
        return res.status(500).json({
            success: false,
            message: 'An error occurred while marking the notification as read'
        });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        
        await notificationService.markAllAsRead(userId);
        
        return res.status(200).json({
            success: true,
            message: "All notifications marked as read",
            data: {}
        });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while marking all notifications as read'
        });
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead
};
