const express = require('express');
const {
    createTypeDeDemande,
    getTypesDeDemande,
    getTypeDeDemandeById,
    updateTypeDeDemande,
    deleteTypeDeDemande,
    archiveTypeDeDemande
} = require('../controllers/typeDeDemandeController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes
router.post('/', protect, createTypeDeDemande);
router.get('/', protect, getTypesDeDemande);
router.get('/:id', protect, getTypeDeDemandeById);
router.put('/:id', protect, updateTypeDeDemande);
router.patch('/:id/archive', protect, archiveTypeDeDemande);

module.exports = router;
