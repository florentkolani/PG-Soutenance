const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create main uploads directory and subdirectories if they don't exist
const uploadDir = 'uploads/';
const videosDir = path.join(uploadDir, 'videos');
const documentsDir = path.join(uploadDir, 'documents');

[uploadDir, videosDir, documentsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Storage configuration for documents
const documentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, documentsDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${path.basename(file.originalname, ext)}-${Date.now()}${ext}`);
    }
});

// Storage configuration for videos
const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, videosDir); // Changed to videosDir
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${path.basename(file.originalname, ext)}-${Date.now()}${ext}`);
    }
});

// File filters
const documentFilter = (req, file, cb) => {
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Type de fichier non autorisé'), false);
    }
};

const videoFilter = (req, file, cb) => {
    const allowedTypes = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Type de fichier vidéo non autorisé'), false);
    }
};

// Create upload middleware for documents
const documentUpload = multer({
    storage: documentStorage,
    fileFilter: documentFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB limit
    }
});

// Create upload middleware for videos with increased size limit
const videoUpload = multer({
    storage: videoStorage,
    fileFilter: videoFilter,
    limits: {
        fileSize: 1024 * 1024 * 500 // 500MB limit for videos
    }
});

module.exports = {
    documentUpload,
    videoUpload,
    uploadDir,
    videosDir,
    documentsDir
};
