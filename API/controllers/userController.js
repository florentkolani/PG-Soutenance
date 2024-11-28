const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// Générer un token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Inscription
exports.registerUser = async (req, res) => {
    const { name, email, password, contact, role, pays, ville } = req.body;

    try {
        // Vérifier si l'utilisateur existe déjà
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
        }

        // Créer un nouvel utilisateur
        const user = new User({ name, email, password, contact, role, pays, ville });
        await user.save();

        // Répondre avec le token et les infos utilisateur
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pays: user.pays,
            ville: user.ville,
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
                pays: user.pays,
                ville: user.ville,
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
            pays: user.pays,
            ville: user.ville,
            role: user.role,
            contact: user.contact,
            lastLogin: user.lastLogin
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du profil utilisateur', error });
    }
};

// Récupérer tous les utilisateurs non archivés avec pagination
exports.getAllUsers = async (req, res) => {
    // console.log('getAllUsers called');

    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10;

    try {
        
        const skip = (page - 1) * limit;

        const users = await User.find({ isArchived: false }).skip(skip).limit(limit);

        const totalUsers = await User.countDocuments({ isArchived: false });
        res.json({
            data: users,
            totalItems: totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page
        });
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
// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
    const { name, email, password, contact, role, pays, ville } = req.body;

    try {
        // Vérifier si l'utilisateur existe
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Mettre à jour les informations de l'utilisateur
        user.name = name || user.name;
        user.email = email || user.email;
        user.pays = pays || user.pays;
        user.ville = ville || user.ville;
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
            pays: updatedUser.pays,
            ville: updatedUser.ville,
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

// Récupérer tous les utilisateurs archivés avec pagination
exports.getArchivedUsers = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
  
    try {
      const archivedUsers = await User.find({ isArchived: true })
        .skip((page - 1) * limit)
        .limit(Number(limit));
  
      const totalItems = await User.countDocuments({ isArchived: true });
  
      res.status(200).json({
        data: archivedUsers,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: Number(page),
      });
    } catch (error) {
      console.error('Error fetching archived users:', error);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  };
  