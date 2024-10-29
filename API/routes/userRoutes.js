const express = require('express');
const { registerUser, loginUser, getUserProfile, getAllUsers, getUserById, updateUser, archiveUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.get('/All', getAllUsers);
router.post('/', protect,  registerUser);
router.get('/:id', getUserById);
router.put('/:id', protect, updateUser);
router.put('/:id/archive', protect, archiveUser);

module.exports = router;
