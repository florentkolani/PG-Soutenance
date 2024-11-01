const Ticket = require('../models/ticketModel');
// Créer un ticket
exports.createTicket = async (req, res) => {
    console.log("Données reçues :", req.body);
    try {
        // Vérifier que les champs requis sont présents
        const requiredFields = ['userId', 'urgence', 'status']; // Utilisez 'status' au lieu de 'statut'
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ message: `Le champ ${field} est requis.` });
            }
        }

        // Créer le ticket
        const ticket = new Ticket(req.body);
        await ticket.save();
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
    try {
        const ticket = await Ticket.findByIdAndUpdate(req.params.id, { status: 'fermé' }, { new: true }); // Changez 'statut' en 'status'
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket non trouvé' });
        }
        res.status(200).json(ticket);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la fermeture du ticket', error: error.message });
    }
};

// Obtenir tous les tickets
exports.getTickets = async (req, res) => {
    try {
        const filter = req.user.role === 'Client' ? { userId: req.user._id } : {}; // Filtre pour les clients
        const tickets = await Ticket.find(filter).populate('userId productId typeDeDemandeId');
        res.status(200).json(tickets);
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
