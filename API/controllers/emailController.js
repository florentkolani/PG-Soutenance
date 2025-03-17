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
