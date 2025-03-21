const express = require('express');
const { createTicket, updateTicket, updateTicketStatus, closeTicket, getTickets, getTicketById, getTicketStats } = require('../controllers/ticketController');
const { protect, restrictToRoles } = require('../middleware/authMiddleware');
const upload = require('../upload'); // Importer la configuration de `multer`

const router = express.Router();

// Mettre les routes stats avant les routes avec :id pour éviter les conflits
router.get('/stats', protect, getTicketStats);
router.get('/stats/:userId', protect, getTicketStats);

router.post('/', protect, upload.single('file'), createTicket);
router.put('/:id', protect, upload.single('file'), updateTicket);
router.put('/:ticketId/statut', protect, updateTicketStatus);
router.put('/:ticketId/close', protect, restrictToRoles('Client'), closeTicket);
router.get('/', protect, getTickets);
router.get('/:id', protect, getTicketById);

module.exports = router;
