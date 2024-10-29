const Rating = require('../models/ratingModel');

// Attribuer une note à un ticket
exports.addRating = async (req, res) => {
    try {
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
