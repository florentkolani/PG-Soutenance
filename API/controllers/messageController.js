const Message = require('../models/messageModel');
const mongoose = require("mongoose")

// Envoyer un message
exports.sendMessage = async (req, res) => {
    try {
        const message = new Message(req.body);
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de l\'envoi du message', error });
    }
};
//recupère tout les messages
exports.getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find();
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des messages', error });
    }
};
// Récupérer les messages d'un ticket
exports.getMessagesByTicket = async (req, res) => {
    try {
        const ticketId = req.params.ticketId;

        // Vérifier si l'ID est un ObjectId valide
        if (!mongoose.Types.ObjectId.isValid(ticketId)) {
            return res.status(400).json({ message: 'ID de ticket invalide' });
        }

        // Trouver les messages associés à ce ticket
        const messages = await Message.find({ ticketId: ticketId })
       // .populate('ticketId').populate('userId');

        if (messages.length === 0) {
            return res.status(404).json({ message: 'Aucun message trouvé pour ce ticket' });
        }

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des messages', error: error.message });
    }
};