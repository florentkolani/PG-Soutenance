const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// Créer une notification
router.post('/', protect, notificationController.createNotification);

// Récupérer les notifications de l'utilisateur connecté
router.get('/me', protect, notificationController.getUserNotifications);

// Marquer une notification comme lue
router.patch('/:id/read', protect, notificationController.markAsRead);

// Get unread notifications count for a user
router.get('/unread-count', protect, notificationController.getUnreadCount);

module.exports = router; 