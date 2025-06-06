const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Admin', 'Client', 'AgentSupport'],
        default: 'Client',
    },
    pays: {
        type: String,
        required: true,
    },
    paysId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    },
    ville: {
        type: String,
        required: true,
    },
    villeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
        required: true
    },
    isArchived: {
        type: Boolean,
        default: false,
    },
    mustChangePassword:
    {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true,
});


// Middleware pour hacher le mot de passe avant de sauvegarder
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Méthode pour comparer les mots de passe
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
