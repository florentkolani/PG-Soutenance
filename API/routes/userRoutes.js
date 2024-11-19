// const express = require('express');
// const { registerUser, loginUser, getUserProfile, getAllUsers, getUserById, getArchivedUsers, updateUser, archiveUser } = require('../controllers/userController');
// const { protect } = require('../middleware/authMiddleware');
// const router = express.Router();

// router.post('/register', registerUser);
// router.post('/login', loginUser);
// router.get('/profile', protect, getUserProfile);
// router.get('/All', getAllUsers);
// router.post('/', protect,  registerUser);
// router.get('/:id', getUserById);
// router.put('/:id', protect, updateUser);
// router.put('/:id/archive', protect, archiveUser);
// module.exports = router;

const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  getUserById,
  getArchivedUsers,
  updateUser,
  archiveUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Routes publiques
router.post('/register', registerUser);
router.post('/login', loginUser);

// Routes spécifiques protégées
router.get('/profile', protect, getUserProfile);
router.get('/all', protect, getAllUsers);
router.get('/archived', protect, getArchivedUsers);

// Routes dynamiques protégées
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.put('/:id/archive', protect, archiveUser);

module.exports = router;
