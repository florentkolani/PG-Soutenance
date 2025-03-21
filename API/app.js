const express = require('express');
const path = require('path');
// ... autres imports

const app = express();

// ... autres middlewares

// Ajoutez cette ligne pour servir les fichiers statiques du dossier uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ... reste de la configuration 