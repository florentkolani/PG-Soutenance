const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    ratingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Rating' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },  
    typeDeDemandeId: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeDeDemande' },
    urgence: { type: String, required: true },
    statut: { type: String, required: true, default: 'en attente' },
    description: { type: String },
    file: { type: String },
    NumeroTicket: { type: String, unique: true },
    messages: [{
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
