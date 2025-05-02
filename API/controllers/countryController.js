const Country = require('../models/Country');
const mongoose = require('mongoose');

exports.createCountry = async (req, res) => {
    try {
        const { name, code } = req.body;
        const country = new Country({ name, code });
        await country.save();
        res.status(201).json({ message: 'Pays créé avec succès', country });
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création du pays', error: error.message });
    }
};

exports.getCountries = async (req, res) => {
    try {
        const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc' } = req.query;

        // Options de tri
        const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

        // Récupérer les pays non archivés, triés et paginés
        const countries = await Country.find({ isarchived: false })
            .sort(sortOptions) // Appliquer le tri
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Compter le nombre total de pays non archivés
        const totalItems = await Country.countDocuments({ isarchived: false });

        // Renvoyer les résultats
        res.status(200).json({
            message: 'Pays récupérés avec succès',
            countries,
            totalItems,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalItems / limit),
        });
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la récupération des pays', error: error.message });
    }
};

exports.getCountryById = async (req, res) => {
    try {
        const country = await Country.findById(req.params.id);
        if (!country) return res.status(404).json({ message: 'Pays non trouvé' });
        res.status(200).json({ message: 'Pays récupéré avec succès', country });
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la récupération du pays', error: error.message });
    }
};

exports.updateCountry = async (req, res) => {
    try {
        const { name, code } = req.body;
        const country = await Country.findByIdAndUpdate(
            req.params.id,
            { name, code },
            { new: true }
        );
        if (!country) return res.status(404).json({ message: 'Pays non trouvé' });
        res.status(200).json({ message: 'Pays mis à jour avec succès', country });
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la mise à jour du pays', error: error.message });
    }
};

exports.archiveCountry = async (req, res) => {
    try {
        const countryId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(countryId)) {
            return res.status(400).json({ message: "ID du pays invalide." });
        }
        const country = await Country.findById(countryId);
        if (!country) {
            return res.status(404).json({ message: "Pays non trouvé." });
        }
        country.isarchived = true;
        await country.save();
        res.status(200).json({ message: "Pays archivé avec succès", country });
    } catch (error) {
        console.error("Erreur lors de l'archivage du pays :", error);
        res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
    }
};
