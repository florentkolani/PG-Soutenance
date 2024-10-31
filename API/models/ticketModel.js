const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    ratingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Rating' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },  // Suppression du tableau ici
    typeDeDemandeId: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeDeDemande' },
    urgence: { type: String, required: true },
    statut: { type: String, required: true, default: 'ouvert' },
    description: { type: String },
    screenshotPath: { type: String },
    messages: [{
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
