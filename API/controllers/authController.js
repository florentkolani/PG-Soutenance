const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../services/emailService');

// Connexion d'un utilisateur
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Rechercher l'utilisateur par e-mail
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Comparer les mots de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mot de passe incorrect' });
        }

        // // Vérifier si l'utilisateur doit changer son mot de passe
        // if (user.mustChangePassword) {
        //     return res.status(403).json({ message: 'Vous devez changer votre mot de passe avant de continuer.' });
        // }

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


exports.changePassword = async (req, res) => {
    const { userId, newPassword } = req.body;

    try {
        // Vérifier la longueur du mot de passe
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères.' });
        }

        // Rechercher l'utilisateur
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Mettre à jour le mot de passe
        user.password = newPassword;
        user.mustChangePassword = false;
        await user.save();

        res.status(200).json({ message: 'Mot de passe changé avec succès.' });
    } catch (error) {
        console.error('Erreur lors du changement de mot de passe:', error);
        res.status(500).json({ message: 'Erreur de serveur' });
    }
};



// Enregistrement d'un nouvel utilisateur
exports.register = async (req, res) => {
    const { name, email, password, contact, role, pays, ville } = req.body;

    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Utilisateur déjà enregistré' });
        }

         // Vérifier la longueur du mot de passe
         if (password.length < 6) {
            return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères.' });
        }
        
        // Créer un nouvel utilisateur
        const user = new User({
            name, 
            email,
            pays,
            ville,
            password,
            contact,
            role: role || 'Client', 
        });

        // Sauvegarder l'utilisateur dans la base de données
        await user.save();

        // Envoyer un e-mail contenant les informations de connexion
        const emailSubject = 'Bienvenue chez NOVA LEAD';
        const emailContent = `Bonjour ${name},Votre compte a été créé avec succès.\n\n Voici vos informations de connexion :\n\n- Email : ${email} \n\n- Mot de passe : ${password}. \n\nVeuillez vous connecter pour accéder à votre tableau de bord.Cordialement. \n\nL'équipe de support`;

        await sendEmail(user.email, emailSubject, emailContent);

        console.log('Utilisateur enregistré:', user); 

        res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur de serveur' });
    }
};
