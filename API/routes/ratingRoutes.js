const express = require('express');
const { addRating, getRatingByTicket } = require('../controllers/ratingController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
const ratingController = require("../controllers/ratingController")

router.post('/', protect, addRating);
router.get('/ticket/:ticketId', protect, getRatingByTicket);
router.get('/ratings/:ticketId', ratingController.getRatingByTicket);
router.get('/ratings/:ticketId', ratingController.ratingExists);

module.exports = router;
