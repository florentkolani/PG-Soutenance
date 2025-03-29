const express = require('express');
const { createTicket, updateTicket, updateTicketStatus, closeTicket, getTickets, getTicketById, getTicketStats } = require('../controllers/ticketController');
const { protect, restrictToRoles } = require('../middleware/authMiddleware');
const { documentUpload } = require('../upload');

const router = express.Router();

// Mettre les routes stats avant les routes avec :id pour éviter les conflits
router.get('/stats', protect, getTicketStats);
router.get('/stats/:userId', protect, getTicketStats);

router.post('/', protect, documentUpload.single('file'), createTicket);
router.put('/:id', protect, documentUpload.single('file'), updateTicket);
router.put('/:ticketId/statut', protect, updateTicketStatus);
router.put('/:ticketId/close', protect, restrictToRoles('Client'), closeTicket);
router.get('/', protect, getTickets);
router.get('/:id', protect, getTicketById);

module.exports = router;
