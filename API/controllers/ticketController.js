const Ticket = require('../models/ticketModel');
const User = require('../models/userModel');
const type = require('../models/typeDeDemandeModel');
const rating = require('../models/ratingModel');
const nodemailer = require("nodemailer");
const {sendEmail} = require('../services/emailService');

//Configuration de Nodemailer
require('dotenv').config();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_NOVA_LEAD,
        pass: process.env.EMAIL_PASS,
    },
});

// Fonction pour envoyer un email à NOVA LEAD
async function envoyerEmail(ticket) {
    try {
        // Récupérer le nom de l'utilisateur à partir de l'ID
        const user = await User.findById(ticket.userId);
        const typeDeDemande = await type.findById(ticket.typeDeDemandeId);

        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }

        if (!typeDeDemande) {
            throw new Error("Type de demande non trouvé");
        }

        const mailOptions = {
            from: user.email, // email du client
            to: process.env.EMAIL_NOVA_LEAD , // Email des admins et agents support
            subject: `Nouvelle demande d’assistance reçue – Ticket #${ticket.NumeroTicket} (${typeDeDemande.name})`, // Objet de l'email
            html: `
                <html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <h3 style="color: #007BFF;">Nouvelle demande d’assistance reçue – Ticket #${ticket.NumeroTicket}</h3>

                        <p>Bonjour NOVA LEAD,</p>

                        <p>Un nouveau ticket d’assistance a été soumis par <strong>${user.name}</strong>.</p>

                        <p><strong>Détails du ticket :</strong></p>
                        <ul style="list-style: none; padding: 0;">
                            <li><strong>📌 Numéro du Ticket :</strong> #${ticket.NumeroTicket}</li>
                            <li><strong>👤 Client :</strong> ${user.name}</li>
                            <li><strong>📌 Objet :</strong> ${typeDeDemande.name}</li>
                            <li><strong>📝 Description :</strong> ${ticket.description}</li>
                            <li><strong>⚠️ Priorité :</strong> ${ticket.urgence ? 'Urgente' : 'Pas urgente'}</li>
                            <li><strong>📅 Date de soumission :</strong> ${new Date(ticket.createdAt).toLocaleString()}</li>
                        </ul>

                        <p>Merci de prendre en charge cette demande dès que possible.</p>

                        <p>Vous pouvez consulter et traiter le ticket en cliquant sur le lien ci-dessous :</p>
                        <p>
                            <a href="http://localhost:5173/login" 
                            style="color: #3498db; text-decoration: none; font-weight: bold;">
                                ➡️ Accéder à la plateforme
                            </a>
                        </p>

                        <p style="margin-top: 20px;">Cordialement,</p>
                        <p style="text-align: right; margin-top: 30px;"><em>${user.name}</em></p>
                    </body>
                </html>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log("Email envoyé avec succès.");
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email:", error);
    }
}

let ticketCounter = 0;
let currentYear = new Date().getFullYear();

async function generateNumeroTicket() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    if (year !== currentYear) {
        currentYear = year;
        ticketCounter = 0;
    }

    let numeroTicket;
    let isUnique = false;

    while (!isUnique) {
        ticketCounter += 1;
        const counterString = String(ticketCounter).padStart(5, '0');
        numeroTicket = `TCK-${year}${month}-${counterString}`;

        // Vérifier l'unicité du numéro de ticket
        const existingTicket = await Ticket.findOne({ NumeroTicket: numeroTicket });
        if (!existingTicket) {
            isUnique = true;
        }
    }

    return numeroTicket;
}

// Créer un ticket
exports.createTicket = async (req, res) => {
    console.log("Données reçues :", req.body);

    if (req.file) {
        console.log("Fichier reçu :", req.file);
        console.log("Taille du fichier :", req.file.size);
    }

    try {
        // Vérification des champs obligatoires
        const requiredFields = ['userId', 'urgence', 'status'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ message: `Le champ ${field} est requis.` });
            }
        }

        // Génération du NumeroTicket
        const NumeroTicket = await generateNumeroTicket();

        // Création des données du ticket
        const ticketData = {
            ...req.body,
            NumeroTicket,
            file: req.file ? req.file.filename : null
        };

        // Enregistrement dans la base de données
        const ticket = new Ticket(ticketData);
        await ticket.save();

        // Envoi de l'email
        await envoyerEmail(ticket);

        // Réponse de succès
        res.status(201).json(ticket);
    } catch (error) {
        console.error("Erreur lors de la création du ticket :", error.message);
        res.status(400).json({ message: 'Erreur lors de la création du ticket', error: error.message });
    }
};

// Mettre à jour le statut du ticket
exports.updateTicketStatus = async (req, res) => {
    console.log('Requête reçue pour mettre à jour le statut:', req.body, 'Ticket ID:', req.params.ticketId);
    try {
        const ticket = await Ticket.findById(req.params.ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket non trouvé' });
        }
        ticket.statut = req.body.statut || ticket.statut;
        await ticket.save();

        res.status(200).json(ticket);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la mise à jour du statut du ticket', error: error.message });
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


// Fermer un ticket et envoyer un email
exports.closeTicket = async (req, res) => {
    const ticketId = req.params.ticketId;

    try {
        // Fermer le ticket en mettant à jour son statut
        const updatedTicket = await Ticket.findByIdAndUpdate(ticketId, { statut: 'cloturé' }, { new: true });
        
        if (!updatedTicket) {
            return res.status(404).send('Ticket non trouvé');
        }

        // Récupérer l'utilisateur associé au ticket
        const user = await User.findById(updatedTicket.userId);
        if (!user) {
            return res.status(404).send('Utilisateur non trouvé');
        }

        // Récupérer la note associée au ticket
        const ticketRating = await rating.findOne({ ticketId: ticketId });

        // Préparer et envoyer l'email
        const emailSubject = `Votre demande d’assistance #${updatedTicket.NumeroTicket} a été clôturée`;

        const emailHtml = `
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h3 style="color: #007BFF;">Ticket clôturé avec succès</h3>
                    <p>Bonjour ${user.name},</p>
                    
                    <p>Nous vous informons que votre demande d’assistance <strong>#${updatedTicket.NumeroTicket}</strong> concernant 
                    <strong>${updatedTicket.description}</strong> a été traitée et clôturée avec succès.</p>

                    <p><strong>Détails de votre demande :</strong></p>
                    <ul style="list-style: none; padding: 0;">
                        <li><strong>📌 Numéro du Ticket :</strong> #${updatedTicket.NumeroTicket}</li>
                        <li><strong>📅 Date de clôture :</strong> ${new Date().toLocaleString()}</li>
                        <li><strong>⭐ Note attribuée à l’assistance :</strong> ${ticketRating ? ticketRating.note : 'Non attribuée'}</li>
                    </ul>

                    <p>Nous vous remercions de votre confiance et espérons que notre assistance a répondu à vos attentes.</p>

                    <p>Si vous avez d’autres préoccupations, n’hésitez pas à soumettre une nouvelle demande via notre plateforme d’assistance.</p>

                    <p>À bientôt et merci de faire confiance à <strong>NOVA LEAD</strong> !</p>

                    <p>
                        <a href="http://localhost:5173/login" 
                           style="color: #3498db; text-decoration: none; font-weight: bold;">
                            ➡️ Accéder à la plateforme
                        </a>
                    </p>

                    <p style="margin-top: 20px;">Cordialement,</p>
                    <p style="text-align: right; margin-top: 30px;">
                        <em>L'équipe de support NOVA LEAD</em>
                    </p>
                </body>
            </html>
        `;

        await sendEmail(user.email, emailSubject, emailHtml);

        console.log('Ticket closed successfully and email sent:', updatedTicket);
        res.status(200).json(updatedTicket);

    } catch (err) {
        console.error('Erreur lors de la clôture du ticket ou de l\'envoi de l\'email:', err);
        res.status(500).send('Erreur interne du serveur');
    }
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