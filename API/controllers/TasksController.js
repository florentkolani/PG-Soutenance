const Task = require('../models/TasksModel');
const User = require('../models/userModel');
const typeDeDemande = require('../models/typeDeDemandeModel');
const product = require('../models/productModel');
const nodemailer = require("nodemailer");
const {sendEmail} = require('../services/emailService');
const mongoose = require('mongoose');

// Configuration de Nodemailer (similaire à ticketController)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_NOVA_LEAD,
        pass: process.env.EMAIL_PASS,
    },
});

// Fonction pour générer le numéro de tâche
async function generateNumeroTask() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    const lastTask = await Task.findOne({
        NumeroTask: new RegExp(`^TSK-${year}${month}-\\d{5}$`)
    }).sort({ NumeroTask: -1 });

    let taskCounter = 0;
    if (lastTask) {
        const lastCounter = parseInt(lastTask.NumeroTask.split('-')[2], 10);
        taskCounter = lastCounter;
    }

    taskCounter += 1;
    const counterString = String(taskCounter).padStart(5, '0');
    return `TSK-${year}${month}-${counterString}`;
}

// Fonction pour envoyer un email de création de tâche
async function envoyerEmailCreationTache(task) {
    try {
        const user = await User.findById(task.userId);
        const typeDeDemandeDetails = await typeDeDemande.findById(task.typeDeDemandeId); // Renamed variable
        const productDetails = await product.findById(task.productId);
        const assignedUsers = await User.find({ _id: { $in: task.assignedAgents } });

        const mailOptions = {
            from: process.env.EMAIL_NOVA_LEAD,
            to: assignedUsers.map(u => u.email).join(','),
            subject: `Nouvelle tâche assignée - ${typeDeDemandeDetails.name}`, // Updated variable
            html: `
                <html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px;">
                        <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                            <div style="background-color: #28a745; color: #fff; padding: 20px; text-align: center;">
                                <h3 style="margin: 0;">Nouvelle tâche assignée - ${typeDeDemandeDetails.name}</h3>
                            </div>
                            <div style="padding: 20px;">
                                <p>Une nouvelle tâche vous a été assignée.</p>
                                <p><strong>Détails de la tâche :</strong></p>
                                <ul style="list-style: none; padding: 0;">
                                    <li><strong>Client :</strong> ${user.name}</li>
                                    <li><strong>Produit :</strong> ${productDetails.name}</li>
                                    <li><strong>Type de demande :</strong> ${typeDeDemandeDetails.name}</li>
                                    <li><strong>Date de début :</strong> ${new Date(task.startday).toLocaleDateString()}</li>
                                    <li><strong>Date de fin :</strong> ${new Date(task.endday).toLocaleDateString()}</li>
                                    <li><strong>Description :</strong> ${task.description}</li>
                                    <li><strong>Agents assignés :</strong> ${task.assignedAgents.map(u => u.name).join(', ')}</li>
                                </ul>
                                <p>
                                    <a href="http://localhost:5173/tasks" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: #fff; text-decoration: none; border-radius: 4px;">
                                        Accéder à la tâche
                                    </a>
                                </p>
                            </div>
                            <div style="background-color: #f2f2f2; padding: 20px; text-align: center; font-size: 14px; color: #666;">
                                <p style="margin: 0;">Ce message a été envoyé automatiquement, merci de ne pas y répondre.</p>
                            </div>
                        </div>
                    </body>
                </html>
            `
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email:", error);
    }
}

// Créer une tâche
exports.createTask = async (req, res) => {
    try {
        const requiredFields = ['userId', 'countryId','typeDeDemandeId','productId', 'startday', 'endday', 'assignedAgents', 'description'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ message: `Le champ ${field} est requis.` });
            }
        }

        // Parse assignedAgents if it's a string
        let assignedAgents = req.body.assignedAgents;
        if (typeof assignedAgents === 'string') {
            try {
                assignedAgents = JSON.parse(assignedAgents);
            } catch (error) {
                return res.status(400).json({ message: 'Format invalide pour assignedAgents' });
            }
        }

        const NumeroTask = await generateNumeroTask();
        const taskData = {
            ...req.body,
            assignedAgents,
            NumeroTask,
            files: req.files ? req.files.map(f => f.filename) : [],
        };

        const task = new Task(taskData);
        await task.save();
        await envoyerEmailCreationTache(task);

        res.status(201).json(task);
    } catch (error) {
        console.error('Erreur détaillée:', error);
        res.status(400).json({ message: 'Erreur lors de la création de la tâche', error: error.message });
    }
};

// Obtenir toutes les tâches avec pagination
exports.getTasks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;


        const total = await Task.countDocuments();
        const tasks = await Task.find()
            .populate('userId countryId typeDeDemandeId productId assignedAgents description files endday startday statut')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.status(200).json({
            tasks,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des tâches', error: error.message });
    }
};

// Mettre à jour une tâche
exports.updateTask = async (req, res) => {
    try {
        // Parse selectedUsers if it's a string
        let assignedAgents = req.body.assignedAgents;
        if (typeof assignedAgents === 'string') {
            try {
                assignedAgents = JSON.parse(assignedAgents);
            } catch (error) {
                return res.status(400).json({ message: 'Format invalide pour assignedAgents' });
            }
        }

        const taskData = {
            ...req.body,
            assignedAgents,
            files: req.files ? req.files.map(f => f.filename) : undefined
        };

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            taskData,
            { new: true }
        ).populate('userId countryId typeDeDemandeId productId assignedAgents description files endday startday');

        if (!task) {
            return res.status(404).json({ message: 'Tâche non trouvée' });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error('Erreur détaillée:', error);
        res.status(400).json({ message: 'Erreur lors de la mise à jour de la tâche', error: error.message });
    }
};

// Clôturer une tâche
exports.closeTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            {
                statut: 'cloturé',
                closedAt: new Date()
            },
            { new: true }
        ).populate('userId assignedAgents typeDeDemandeId');

        if (!task) {
            return res.status(404).json({ message: 'Tâche non trouvée' });
        }

        // Vérifier si le type de demande est présent
        const typeDeDemandeDetails = task.typeDeDemandeId;
        if (!typeDeDemandeDetails) {
            return res.status(500).json({ message: 'Type de demande introuvable pour cette tâche.' });
        }

        // Envoyer un email de notification de clôture
        const emailSubject = `Tâche ${typeDeDemandeDetails.name} clôturée`;
        const emailHtml = `
            <html>
                <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                        <div style="background-color: #28a745; color: #fff; padding: 20px; text-align: center;">
                            <h3 style="margin: 0;">La tâche ${typeDeDemandeDetails.name} a été clôturée</h3>
                        </div>
                        <div style="padding: 20px;">
                            <p>La tâche a été marquée comme terminée.</p>
                            <p><strong>Date de clôture :</strong> ${new Date().toLocaleString()}</p>
                        </div>
                        <div style="background-color: #f2f2f2; padding: 20px; text-align: center; font-size: 14px; color: #666;">
                            <p style="margin: 0;">Ce message a été envoyé automatiquement, merci de ne pas y répondre.</p>
                        </div>
                    </div>
                </body>
            </html>
        `;

        // Send email to the task owner
        if (task.userId && task.userId.email) {
            await sendEmail(task.userId.email, emailSubject, emailHtml);
        }

        // Send email to assigned agents
        for (const user of task.assignedAgents) {
            if (user.email) {
                await sendEmail(user.email, emailSubject, emailHtml);
            }
        }

        res.status(200).json(task);
    } catch (error) {
        console.error('Erreur lors de la clôture de la tâche:', error);
        res.status(500).json({ message: 'Erreur lors de la clôture de la tâche', error: error.message });
    }
};

// Obtenir les statistiques des tâches
exports.getTaskStats = async (req, res) => {
    try {
        let filter = {};
        if (req.user.role === 'Client') {
            filter.userId = req.user._id;
        } else if (req.user.role === 'AgentSupport') {
            filter.assignedAgents = req.user._id;
        }

        const tasks = await Task.find(filter);

        const stats = {
            total: tasks.length,
            enAttente: tasks.filter(task => task.statut === 'en attente').length,
            enCours: tasks.filter(task => task.statut === 'en cours').length,
            cloturees: tasks.filter(task => task.statut === 'cloturé').length,
            prochainesEcheances: tasks.filter(task => {
                const today = new Date();
                const dateFin = new Date(task.dateFin);
                const diffDays = Math.ceil((dateFin - today) / (1000 * 60 * 60 * 24));
                return diffDays <= 7 && task.statut !== 'cloturé';
            }).length
        };

        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des statistiques', error: error.message });
    }
};

// Mettre à jour le statut d'une tâche
exports.updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { statut: status },
            { new: true }
        ).populate('userId assignedAgents typeDeDemandeId');

        if (!task) {
            return res.status(404).json({ message: 'Tâche non trouvée' });
        }

        // Envoyer un email de notification de changement de statut
        const emailSubject = `Tâche ${task.typeDeDemandeId?.name || 'Sans nom'} - Statut mis à jour`;
        const emailHtml = `
            <html>
                <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                        <div style="background-color: #28a745; color: #fff; padding: 20px; text-align: center;">
                            <h3 style="margin: 0;">La tâche ${task.typeDeDemandeId?.name || 'Sans nom'} a été mise à jour</h3>
                        </div>
                        <div style="padding: 20px;">
                            <p>Le statut a été changé à : <strong>${status}</strong></p>
                            <p><strong>Date de mise à jour :</strong> ${new Date().toLocaleString()}</p>
                        </div>
                        <div style="background-color: #f2f2f2; padding: 20px; text-align: center; font-size: 14px; color: #666;">
                            <p style="margin: 0;">Ce message a été envoyé automatiquement, merci de ne pas y répondre.</p>
                        </div>
                    </div>
                </body>
            </html>
        `;

        if (task.userId?.email) {
            await sendEmail(task.userId.email, emailSubject, emailHtml);
        }
        
        for (const user of task.assignedAgents) {
            if (user?.email) {
                await sendEmail(user.email, emailSubject, emailHtml);
            }
        }

        res.status(200).json(task);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du statut', error: error.message });
    }
};

// Ajouter un message à une tâche
exports.addMessage = async (req, res) => {
  try {
    const { content, senderId } = req.body;
    
    // Vérifier si la tâche existe
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    // Convertir le senderId en ObjectId
    
    const senderObjectId = new mongoose.Types.ObjectId(senderId);

    // Créer le nouveau message
    const newMessage = {
      senderId: senderObjectId,
      content,
      createdAt: new Date()
    };

    // Ajouter le message à la tâche
    task.messages.push(newMessage);
    await task.save();
    // Récupérer les informations de l'expéditeur
    const sender = await User.findById(senderId);
    const responseMessage = {
      ...newMessage,
      senderName: sender ? sender.name : 'Inconnu'
    };

    res.status(201).json(responseMessage);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du message:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout du message', error: error.message });
  }
};

// Obtenir les messages d'une tâche
exports.getMessages = async (req, res) => {
    try {
      const task = await Task.findById(req.params.id)
        .populate('messages.senderId', 'name');
  
      if (!task) {
        return res.status(404).json({ message: 'Tâche non trouvée' });
      }
  
      // Formater les messages avec les noms des expéditeurs
      const formattedMessages = task.messages.map(message => ({
        ...message.toObject(),
        senderName: message.senderId ? message.senderId.name : 'Inconnu'
      }));
  
      res.status(200).json(formattedMessages);
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des messages', error: error.message });
    }
  };

// Obtenir une tâche par son ID
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('userId countryId typeDeDemandeId productId assignedAgents');
        
        if (!task) {
            return res.status(404).json({ message: 'Tâche non trouvée' });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error('Erreur lors de la récupération de la tâche:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération de la tâche', error: error.message });
    }
};
