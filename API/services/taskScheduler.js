const cron = require('node-cron');
const Task = require('../models/TasksModel');
const User = require('../models/userModel');
const typeDeDemande = require('../models/typeDeDemandeModel');
const { sendEmail } = require('../services/emailService');

// Planifie la tâche pour s'exécuter toutes les heures ('0 * * * *')
cron.schedule('0 * * * *', async () => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  try {
    const tasks = await Task.find({ statut: 'en attente' })
      .populate('userId assignedAgents typeDeDemandeId');

    for (const task of tasks) {
      const taskDate = new Date(task.startday).toISOString().split('T')[0];

      if (taskDate <= today) {
        task.statut = 'en cours';
        await task.save();
        console.log(`Tâche ${task.typeDeDemandeId?.name} mise à jour à "en cours"`);

        // Envoyer un email de notification de changement de statut
        const emailSubject = `Tâche ${task.typeDeDemandeId?.name || 'Sans nom'} - Statut mis à jour automatiquement`;
        const emailHtml = `
            <html>
                <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                        <div style="background-color: #28a745; color: #fff; padding: 20px; text-align: center;">
                            <h3 style="margin: 0;">La tâche ${task.typeDeDemandeId?.name || 'Sans nom'} a été mise à jour automatiquement</h3>
                        </div>
                        <div style="padding: 20px;">
                            <p>Le statut a été changé à : <strong>en cours</strong></p>
                            <p><strong>Date de mise à jour :</strong> ${new Date().toLocaleString()}</p>
                            <p>Cette mise à jour a été effectuée automatiquement car la date de début de la tâche est atteinte.</p>
                        </div>
                        <div style="background-color: #f2f2f2; padding: 20px; text-align: center; font-size: 14px; color: #666;">
                            <p style="margin: 0;">Ce message a été envoyé automatiquement, merci de ne pas y répondre.</p>
                        </div>
                    </div>
                </body>
            </html>
        `;

        // Envoyer l'email au propriétaire de la tâche
        if (task.userId?.email) {
            await sendEmail(task.userId.email, emailSubject, emailHtml);
        }

        // Envoyer l'email aux agents assignés
        for (const user of task.assignedAgents) {
            if (user?.email) {
                await sendEmail(user.email, emailSubject, emailHtml);
            }
        }
      }
    }
  } catch (err) {
    console.error('Erreur dans le cron des tâches :', err);
  }
});
