const Product = require('../models/productModel');
const mongoose = require('mongoose');
const Rating = require('../models/ratingModel');
const User = require('../models/userModel');
const Ticket = require('../models/ticketModel');
const TypeDeDemande = require('../models/typeDeDemandeModel');
const Country = require('../models/Country');

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

//obténir tout les notes des tickets

exports.getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.find()
      .populate({
        path: 'ticketId',
        select: 'NumeroTicket userId createdAt closedAt',
        populate: {
          path: 'userId',
          select: 'name'
        }
      })
      .lean(); // Utilisation de lean() pour de meilleures performances

    // Vérification et nettoyage des données
    const cleanedRatings = ratings.map(rating => {
      if (!rating.ticketId) {
        // Si le ticket n'existe pas, on met des valeurs par défaut
        return {
          ...rating,
          ticketId: {
            NumeroTicket: 'Ticket supprimé',
            userId: {
              name: 'Utilisateur inconnu'
            }
          }
        };
      }
      return rating;
    });

    res.status(200).json(cleanedRatings);
  } catch (error) {
    console.error('Erreur dans getAllRatings:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des notes', 
      error: error.message 
    });
  }
};

// Récupérer tous les utilisateurs non archivés avec pagination
exports.getAllUsers = async (req, res) => {
  // console.log('getAllUsers called');

  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 10;

  try {
      
      const skip = (page - 1) * limit;

      const users = await User.find({ isArchived: false }).skip(skip).limit(limit);

      const totalUsers = await User.countDocuments({ isArchived: false });
      res.json({
          data: users,
          totalItems: totalUsers,
          totalPages: Math.ceil(totalUsers / limit),
          currentPage: page
      });
  } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error });
  }
};

// Obtenir tous les tickets avec pagination
exports.getTickets = async (req, res) => {
  try {
      const filter = req.user.role === 'Client' ? { userId: req.user._id } : {};
      // Récupération des paramètres de pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Compter le nombre total de tickets correspondant au filtre
      const total = await Ticket.countDocuments(filter);

      // Récupérer les tickets avec pagination
      const tickets = await Ticket.find(filter)
          .select('NumeroTicket userId productId typeDeDemandeId statut createdAt closedAt')
          .populate('userId productId typeDeDemandeId')
          .skip(skip)
          .limit(limit);

      // Retourner les tickets et le total
      res.status(200).json({
          tickets,
          total, // Retourner le total pour la pagination
      });
  } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des tickets', error: error.message });
  }
};

// Obtenir tous les types de demande avec pagination
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

// ... existing code ...

exports.getCountries = async (req, res) => {
  try {
    const { sortBy = 'name', sortOrder = 'asc' } = req.query;

    // Options de tri
    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    // Récupérer tous les pays non archivés et triés
    const countries = await Country.find({ isarchived: false })
      .sort(sortOptions);

    // Renvoyer les résultats
    res.status(200).json({
      message: 'Pays récupérés avec succès',
      countries,
      totalItems: countries.length
    });
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la récupération des pays', error: error.message });
  }
};

