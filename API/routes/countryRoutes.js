const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');

router.post('/countries', countryController.createCountry);
router.get('/countries', countryController.getCountries);
router.get('/countries/:id', countryController.getCountryById);
router.put('/countries/:id', countryController.updateCountry);
router.put('/countries/:id/archive', countryController.archiveCountry);

module.exports = router;
