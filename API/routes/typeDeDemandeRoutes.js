const express = require('express');
const {
    createTypeDeDemande,
    getAllTypesDeDemande,
    getTypeDeDemandeById,
    updateTypeDeDemande,
    deleteTypeDeDemande
} = require('../controllers/typeDeDemandeController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/', protect, createTypeDeDemande);
router.get('/', getAllTypesDeDemande);
router.get('/:id', getTypeDeDemandeById);
router.put('/:id', protect, updateTypeDeDemande);
router.delete('/:id', protect, deleteTypeDeDemande);

module.exports = router;
