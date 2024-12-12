// routes/pdfRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const { uploadPdf, getAllPdfs } = require("../controllers/pdfController");

const router = express.Router();

// Configuration de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Routes
router.post("/", upload.single("pdf"), uploadPdf);
router.get("/", getAllPdfs);

module.exports = router;
