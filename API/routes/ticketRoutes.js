const express = require('express');
const { createTicket, updateTicket, updateTicketStatus, closeTicket, getTickets, getTicketById } = require('../controllers/ticketController');
const { protect, restrictToRoles } = require('../middleware/authMiddleware');
const upload = require('../upload'); // Importer la configuration de `multer`

const router = express.Router();

router.post('/', protect, upload.single('file'), createTicket);
router.put('/:id', protect, updateTicket);
router.put('/:ticketId/close', protect, restrictToRoles('Client'), closeTicket);
router.get('/', protect, getTickets);
router.get('/:id', protect, getTicketById);

module.exports = router;
