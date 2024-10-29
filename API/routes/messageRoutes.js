const express = require('express');
const { sendMessage, getMessagesByTicket, getAllMessages } = require('../controllers/messageController');
const messageController = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/:ticketId/messages', protect, sendMessage);

router.get('/messages', protect, getAllMessages);

router.get('/:ticketId/messages', protect, getMessagesByTicket);

module.exports = router;
