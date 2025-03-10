const Rating = require('../models/ratingModel');

// Attribuer une note à un ticket
exports.addRating = async (req, res) => {
    try {
        const existingRating = await Rating.findOne({ ticketId: req.body.ticketId });
        if (existingRating) {
            return res.status(400).json({ message: 'Le ticket est déjà noté' });
        }
        const rating = new Rating(req.body);
        await rating.save();
        res.status(201).json(rating);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de l\'ajout de la note', error });
    }
};

// Obtenir la note d'un ticket
exports.getRatingByTicket = async (req, res) => {
    try {
        const rating = await Rating.findOne({ ticketId: req.params.ticketId });
        if (!rating) {
            return res.status(404).json({ message: 'Note non trouvée pour ce ticket' });
        }
        res.status(200).json(rating);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de la note', error });
    }
};

//obténir tout les notes des tickets

exports.getAllRatings = async (req, res) => {
    try {
        const ratings = await Rating.find(); // Récupère toutes les notes
        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des notes', error });
    }
};


// vérifie si le ticket est déjà noté ou pas 
exports.ratingExists = async (req, res) => {
    try {
        const rating = await Rating.findOne({ ticketId: req.params.ticketId });
        if (rating) {
            return res.status(200).json({ exists: true });
        }
        res.status(200).json({ exists: false });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la vérification de la note', error });
    }
};