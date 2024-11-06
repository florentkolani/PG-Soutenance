const express = require('express');
const { createTicket, updateTicket, closeTicket, getTickets, getTicketById } = require('../controllers/ticketController');
const { protect, restrictToRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createTicket);

router.put('/:id', protect, updateTicket);

// Fermer un ticket (uniquement pour Admin et Agent Support)
router.put('/:id/close', protect, restrictToRoles('Admin', 'AgentSupport'), closeTicket);

// Obtenir tous les tickets avec pagination
router.get('/', protect, getTickets); // Cette route prend en charge la pagination via les paramètres de requête 'page' et 'limit'

// Obtenir un ticket par ID
router.get('/:id', protect, getTicketById);

module.exports = router;