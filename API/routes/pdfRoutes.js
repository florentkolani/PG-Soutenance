const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { uploadPdf, getAllPdfs, downloadPdf, getTypesDeDemande, getProduits, updatePdf } = require("../controllers/pdfController");

const router = express.Router();

// Vérification et création du dossier "uploads" si nécessaire
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuration de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Sauvegarde les fichiers dans le dossier "uploads"
    cb(null, uploadsDir); 
  },
  filename: (req, file, cb) => {
    // Ajoute un horodatage pour éviter les doublons
    cb(null, `${Date.now()}-${file.originalname}`); 
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Seuls les fichiers PDF, Word et PowerPoint sont autorisés"), false);
    }
  },
});

// Routes
router.post("/", upload.single("pdf"), uploadPdf);
router.get("/", getAllPdfs);
router.get("/download/:filename", downloadPdf);
router.get("/typesDeDemande", getTypesDeDemande);
router.get("/produits", getProduits);
router.put("/:id", upload.single("pdf"), updatePdf);

module.exports = router;
