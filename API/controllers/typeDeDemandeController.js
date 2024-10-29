const TypeDeDemande = require('../models/typeDeDemandeModel');

// Créer un nouveau type de demande
exports.createTypeDeDemande = async (req, res) => {
    const { name, description } = req.body;

    try {
        const typeDeDemande = new TypeDeDemande({ name, description });
        await typeDeDemande.save();
        res.status(201).json({ message: 'Type de demande créé avec succès', typeDeDemande });
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création du type de demande', error });
    }
};

// Obtenir tous les types de demande
exports.getAllTypesDeDemande = async (req, res) => {
    try {
        const typesDeDemande = await TypeDeDemande.find();
        res.status(200).json(typesDeDemande);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des types de demande', error });
    }
};

// Obtenir un type de demande par son ID
exports.getTypeDeDemandeById = async (req, res) => {
    try {
        const typeDeDemande = await TypeDeDemande.findById(req.params.id);
        if (!typeDeDemande) {
            return res.status(404).json({ message: 'Type de demande non trouvé' });
        }
        res.status(200).json(typeDeDemande);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du type de demande', error });
    }
};

// Mettre à jour un type de demande
exports.updateTypeDeDemande = async (req, res) => {
    const { name, description } = req.body;

    try {
        const typeDeDemande = await TypeDeDemande.findById(req.params.id);

        if (!typeDeDemande) {
            return res.status(404).json({ message: 'Type de demande non trouvé' });
        }

        typeDeDemande.name = name || typeDeDemande.name;
        typeDeDemande.description = description || typeDeDemande.description;

        const updatedTypeDeDemande = await typeDeDemande.save();
        res.status(200).json({ message: 'Type de demande mis à jour avec succès', updatedTypeDeDemande });
    } catch (error) {
      
        res.status(500).json({ message: 'Erreur lors de la mise à jour du type de demande', error });
    }
};

// Supprimer un type de demande
exports.deleteTypeDeDemande = async (req, res) => {
    try {
        const typeDeDemande = await TypeDeDemande.findByIdAndDelete(req.params.id);

        if (!typeDeDemande) {
            return res.status(404).json({ message: 'Type de demande non trouvé' });
        }

        res.status(200).json({ message: 'Type de demande supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du type de demande', error: error.message });
    }
};

