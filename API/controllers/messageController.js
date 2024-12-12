const Message = require('../models/messageModel');
const Ticket = require('../models/ticketModel');
const mongoose = require("mongoose");
const { sendEmail } = require('../services/emailService'); 
const User = require('../models/userModel');

exports.sendMessage = async (req, res) => {
    try {
        const ticketId = req.params.ticketId;

        // Vérifiez si le ticket ID est valide
        if (!mongoose.Types.ObjectId.isValid(ticketId)) {
            return res.status(400).json({ message: 'ID de ticket invalide' });
        }

        // Récupérer le ticket
        const ticket = await Ticket.findById(ticketId).populate('userId');

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket non trouvé' });
        }

        // Créer un nouveau message
        const message = new Message({
            content: req.body.content,
            ticketId,
            userId: req.user.id
        });
        await message.save();

        // Mise à jour du statut du ticket si nécessaire
        if ((req.user.role === 'Admin' || req.user.role === 'AgentSupport') && ticket.statut === 'ouvert') {
            ticket.statut = 'en cours';
            await ticket.save();
        }

        // Préparer les e-mails des destinataires
        const isClient = req.user.role === 'Client';
        const clientEmail = ticket.userId.email; // Email du client depuis le modèle User
        const supportEmails = [
            process.env.EMAIL_NOVA_LEAD
          
        ]; // Emails des agents/admin depuis les variables d'environnement

        const recipients = isClient ? supportEmails : [clientEmail];

        const subject = isClient
            ? `Nouveau message du client pour le ticket #${ticketId}`
            : `Nouvelle réponse d'un agent pour le ticket #${ticketId}`;

        const htmlContent = `
            <p>Un nouveau message a été ajouté au ticket <strong>#${ticketId}</strong> :</p>
            <p><strong>Auteur :</strong> ${req.user.name || req.user.role}</p>
            <p><strong>Message :</strong> ${req.body.content}</p>
            <p>Connectez-vous à la plateforme pour plus de détails.</p>
        `;

        // Envoyer l'e-mail via la fonction sendEmail
        await sendEmail(recipients, subject, htmlContent);

        // Retourner la réponse avec le message créé
        const populatedMessage = await Message.findById(message._id).populate('userId', 'name');
        res.status(201).json(populatedMessage);
    } catch (error) {
        console.error("Erreur lors de l'envoi du message :", error);
        res.status(500).json({ message: "Erreur lors de l'envoi du message", error });
    }
};
// Récupérer les messages d'un ticket spécifique
exports.getMessagesByTicket = async (req, res) => {
    try {
        const ticketId = req.params.ticketId;

        if (!mongoose.Types.ObjectId.isValid(ticketId)) {
            return res.status(400).json({ message: 'ID de ticket invalide' });
        }

        const messages = await Message.find({ ticketId }).populate('userId', 'name');
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des messages', error: error.message });
    }
};



// Récupérer tous les messages
exports.getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find().populate('userId', 'name');
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des messages', error });
    }
};