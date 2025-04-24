const { sendEmail } = require("../services/emailService");
const Email = require("../models/emailModel");

exports.sendBulkEmail = async (req, res) => {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  try {
    await sendEmail(to, subject, message);

    // Save email details to the database
    const emailRecord = new Email({
      sender: req.user.email, // Assuming `req.user` contains authenticated user info
      senderName: req.user.name || "Inconnu", // Fallback to "Inconnu" if name is missing
      recipients: to, // Ensure recipients field is populated
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

    // Aucun filtre - tous les utilisateurs peuvent voir tous les emails
    const filter = {};
    
    // Récupérer tous les emails
    const emails = await Email.find(filter)
      .select("sender senderName recipients subject message sentAt")
      .sort({ sentAt: -1 })
      .skip(skip)
      .limit(limit);

    // Compter le nombre total d'emails
    const total = await Email.countDocuments(filter);

    res.status(200).json({
      emails,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalEmails: total
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des emails :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des emails." });
  }
};