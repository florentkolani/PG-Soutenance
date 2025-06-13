const { sendEmail } = require("../services/emailService");
const Email = require("../models/emailModel");

exports.sendBulkEmail = async (req, res) => {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  try {
    // Envoyer les emails en utilisant BCC (géré par emailService.js)
    await sendEmail(to, subject, message);

    // Enregistrer un seul document en base de données avec tous les destinataires
    const emailRecord = new Email({
      sender: req.user.email,
      senderName: req.user.name || "Inconnu",
      recipients: Array.isArray(to) ? to : [to],
      subject,
      message,
    });
    await emailRecord.save();

    res.status(200).json({ message: "Emails envoyés avec succès et enregistrés." });
  } catch (error) {
    console.error("Erreur lors de l'envoi des emails :", error);
    res.status(500).json({ message: "Erreur lors de l'envoi des emails." });
  }
};

exports.getSentEmails = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filtrer les emails pour ne montrer que ceux où l'utilisateur est le destinataire ou l'expéditeur
    const filter = {
      $or: [
        { sender: req.user.email },
        { recipients: req.user.email }
      ]
    };

    // Récupérer les emails filtrés
    const emails = await Email.find(filter)
      .select("sender senderName recipients subject message sentAt")
      .sort({ sentAt: -1 })
      .skip(skip)
      .limit(limit);

    // Pour chaque email, ne montrer que les destinataires pertinents pour l'utilisateur actuel
    const formattedEmails = emails.map(email => {
      const formattedEmail = email.toObject();
      // Si l'utilisateur est l'expéditeur, montrer tous les destinataires
      if (email.sender === req.user.email) {
        return formattedEmail;
      }
      // Si l'utilisateur est un destinataire, ne montrer que son email
      formattedEmail.recipients = [req.user.email];
      return formattedEmail;
    });

    // Compter le nombre total d'emails pour cet utilisateur
    const total = await Email.countDocuments(filter);

    res.status(200).json({
      emails: formattedEmails,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalEmails: total
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des emails :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des emails." });
  }
};