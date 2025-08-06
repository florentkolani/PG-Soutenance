const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // destinataire
    type: { type: String, enum: ['ticket', 'task', 'message'], required: true },
    ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: false },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: false },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema); 