const express = require('express');
const router = express.Router();
const { login, register, changePassword, resetPassword, resetPasswordRequest } = require('../controllers/authController');

// Route pour la connexion
router.post('/login', login);

//Route pour l'enregistrement
router.post('/register', register);

router.post('/resetPasswordRequest', resetPasswordRequest);
router.post('/resetPassword', resetPassword);

//Route pour changement de mot de passe
router.post('/changePassword', changePassword);

// Ajoutez cette route pour gérer le lien de réinitialisation
router.get('/ForgotPassword', (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).send('Token manquant.');
    }
}
)

// Exporter le router
module.exports = router;
