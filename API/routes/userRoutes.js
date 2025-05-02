const express = require('express');
const {
  getUserProfile,
  getAllUsers,
  getUserById,
  getArchivedUsers,
  updateUser,
  archiveUser,
} = require('../controllers/userController');
const { getCitiesByCountryId } = require('../controllers/cityController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Routes spécifiques protégées
router.get('/profile', protect, getUserProfile);
router.get('/all', protect, getAllUsers);
router.get('/archived', protect, getArchivedUsers);

// Routes dynamiques protégées
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.put('/:id/archive', protect, archiveUser);

module.exports = router;
