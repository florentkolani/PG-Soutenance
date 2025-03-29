const express = require("express");
const { documentUpload } = require("../upload");
const { uploadPdf, getAllPdfs, downloadPdf, getTypesDeDemande, getProduits, updatePdf } = require("../controllers/pdfController");

const router = express.Router();

// Routes
router.post("/", documentUpload.single("pdf"), uploadPdf);
router.get("/", getAllPdfs);
router.get("/download/:filename", downloadPdf);
router.get("/types", getTypesDeDemande);
router.get("/products", getProduits);
router.put("/:id", documentUpload.single("pdf"), updatePdf);

module.exports = router;
