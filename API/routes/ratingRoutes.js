const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
const ratingController = require("../controllers/ratingController")

router.post('/', protect, ratingController.addRating);

router.get('/ratings/:ticketId', ratingController.getRatingByTicket);
router.get('/', protect, ratingController.getAllRatings);

router.get('/ratings/:ticketId', ratingController.ratingExists);

module.exports = router;
