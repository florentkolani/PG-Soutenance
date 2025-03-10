const City = require('../models/City');
const mongoose = require('mongoose');

exports.createCity = async (req, res) => {
    try {
        const { name, country } = req.body;
        const city = new City({ name, country });
        await city.save();
        res.status(201).json(city);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getCities = async (req, res) => {
    try {
      const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc' } = req.query;
  
      // Options de tri
      const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
  
      // Récupérer les villes non archivées, triées et paginées
      const cities = await City.find({ isarchived: false })
        .populate('country') // Remplir les informations du pays associé
        .sort(sortOptions) // Appliquer le tri
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
  
      // Compter le nombre total de villes non archivées
      const totalItems = await City.countDocuments({ isarchived: false });
  
      // Renvoyer les résultats
      res.status(200).json({
        message: 'Villes récupérées avec succès',
        cities,
        totalItems,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalItems / limit),
      });
    } catch (error) {
      res.status(400).json({ message: 'Erreur lors de la récupération des villes', error: error.message });
    }
  };

exports.getCityById = async (req, res) => {
    try {
        const city = await City.findById(req.params.id).populate('country');
        if (!city) return res.status(404).json({ error: 'City not found' });
        res.status(200).json(city);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateCity = async (req, res) => {
    try {
        const { name, country } = req.body;
        const city = await City.findByIdAndUpdate(
            req.params.id,
            { name, country },
            { new: true }
        );
        if (!city) return res.status(404).json({ error: 'City not found' });
        res.status(200).json(city);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.archiveCity = async (req, res) => {
    try {
        const cityId = req.params.id;

        // Vérifiez si l'ID est valide
        if (!mongoose.Types.ObjectId.isValid(cityId)) {
            return res.status(400).json({ message: "ID de la ville invalide." });
        }

        // Vérifiez si la ville existe
        const city = await City.findById(cityId);
        if (!city) {
            return res.status(404).json({ message: "Ville non trouvée." });
        }

        // Archivez la ville
        city.isarchived = true;
        await city.save();

        res.status(200).json({ message: "Ville archivée avec succès", city });
    } catch (error) {
        console.error("Erreur lors de l'archivage de la ville :", error);
        res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
    }
};

exports.getCitiesByCountryId = async (req, res) => {
    try {
        const countryId = req.params.countryId;

        // Vérifier si l'ID du pays est un ObjectId valide
        if (!mongoose.Types.ObjectId.isValid(countryId)) {
            return res.status(400).json({ message: 'ID du pays invalide' });
        }

        console.log('Recherche de villes pour le pays avec ID:', countryId);

        // Convertir countryId en ObjectId et rechercher les villes qui correspondent
        const cities = await City.find({ country: mongoose.Types.ObjectId(countryId) });

        console.log('Villes trouvées:', cities); // Afficher les villes trouvées pour le debug

        // Vérifier si des villes sont trouvées
        if (!cities.length) {
            return res.status(404).json({ message: 'Aucune ville trouvée pour ce pays' });
        }

        // Réponse avec les villes trouvées
        res.json({ cities });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des villes', error });
    }
};