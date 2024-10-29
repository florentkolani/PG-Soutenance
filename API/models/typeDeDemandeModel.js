const mongoose = require('mongoose');

const typeDeDemandeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    isArchived: {
        type: Boolean,
        default: false,
    },
},
{
    timestamps: true,
});

const TypeDeDemande = mongoose.model('TypeDeDemande', typeDeDemandeSchema);

module.exports = TypeDeDemande;
