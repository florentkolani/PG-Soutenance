const Product = require('../models/productModel');

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
        const product = await Product.findByIdAndUpdate(req.params.id, { archived: true }, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.status(200).json({ message: 'Produit archivé avec succès', product });
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de l\'archivage du produit', error });
    }
};