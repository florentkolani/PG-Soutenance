const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { uploadPdf, getAllPdfs, downloadPdf } = require("../controllers/pdfController");

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
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Seuls les fichiers PDF sont autorisés"), false);
    }
  },
});

// Routes
router.post("/", upload.single("pdf"), uploadPdf);
router.get("/", getAllPdfs);
router.get("/download/:filename", downloadPdf);

module.exports = router;
