// // services/mailService.js
const FormData = require("form-data");
const Mailgun = require("mailgun.js");
const dotenv = require("dotenv");
dotenv.config();

// Initialisation de Mailgun avec form-data
const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api", // toujours "api"
  key: process.env.MAILGUN_API_KEY, // clé privée
});

// Fonction d'envoi
exports.sendEmail = async (to, subject, html) => {
  // const recipients = Array.isArray(to) ? to : [to];
  // Remplacez ici par votre adresse de test
  const testEmail = "kolaniflorent446@gmail.com";
  const recipients = [testEmail];

  try {
    const data = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: process.env.MAILGUN_FROM, // Ex: "Nova Lead <support@nova-lead.com>"
      to: Array.isArray(to) ? process.env.MAILGUN_FROM_TEST : to, // affiché en TO
      bcc: Array.isArray(to) ? recipients : undefined,       // BCC si liste
      subject,
      html,
    });

    console.log("📤 Mail envoyé avec succès :", data.id || data.message);
  } catch (error) {
    console.error("❌ Erreur envoi mail :", error);
    throw error;
  }
}
