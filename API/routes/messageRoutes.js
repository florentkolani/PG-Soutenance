const express = require('express');
const { sendMessage, getMessagesByTicket, getAllMessages } = require('../controllers/messageController');
const messageController = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/messages/', getAllMessages);
router.get('/messages/:ticketId', protect, getMessagesByTicket);
router.get('/messages/:ticketId', messageController.getMessagesByTicket);

module.exports = router;
