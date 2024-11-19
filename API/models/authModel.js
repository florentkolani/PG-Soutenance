const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Admin', 'Client', 'AgentSupport'],
        default: 'Client',
    },
    mustChangePassword: {
        type: Boolean,
        default: true, // True par défaut pour exiger un changement de mot de passe à la première connexion
    },
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
