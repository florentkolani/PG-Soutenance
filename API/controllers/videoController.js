const Video = require('../models/videoModel');
const path = require('path');
const fs = require('fs');
const Product = require('../models/productModel'); // Assuming you have a product model
const TypeDeDemande = require('../models/typeDeDemandeModel'); // Assuming you have a type de demande model
const { videosDir } = require('../upload');

exports.uploadVideo = async (req, res) => {
  try {
    console.log("Données reçues:", req.body);
    console.log("Fichier reçu:", req.file);

    const { title, comment, typededemande, produit, allowDownload } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier vidéo n'a été fourni" });
    }

    if (!title || !comment || !typededemande || !produit) {
      // Supprimer le fichier si les données sont invalides
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    const video = new Video({
      title,
      comment,
      url: `/uploads/videos/${req.file.filename}`,
      TypeDeDemande: typededemande,
      produit: produit,
      allowDownload: allowDownload === 'true' || allowDownload === true
    });

    await video.save();
    res.status(201).json(video);
  } catch (error) {
    console.error("Erreur lors de l'upload de la vidéo:", error);

    // Supprimer le fichier en cas d'erreur
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      message: 'Erreur lors de la publication de la vidéo',
      error: error.message
    });
  }
};

exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find().populate('TypeDeDemande').populate('produit');
    res.status(200).json(videos);
  } catch (error) {
    console.error("Erreur lors de la récupération des vidéos:", error);
    res.status(500).json({ message: 'Erreur lors de la récupération des vidéos', error: error.message });
  }
};

exports.downloadVideo = async (req, res) => {
  try {
    const { filename } = req.params;
    const decodedFilename = decodeURIComponent(filename);
    const filePath = path.join(__dirname, '..', 'uploads', 'videos', decodedFilename);

    // Vérifier si le fichier existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Fichier vidéo non trouvé" });
    }

    // Vérifier si le téléchargement est autorisé
    const video = await Video.findOne({ url: `/uploads/videos/${decodedFilename}` });
    if (!video || !video.allowDownload) {
      return res.status(403).json({ message: "Le téléchargement de cette vidéo n'est pas autorisé" });
    }

    // Configurer les headers pour le téléchargement
    res.setHeader('Content-Disposition', `attachment; filename="${video.title}.mp4"`);
    res.setHeader('Content-Type', 'video/mp4');

    // Stream le fichier
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('error', (error) => {
      console.error("Erreur lors du streaming du fichier:", error);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Erreur lors du streaming de la vidéo' });
      }
    });
  } catch (error) {
    console.error("Erreur lors du téléchargement:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Erreur lors du téléchargement de la vidéo', error: error.message });
    }
  }
};

// Add methods for fetching products and types of requests
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    res.status(500).json({ message: 'Erreur lors de la récupération des produits', error: error.message });
  }
};

exports.getTypes = async (req, res) => {
  try {
    const types = await TypeDeDemande.find();
    res.status(200).json({ types });
  } catch (error) {
    console.error("Erreur lors de la récupération des types:", error);
    res.status(500).json({ message: 'Erreur lors de la récupération des types de demande', error: error.message });
  }
};
// Mise à jour de la vidéo
exports.updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, comment, typededemande, produit, allowDownload } = req.body;
    
    // console.log('Received allowDownload value:', allowDownload);
    // console.log('Type of allowDownload:', typeof allowDownload);

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Vidéo non trouvée" });
    }

    // Mise à jour des champs texte
    video.title = title;
    video.comment = comment;
    video.TypeDeDemande = typededemande;
    video.produit = produit;
    video.allowDownload = allowDownload === 'true' || allowDownload === true;
    
    console.log('Updated allowDownload value:', video.allowDownload);

    // Gestion du fichier vidéo
    if (req.file) {
      // Récupérer le chemin complet de l'ancien fichier
      const oldVideoPath = path.join(__dirname, '..', video.url.replace('/uploads/videos/', '/uploads/videos/'));

      // Supprimer l'ancien fichier s'il existe
      try {
        if (fs.existsSync(oldVideoPath)) {
          fs.unlinkSync(oldVideoPath);
          console.log('Ancien fichier supprimé avec succès');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'ancien fichier:', error);
      }

      // Mettre à jour avec le nouveau fichier
      video.url = `/uploads/videos/${req.file.filename}`;
    }

    await video.save();
    const updatedVideo = await Video.findById(id)
      .populate('TypeDeDemande')
      .populate('produit');

    res.status(200).json(updatedVideo);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la vidéo:", error);
    // En cas d'erreur, supprimer le nouveau fichier s'il a été uploadé
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error('Erreur lors de la suppression du fichier temporaire:', err);
      }
    }
    res.status(500).json({
      message: 'Erreur lors de la mise à jour de la vidéo',
      error: error.message
    });
  }
};
