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
    ? `Nouveau message d'un client concernant le ticket #${ticketId}`
    : `Nouvelle réponse à votre ticket #${ticketId}`;

const htmlContent = `
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h3 style="color: #007BFF;">Mise à jour du ticket <strong>#${ticketId}</strong></h3>
            <p>Bonjour,</p>
            <p>Un nouveau message a été ajouté au ticket <strong>#${ticketId}</strong>. Voici les détails :</p>
            <ul style="list-style: none; padding: 0; margin: 0;">
                <li><strong>Auteur :</strong> ${req.user.name || req.user.role}</li>
                <li><strong>Message :</strong> ${req.body.content}</li>
            </ul>
            <p>Pour consulter toutes les informations liées à ce ticket, cliquez sur le lien ci-dessous :</p>
            <p>
                <a href="http://localhost:5173/login" 
                   style="color: #3498db; text-decoration: none; font-weight: bold;">
                    ➡️ Accéder à la plateforme
                </a>
            </p>
            <p style="margin-top: 20px;">Merci pour votre réactivité.</p>
            <p style="text-align: right; margin-top: 30px;">
                Cordialement,<br>
                <em>L'équipe de support</em>
            </p>
        </body>
    </html>
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