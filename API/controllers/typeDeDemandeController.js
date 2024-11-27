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

exports.getTypesDeDemande = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;
  
      const types = await TypeDeDemande.find({ isArchived: false }) // Exclut les archivés
        .skip(skip)
        .limit(parseInt(limit));
  
      const totalItems = await TypeDeDemande.countDocuments({ isArchived: false }); // Compte uniquement les non-archivés
  
      res.status(200).json({
        types,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: parseInt(page),
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des types de demande :', error);
      res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
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

exports.archiveTypeDeDemande = async (req, res) => {
    try {
      const typeDeDemande = await TypeDeDemande.findById(req.params.id);
  
      if (!typeDeDemande) {
        return res.status(404).json({ message: 'Type de demande non trouvé' });
      }
  
      typeDeDemande.isArchived = true; // Marque comme archivé
      await typeDeDemande.save();
  
      res.status(200).json({ message: 'Type de demande archivé avec succès', typeDeDemande });
    } catch (error) {
      console.error('Erreur lors de l\'archivage du type de demande :', error);
      res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
    }
  };
  
