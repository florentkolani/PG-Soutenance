const express = require('express');
const { createTicket, updateTicket, updateTicketStatus, closeTicket, getTickets, getTicketById } = require('../controllers/ticketController');
const { protect, restrictToRoles } = require('../middleware/authMiddleware');

const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/', protect, upload.single('file'), createTicket);
router.put('/:id', protect, updateTicket);

// Route pour mettre à jour le statut d'un ticket
// router.put('/:ticketId/statut', protect, restrictToRoles('Admin', 'AgentSupport'), updateTicketStatus);

router.put('/:ticketId/close', protect, restrictToRoles('Client'), closeTicket);
router.get('/', protect, getTickets);
router.get('/:id', protect, getTicketById);

module.exports = router;
