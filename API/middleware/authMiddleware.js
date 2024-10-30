const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
    let token;
    if (req.headers?.authorization?.startsWith('Bearer')) {
        try {
            // Extraction du token
            token = req.headers.authorization.split(' ')[1];

            // Vérification du token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Récupération de l'utilisateur correspondant au token
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401).json({ message: 'Non autorisé, token invalide' });
        }
    }

    // Si le token est manquant
    if (!token) {
        res.status(401).json({ message: 'Non autorisé, pas de token' });
    }
};

exports.protectAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next(); // L'utilisateur est un admin, passez à la route suivante
    } else {
        res.status(403).json({ message: 'Accès interdit, utilisateur non autorisé' });
    }
};
const restrictToRoles = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Accès interdit, utilisateur non autorisé' });
    }
    next();
};

module.exports = { protect, restrictToRoles };
