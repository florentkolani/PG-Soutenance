const express = require('express');
const router = express.Router();
const { login, register, changePassword} = require('../controllers/authController');

// Route pour la connexion
router.post('/login', login);

//Route pour l'enregistrement
router.post('/register', register);

//Route pour changement de mot de passe
router.post('/changePassword', changePassword);

// Exporter le router
module.exports = router;
