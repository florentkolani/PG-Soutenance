const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: { type: String },
    dateEnvoi: { type: Date, default: Date.now },
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    file: { type: String }
},
    {
        timestamps: true,
    });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
