const express = require('express');
const { createTicket, updateTicket, closeTicket, getTickets, getTicketById } = require('../controllers/ticketController');
const { protect, restrictToRoles } = require('../middleware/authMiddleware');

const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Dossier où les fichiers seront stockés

router.post('/', protect, upload.single('file'), createTicket);

router.put('/:id', protect, updateTicket);


router.put('/:ticketId/close', protect, restrictToRoles('Client'), closeTicket);

// Obtenir tous les tickets avec pagination
router.get('/', protect, getTickets);
router.get('/:id', protect, getTicketById);

module.exports = router;