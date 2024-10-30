const express = require('express');
const { createTicket, updateTicket, closeTicket, getTickets, getTicketById } = require('../controllers/ticketController');
const { protect, restrictToRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createTicket);
router.put('/:id', protect, updateTicket);
router.put('/:id/close', protect, restrictToRoles('Admin', 'AgentSupport'), closeTicket);
router.get('/', protect, getTickets);
router.get('/:id', protect, getTicketById);

module.exports = router;
