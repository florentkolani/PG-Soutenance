const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');

// Route pour la connexion
router.post('/login', login);

//Route pour l'enregistrement
router.post('/register', register);

// Exporter le router
module.exports = router;
