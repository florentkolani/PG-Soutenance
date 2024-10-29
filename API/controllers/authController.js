const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Connexion d'un utilisateur
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Rechercher l'utilisateur par e-mail
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Afficher les informations de l'utilisateur
        console.log('Mot de passe fourni:', password);
        console.log('Mot de passe haché dans la base:', user.password);

        // Comparer les mots de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mot de passe incorrect' });
        }

        // Générer un jeton JWT
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Redirection selon le rôle de l'utilisateur
        if (user.role === 'Admin') {
            return res.json({ message: 'Bienvenue Admin', token });
        } else if (user.role === 'Client') {
            return res.json({ message: 'Bienvenue Client', token });
        } else if (user.role === 'AgentSupport') {
            return res.json({ message: 'Bienvenue Agent de Support', token });
        }
    } catch (error) {
        console.error('Erreur de serveur lors de la connexion:', error);
        res.status(500).json({ message: 'Erreur de serveur' });
    }
};


// Enregistrement d'un nouvel utilisateur
exports.register = async (req, res) => {
    const { name, email, password, contact, role } = req.body;

    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Utilisateur déjà enregistré' });
        }


        // Créer un nouvel utilisateur
        const user = new User({
            name, 
            email,
            password,
            contact,
            role: role || 'Client', 
        });

        // Sauvegarder l'utilisateur dans la base de données
        await user.save();
        console.log('Utilisateur enregistré:', user); 

        res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur de serveur' });
    }
};
