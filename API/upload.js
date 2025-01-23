const multer = require('multer');
const path = require('path');

// Vérifie que le dossier existe et crée-le s'il n'existe pas
const fs = require('fs');
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Stockage dans le répertoire 'uploads/'
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Extension du fichier
        cb(null, `${path.basename(file.originalname, ext)}-${Date.now()}${ext}`); // Génère un nom unique
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true); // Autorise les types de fichiers valides
    } else {
        cb(new Error('Type de fichier non autorisé'), false); // Bloque les types non autorisés
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // Limite de 5 Mo
    }
});

module.exports = upload;
