const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { videoUpload } = require('../upload');

router.post('/uploads', videoUpload.single('video'), videoController.uploadVideo);
router.get('/uploads', videoController.getVideos);
router.get('/uploads/download/:filename', videoController.downloadVideo);
// Nouvelle route pour la mise à jour
router.put('/uploads/:id', videoUpload.single('video'), videoController.updateVideo);


// Add routes for fetching products and types of requests
router.get('/products', videoController.getProducts);
router.get('/types', videoController.getTypes);

module.exports = router;
