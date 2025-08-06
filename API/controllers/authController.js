const User = require('../models/userModel');
const Country = require('../models/Country');
const City = require('../models/City');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
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
        const token = jwt.sign({ id: user._id, role: user.role, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1d' });
        // Vérifier si c'est la première connexion
        const mustChangePassword = user.mustChangePassword || false;

        // Redirection selon le rôle de l'utilisateur
        if (user.role === 'Admin') {
            return res.json({ message: 'Bienvenue Admin', token, mustChangePassword });
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
    const { name, email, contact, role, pays, ville, paysId, villeId } = req.body;

    try {
        // Validation des ObjectIds
        if (!mongoose.Types.ObjectId.isValid(paysId)) {
            return res.status(400).json({ message: 'ID de pays invalide' });
        }
        if (!mongoose.Types.ObjectId.isValid(villeId)) {
            return res.status(400).json({ message: 'ID de ville invalide' });
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Utilisateur déjà enregistré' });
        }

        // Vérifier si le pays et la ville existent
        const countryExists = await Country.findById(paysId);
        const cityExists = await City.findById(villeId);

        if (!countryExists) {
            return res.status(400).json({ message: 'Pays invalide ou non trouvé' });
        }
        if (!cityExists) {
            return res.status(400).json({ message: 'Ville invalide ou non trouvée' });
        }

        // Vérifier que la ville appartient bien au pays
        if (cityExists.country.toString() !== paysId) {
            return res.status(400).json({ message: 'La ville sélectionnée n\'appartient pas au pays sélectionné' });
        }

        // Vérifier la longueur du numéro de téléphone
        if (contact.length !== countryExists.phoneLength) {
            return res.status(400).json({ 
                message: `Le numéro de téléphone doit comporter exactement ${countryExists.phoneLength} chiffres` 
            });
        }

        // Générer un mot de passe aléatoire
        const randomPassword = generateRandomPassword(8);

        // Créer un nouvel utilisateur
        const user = new User({
            name,
            email,
            pays,
            ville,
            password: randomPassword,
            contact,
            role: role || 'Client',
            paysId,
            villeId,
        });

        // Sauvegarder l'utilisateur dans la base de données
        await user.save();

        const emailSubject = "Bienvenue sur notre plateforme d'assistance";
        const emailContent = `
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                <p>Bonjour Cher partenaire ${name},</p>

                <p>Nous sommes ravis de vous accueillir sur la plateforme d'assistance de NOVA LEAD. Votre compte a été créé avec succès !</p>

                <p><strong>Voici vos informations de connexion :</strong></p>
                <ul>
                    <li><strong>Identifiant :</strong> ${email}</li>
                    <li><strong>Mot de passe temporaire :</strong> ${randomPassword}</li>
                </ul>

                <p>Lors de votre première connexion, nous vous demandons de modifier votre mot de passe pour garantir la sécurité de votre compte.</p>

                <p><strong>Comment accéder à la plateforme ?</strong></p>
                <ul>
                    <li>
                    <a href="${process.env.FRONTEND_URL}/login" 
                    style="color: #3498db; text-decoration: none; font-weight: bold;">
                    ➡️ Accéder à la plateforme
                    </a>
                </li>
                    <li>Connectez-vous avec vos identifiants fournis ci-dessus.</li>
                    <li>Suivez les instructions pour changer votre mot de passe.</li>
                    <li>Commencez à soumettre et suivre vos demandes d'assistance.</li>
                </ul>

                <p>Désormais, toutes vos requêtes seront centralisées sur cette plateforme afin de vous offrir un service plus efficace et un meilleur suivi de vos demandes.</p>

                <p>Nous vous remercions de votre confiance et restons à votre disposition pour toute question ou assistance supplémentaire.</p>

                <p style="margin-top: 20px;">Cordialement,</p>
                <p style="margin-top: 5px;">L'équipe de support NOVA LEAD</p>
            </body>
        </html>
        `;
        // Envoyer un email de bienvenue
        await sendEmail(user.email, emailSubject, emailContent);

        console.log('Utilisateur enregistré:', user);

        res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: 'Données invalides',
                error: 'Un ou plusieurs identifiants sont invalides'
            });
        }
        res.status(500).json({
            message: 'Erreur de serveur',
            error: error.message
        });
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

        // Générer un nouveau mot de passe aléatoire
        const newPassword = generateRandomPassword(8);

        // Mettre à jour le mot de passe de l'utilisateur
        user.password = newPassword;
        user.mustChangePassword = true; // Forcer le changement de mot de passe à la prochaine connexion
        await user.save();

        // Contenu de l'email
        const emailSubject = 'Nouveau mot de passe temporaire';
        const emailContent = `
<html>
  <body class="font-sans bg-gray-50">
    <div class="max-w-2xl mx-auto p-6 bg-white shadow-sm">

      <!-- Content -->
      <div class="py-6">
        <p class="text-gray-700 mb-4">Bonjour ${user.name},</p>
        
        <p class="text-gray-700 mb-6">Suite à votre demande de réinitialisation, nous avons généré un nouveau mot de passe temporaire pour votre compte.</p>
        
        <!-- Password box -->
        <div class="bg-gray-50 border border-dashed border-gray-300 p-4 my-6 text-center rounded">
          <p class="text-gray-600 text-sm mb-1">Votre mot de passe temporaire :</p>
          <p class="text-xl font-bold text-gray-800"> <strong>${newPassword}</strong></p>
        </div>
        
        <p class="text-gray-700 mb-6"><strong class="font-semibold">Pour votre sécurité</strong>, vous serez invité à changer ce mot de passe lors de votre prochaine connexion.</p>
        
        <!-- Button -->
        <div class="text-center my-8">
          <a href="${process.env.FRONTEND_URL}/login" 
                        style="color: #3498db; text-decoration: none; font-weight: bold;">
                        ➡️ Accéder à la plateforme
                        </a>
        </div>
        
        <p class="text-gray-700 text-sm">Si vous n'êtes pas à l'origine de cette demande, veuillez contacter immédiatement notre support.</p>
      </div>

      <!-- Signature -->
      <div class="mt-8 text-right italic">
        <p class="text-gray-700">Cordialement,</p>
        <p class="text-gray-700">L'équipe de support NOVA LEAD</p>
      </div>
    </div>
  </body>
</html>
`;
        // Envoyer l'email
        await sendEmail(user.email, emailSubject, emailContent);

        res.status(200).json({ message: 'Un nouveau mot de passe a été envoyé à votre adresse email.' });
    } catch (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe:', error);
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
