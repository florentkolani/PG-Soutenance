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

        // Générer un jeton JWT
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        // Vérifier si c'est la première connexion
        const mustChangePassword = user.mustChangePassword || false;

        // Redirection selon le rôle de l'utilisateur
        if (user.role === 'Admin') {
            return res.json({ message: 'Bienvenue Admin', token, mustChangePassword});
        } else if (user.role === 'Client') {
            return res.json({ message: 'Bienvenue Client', token, mustChangePassword });
        } else if (user.role === 'AgentSupport') {
            return res.json({ message: 'Bienvenue Agent de Support', token, mustChangePassword });
        }
    } catch (error) {
        console.error('Erreur de serveur lors de la connexion:', error);
        res.status(500).json({ message: 'Erreur de serveur' });
    }
};


exports.changePassword = async (req, res) => {
    const { newPassword } = req.body;
    const token = req.headers.authorization?.split(' ')[1]; // Extraire le token de l'en-tête Authorization

    if (!token) {
        return res.status(401).json({ message: 'Accès non autorisé. Token manquant.' });
    }

    try {
        // Vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Extraire l'ID de l'utilisateur depuis le token décodé
        const userId = decoded.id;

        // Vérifier la longueur du mot de passe
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères.' });
        }

        // Rechercher l'utilisateur par ID
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

// Fonction pour générer un mot de passe aléatoire
function generateRandomPassword(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters.charAt(randomIndex);
    }
    return password;
  }
  

// Enregistrement d'un nouvel utilisateur
exports.register = async (req, res) => {
    const { name, email, password, contact, role, pays, ville } = req.body;

    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Utilisateur déjà enregistré' });
        }

        // Générer un mot de passe aléatoire
        const randomPassword = generateRandomPassword(8);

        //  // Vérifier la longueur du mot de passe
        //  if (password.length < 6) {
        //     return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères.' });
        // }
        
        // Créer un nouvel utilisateur
        const user = new User({
            name, 
            email,
            pays,
            ville,
            password:randomPassword,
            contact,
            role: role || 'Client', 
        });

        // Sauvegarder l'utilisateur dans la base de données
        await user.save();

        // Envoyer un e-mail contenant les informations de connexion
        const emailSubject = 'Bienvenue chez NOVA LEAD';
        const emailContent = `
        <html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <p>Bonjour ${name},</p>
    <p>Nous avons le plaisir de vous informer que votre compte utilisateur a été créé avec succès sur notre plateforme d'assistance en ligne de, <strong>NOVA LEAD</strong>.</p>
    <p>Voici vos informations de connexion :</p>
    <ul>
      <li><strong>Email</strong> : ${email}</li>
      <li><strong>Mot de passe</strong> : ${randomPassword}</li>
    </ul>
    <p>Nous vous recommandons de vous connecter dès maintenant pour personnaliser votre mot de passe et accéder à votre tableau de bord. Sur votre tableau de bord, vous pourrez :</p>
    <ul>
      <li>Créer et gérer vos tickets d'assistance.</li>
      <li>Suivre l'état de vos demandes en temps réel.</li>
      <li>Communiquer avec notre équipe d'assistance.</li>
    </ul>
    <p>Pour accéder à la plateforme, cliquez sur le lien ci-dessous :</p>
    <p>
      <a href="https://www.novalead-support.com/login" style="color: #3498db; text-decoration: none;">Accéder à votre compte</a>
    </p>
    <p>Si vous avez des questions ou si vous avez besoin d'aide, n'hésitez pas à nous contacter. Nous sommes là pour vous aider.</p>
    <p style="text-align: right; margin-top: 20px;">Cordialement,</p>
    <p style="text-align: right;">L'équipe de support NOVA LEAD</p>
  </body>
</html>

      `;

        await sendEmail(user.email, emailSubject, emailContent);

        console.log('Utilisateur enregistré:', user); 

        res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur de serveur' });
    }
};

exports.resetPasswordRequest = async (req, res) => {
    const { email } = req.body;

    try {
        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Aucun utilisateur trouvé avec cet email.' });
        }

        // Générer un jeton pour la réinitialisation de mot de passe
        const resetToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Jeton valide pendant 1 heure
        );

        // Construire le lien de réinitialisation
        const resetLink = `http://localhost:5000/api/auth/ForgotPassword?token=${resetToken}`;

        // Contenu de l'email
        const emailSubject = 'Réinitialisation de votre mot de passe';
        const emailContent = `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <p>Bonjour ${user.name},</p>
            <p>Nous avons reçu une demande de réinitialisation de votre mot de passe.</p>
            <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
            <p><a href="${resetLink}" style="color: blue; text-decoration: underline;">Réinitialiser mon mot de passe</a></p>
            <p>Ce lien est valide pendant 1 heure.</p>
            <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
            <p style="text-align: right; margin-top: 20px;">Cordialement,</p>
            <p style="text-align: right;">L'équipe de support</p>
          </body>
        </html>
        `;

        // Envoyer l'email
        await sendEmail(user.email, emailSubject, emailContent);

        res.status(200).json({ message: 'Email de réinitialisation envoyé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la demande de réinitialisation de mot de passe:', error);
        res.status(500).json({ message: 'Erreur de serveur' });
    }
};

exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Vérifier la longueur du nouveau mot de passe
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères.' });
        }

        // Rechercher l'utilisateur par ID
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Mettre à jour le mot de passe
        user.password = newPassword;
        user.mustChangePassword = false; // Réinitialisation effectuée
        await user.save();

        res.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: 'Le lien de réinitialisation a expiré.' });
        }
        console.error('Erreur lors de la réinitialisation du mot de passe:', error);
        res.status(500).json({ message: 'Erreur de serveur' });
    }
};
 