const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getProducts, getAllRatings, getAllUsers, getTickets, getTypesDeDemande, getCountries } = require('../controllers/reportingController');

router.get('/products', protect, getProducts);
router.get('/ratings', protect, getAllRatings);
router.get('/users', protect, getAllUsers);
router.get('/tickets', protect, getTickets);
router.get('/Types', protect, getTypesDeDemande);
router.get('/countries', protect, getCountries);

module.exports = router;
