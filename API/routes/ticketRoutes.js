const express = require('express');
const { createTicket, updateTicket, closeTicket, getTickets, getTicketById } = require('../controllers/ticketController');
const { protect, restrictToRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect,  createTicket);

router.put('/:id', protect, updateTicket);


router.put('/:ticketId/close', protect, restrictToRoles('Client'), closeTicket);

// Obtenir tous les tickets avec pagination
router.get('/', protect, getTickets);
router.get('/:id', protect, getTicketById);

module.exports = router;