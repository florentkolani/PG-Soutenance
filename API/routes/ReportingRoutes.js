const express = require('express');
const router = express.Router();
const reportingController = require('../controllers/reportingController');

// Routes
router.get('/tickets-par-mois', reportingController.getTicketsParMois);
router.get('/satisfaction', reportingController.getSatisfactionGlobale);
router.get('/totaux', reportingController.getTotaux);
router.get('/types-de-demande', reportingController.getTotalTypesDeDemande);
router.get('/notes', reportingController.getTotalNotes);
router.get('/export', reportingController.exportData);

module.exports = router;
