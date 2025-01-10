const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');

router.post('/cities', cityController.createCity);
router.get('/cities', cityController.getCities);
router.get('/cities/:id', cityController.getCityById);
router.put('/cities/:id', cityController.updateCity);
router.delete('/cities/:id', cityController.deleteCity);
// Route pour récupérer les villes par ID de pays
router.get('/cities/:countryId/', cityController.getCitiesByCountryId);

module.exports = router;
