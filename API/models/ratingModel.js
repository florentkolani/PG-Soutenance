const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    note: { type: String, required: true },
    commentaire: { type: String },
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true }
},
{
    timestamps: true,
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
