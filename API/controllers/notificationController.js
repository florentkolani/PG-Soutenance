const Notification = require('../models/notificationModel');

// Create a notification
exports.createNotification = async (req, res) => {
    try {
        const { user, type, ticket, task, message } = req.body;
        const notification = new Notification({ user, type, ticket, task, message });
        await notification.save();
        const sendNotificationToUser = req.app.get('sendNotificationToUser');
        if (sendNotificationToUser) {
            sendNotificationToUser(user, notification);
        }
        res.status(201).json(notification);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création de la notification', error: error.message });
    }
};

// Get notifications for a user (optionally only unread)
exports.getUserNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const filter = { user: userId };
        if (req.query.unread === 'true') {
            filter.isRead = false;
        }
        const notifications = await Notification.find(filter).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des notifications', error: error.message });
    }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ message: 'Notification non trouvée' });
        }
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la notification', error: error.message });
    }
};

// Get unread notifications count for a user
exports.getUnreadCount = async (req, res) => {
    try {
        const userId = req.user._id;
        const count = await Notification.countDocuments({ user: userId, isRead: false });
        res.status(200).json({ unreadCount: count });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du nombre de notifications non lues', error: error.message });
    }
}; 