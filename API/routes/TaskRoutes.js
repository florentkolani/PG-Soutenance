const express = require('express');
const router = express.Router();
const TasksController = require('../controllers/TasksController');
const { protect } = require('../middleware/authMiddleware');
const { documentUpload } = require('../upload');

// Route pour créer une nouvelle tâche
router.post('/', protect, documentUpload.array('files'), TasksController.createTask);

// Route pour obtenir toutes les tâches avec pagination
router.get('/', protect, TasksController.getTasks);

// Route pour mettre à jour une tâche
router.put('/:id', protect, documentUpload.array('files'), TasksController.updateTask);

// Route pour mettre à jour le statut d'une tâche
router.put('/:id/status', protect, TasksController.updateTaskStatus);

// Route pour clôturer une tâche
router.put('/:id/close', protect, TasksController.closeTask);

// Route pour obtenir les statistiques des tâches
router.get('/stats', protect, TasksController.getTaskStats);

// Route pour ajouter un message à une tâche
router.post('/:id/messages', protect, TasksController.addMessage);

// Route pour obtenir les messages d'une tâche
router.get('/:id/messages', protect, TasksController.getMessages);

// Route pour obtenir une tâche par son ID
router.get('/:id', protect, TasksController.getTaskById);

module.exports = router;
