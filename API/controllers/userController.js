const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Générer un token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Inscription
exports.registerUser = async (req, res) => {
    const { name, email, password, contact, role } = req.body;

    try {
        // Vérifier si l'utilisateur existe déjà
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
        }

        // Créer un nouvel utilisateur
        const user = new User({ name, email, password, contact, role });
        await user.save();

        // Répondre avec le token et les infos utilisateur
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de l\'inscription', error });
    }
};

// Connexion
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        // Vérifier l'utilisateur et le mot de passe
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Identifiants invalides' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion', error });
    }
};

// Obtenir les infos utilisateur (route protégée)
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            contact: user.contact,
            lastLogin: user.lastLogin
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du profil utilisateur', error });
    }
};

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
    console.log('getAllUsers called');
    try {
        const users = await User.find(); // Récupérer tous les utilisateurs
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error });
    }
};
// get user byId
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur', error: error.message });
    }
}
// update user
// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
    const { name, email, password, contact, role } = req.body;

    try {
        // Vérifier si l'utilisateur existe
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Mettre à jour les informations de l'utilisateur
        user.name = name || user.name;
        user.email = email || user.email;
        user.contact = contact || user.contact;
        user.role = role || user.role;

        // Si un nouveau mot de passe est fourni, le hacher et l'appliquer
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur', error });
    }
};

// archive user
// Archiver un utilisateur
exports.archiveUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Archiver l'utilisateur
        user.isArchived = true; // Assurez-vous d'avoir un champ isArchived dans votre modèle
        await user.save();

        res.json({ message: 'Utilisateur archivé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'archivage de l\'utilisateur', error });
    }
};

