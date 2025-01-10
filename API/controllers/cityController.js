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
        const { page = 1, limit = 10 } = req.query;
        const cities = await City.find()
            .populate('country')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        const totalItems = await City.countDocuments();
        res.status(200).json({ cities, totalItems });
    } catch (error) {
        res.status(400).json({ error: error.message });
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

exports.deleteCity = async (req, res) => {
    try {
        const city = await City.findByIdAndDelete(req.params.id);
        if (!city) return res.status(404).json({ error: 'City not found' });
        res.status(200).json({ message: 'City deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
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