const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    countryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
   typeDeDemandeId: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeDeDemande', required: true },
   statut: { type: String, required: true, default: 'en attente' },
   description: { type: String },
   files: { type: [String], default: [] },
   startday: { type: Date, default: null },
   endday: { type: Date, default: null },
   messages: [{
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: false },
    createdAt: { type: Date, default: Date.now }
   }],
   assignedAgents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
   closedAt: {
    type: Date,
    default: null
   }
},
{
    timestamps: true,
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;