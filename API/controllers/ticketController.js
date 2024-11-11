const Ticket = require('../models/ticketModel');
const nodemailer = require("nodemailer");

//Configuration de Nodemailer
require('dotenv').config();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Fonction pour envoyer un email
async function envoyerEmail(ticket) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'kolaniflorent446@gmail.com', // Email des admins et agents support
            subject: `Nouveau ticket créé par ${ticket.userId}`, // Utilisez des infos du ticket
            text: `Bonjour,\n\nUn nouveau ticket a été créé par ${ticket.userId}.\n\nDétails du ticket:\n- ID: ${ticket._id}\n- Urgence: ${ticket.urgence}\n- Statut: ${ticket.status}\n- Description: ${ticket.description}\n\nMerci de prendre en charge ce ticket.\n\nCordialement,\nNOVA LEAD`,
        };

        await transporter.sendMail(mailOptions);
        console.log("Email envoyé avec succès.");
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email:", error);
    }
}

// Créer un ticket
exports.createTicket = async (req, res) => {
    console.log("Données reçues :", req.body);
    console.log("Fichier reçu :", req.file);
    try {
        // Vérifier que les champs requis sont présents
        const requiredFields = ['userId', 'urgence', 'status']; 
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ message: `Le champ ${field} est requis.` });
            }
        }
        // Si un fichier est reçu, vous pouvez l'ajouter à l'objet ticket
        const ticketData = {
            ...req.body,
            file: req.file ? req.file.path : null // Enregistrez le chemin du fichier
        };

        // Créer le ticket
        const ticket = new Ticket(req.body);
        await ticket.save();
        // Envoyer un email aux admins et agents support
        await envoyerEmail(ticket);

        res.status(201).json(ticket);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création du ticket', error: error.message });
    }
};

// Mettre à jour un ticket
exports.updateTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket non trouvé' });
        }
        res.status(200).json(ticket);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la mise à jour du ticket', error: error.message });
    }
};

// Fermer un ticket
exports.closeTicket = async (req, res) => {
    const ticketId = req.params.ticketId;
    Ticket.findByIdAndUpdate(ticketId, { statut: 'cloturé' }, { new: true })
        .then(updatedTicket => {
            if (!updatedTicket) {
                return res.status(404).send('Ticket not found');
            }
            console.log('Ticket closed successfully:', updatedTicket);
            res.status(200).json(updatedTicket);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Erreur lors de la clôture du ticket');
        });
};

// Obtenir tous les tickets avec pagination
exports.getTickets = async (req, res) => {
    try {
        const filter = req.user.role === 'Client' ? { userId: req.user._id } : {};
        // Récupération des paramètres de pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Compter le nombre total de tickets correspondant au filtre
        const total = await Ticket.countDocuments(filter);

        // Récupérer les tickets avec pagination
        const tickets = await Ticket.find(filter)
            .populate('userId productId typeDeDemandeId')
            .skip(skip)
            .limit(limit);

        // Retourner les tickets et le total
        res.status(200).json({
            tickets,
            total, // Retourner le total pour la pagination
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des tickets', error: error.message });
    }
};

// Obtenir un ticket par ID
exports.getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id).populate('userId productId typeDeDemandeId');
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket non trouvé' });
        }
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du ticket', error: error.message });
    }
};

// Ajouter un message à un ticket
exports.addMessageToTicket = async (req, res) => {
    try {
        const { senderId, content } = req.body; // Assurez-vous que ces champs sont envoyés
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket non trouvé' });
        }
        ticket.messages.push({ senderId, content });
        await ticket.save();
        res.status(200).json(ticket);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de l\'ajout du message', error: error.message });
    }
};

// Changer le statut d'un ticket
exports.changeTicketStatus = async (req, res) => {
    try {
        const { status } = req.body; // Assurez-vous que ce champ est envoyé
        const ticket = await Ticket.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket non trouvé' });
        }
        res.status(200).json(ticket);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la mise à jour du statut', error: error.message });
    }
};
