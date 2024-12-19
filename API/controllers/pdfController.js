const Pdf = require("../models/PdfModel");
const path = require("path");
const fs = require("fs");

// Contrôleur pour l'upload de PDF
exports.uploadPdf = async (req, res) => {
  console.log("Requête reçue :", req.file, req.body);

  try {
    const { comment } = req.body;
    const pdfFile = req.file;

    // Vérification des données requises
    if (!pdfFile || !comment) {
      return res.status(400).json({ message: "Fichier PDF et commentaire requis" });
    }

    // Validation du type de fichier
    if (pdfFile.mimetype !== "application/pdf") {
      fs.unlinkSync(pdfFile.path); // Suppression du fichier non valide
      return res.status(400).json({ message: "Seuls les fichiers PDF sont autorisés" });
    }

    const pdfUrl = `/uploads/${pdfFile.filename}`; // Chemin du fichier dans le serveur

    // Création et sauvegarde dans la base de données
    const newPdf = new Pdf({
      name: pdfFile.originalname,
      url: pdfUrl,
      comment,
    });

    await newPdf.save();
    res.status(201).json(newPdf);
  } catch (error) {
    console.error("Erreur lors de l'upload du PDF :", error);

    // Suppression du fichier en cas d'erreur
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ message: "Erreur lors de l'upload du PDF", error });
  }
};

// Contrôleur pour récupérer tous les PDFs
exports.getAllPdfs = async (req, res) => {
  try {
    const pdfs = await Pdf.find();
    res.status(200).json(pdfs);
  } catch (error) {
    console.error("Erreur lors de la récupération des PDFs :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des PDFs", error });
  }
};

// Contrôleur pour télécharger un fichier PDF
exports.downloadPdf = async (req, res) => {
  try {
    const { filename } = req.params;
    const decodedFilename = decodeURIComponent(filename); // Décodage pour gérer les espaces et caractères spéciaux
    const filePath = path.join(__dirname, "../uploads", decodedFilename); // Construction du chemin complet

    // Vérification de l'existence du fichier
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Fichier non trouvé" });
    }

    // Envoi du fichier
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${decodedFilename}"`);
    res.sendFile(filePath);
  } catch (error) {
    console.error("Erreur lors du téléchargement du PDF :", error);
    res.status(500).json({ message: "Erreur interne lors du téléchargement du fichier", error });
  }
};
