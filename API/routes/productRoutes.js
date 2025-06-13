const express = require('express');
const { createProduct, updateProduct, getProducts, getProductById, archiveProduct, unarchiveProduct } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.get('/', protect, getProducts);
router.get('/:id', protect, getProductById);
router.patch('/:id/archive', protect, archiveProduct);
router.patch('/:id/unarchive', protect, unarchiveProduct);

module.exports = router;
