const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/uploads', upload.single('video'), videoController.uploadVideo);
router.get('/uploads', videoController.getVideos);
router.get('/uploads/download/:filename', videoController.downloadVideo);

// Add routes for fetching products and types of requests
router.get('/products', videoController.getProducts);
router.get('/types', videoController.getTypes);

module.exports = router;
