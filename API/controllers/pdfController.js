// controllers/pdfController.js
const Pdf = require("../models/PdfModel");
const path = require("path");
const fs = require("fs");

exports.uploadPdf = async (req, res) => {
    console.log("Requête reçue :", req.file, req.body);
  try {
    const { comment } = req.body;
    const pdfFile = req.file;

    if (!pdfFile || !comment) {
      return res.status(400).json({ message: "Fichier PDF et commentaire requis" });
    }

    const pdfUrl = `/uploads/${pdfFile.filename}`;

    const newPdf = new Pdf({
      name: pdfFile.originalname,
      url: pdfUrl,
      comment,
    });

    await newPdf.save();
    res.status(201).json(newPdf);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'upload du PDF", error });
  }
};

exports.getAllPdfs = async (req, res) => {
  try {
    const pdfs = await Pdf.find();
    res.status(200).json(pdfs);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des PDFs", error });
  }
};
