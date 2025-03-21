const express = require('express');
const { 
    sendMessage, 
    getMessagesByTicket, 
    getAllMessages 
} = require('../controllers/messageController');

const { updateTicketStatus } = require('../controllers/ticketController'); // Importer la fonction du contrôleur pour la mise à jour du statut
const upload = require('../upload');

const { protect, restrictToRoles } = require('../middleware/authMiddleware');
const router = express.Router();

// Route pour envoyer un message (avec ou sans fichier)
router.post('/:ticketId/messages', protect, upload.single('file'), sendMessage);

// Route pour récupérer tous les messages
router.get('/messages', protect, getAllMessages);

// Route pour récupérer les messages par ticket
router.get('/:ticketId/messages', protect, getMessagesByTicket);

// Route pour mettre à jour le statut d'un ticket
router.put('/:ticketId/statut', protect, restrictToRoles('Admin', 'AgentSupport'), updateTicketStatus);

module.exports = router;
