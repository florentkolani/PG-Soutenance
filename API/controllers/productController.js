const Product = require('../models/productModel');
const mongoose = require('mongoose');

// Créer un produit
exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création du produit', error });
    }
};

// Mettre à jour un produit
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la mise à jour du produit', error });
    }
};

// Obtenir tous les produits avec pagination
exports.getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const products = await Product.find()
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalProducts = await Product.countDocuments();
        const totalPages = Math.ceil(totalProducts / limit);

        res.status(200).json({
            products,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalProducts,
                pageSize: parseInt(limit),
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des produits', error });
    }
};

exports.getProducts = async (req, res) => {
    try {
      const products = await Product.find({ isArchived: false }); // Exclut les produits archivés
      res.status(200).json(products);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
      res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
    }
  };
  


// Obtenir un produit par ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du produit', error });
    }
};
// Archiver un produit
exports.archiveProduct = async (req, res) => {
    try {
      const productId = req.params.id;
  
      // Vérifiez si l'ID est valide
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "ID produit invalide." });
      }
  
      // Vérifiez si le produit existe
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Produit non trouvé." });
      }
  
      // Archivez le produit
      product.isArchived = true;
      await product.save();
  
      res.status(200).json({ message: "Produit archivé avec succès", product });
    } catch (error) {
      console.error("Erreur lors de l'archivage du produit :", error);
      res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
    }
  };
  