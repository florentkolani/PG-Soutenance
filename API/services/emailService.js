const nodemailer = require('nodemailer');
const user = require('../models/userModel')

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_NOVA_LEAD,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendEmail = async (to, subject, html) => {
    // Si to est un tableau (plusieurs destinataires), on utilise BCC
    const mailOptions = {
        from: process.env.EMAIL_NOVA_LEAD,
        to: Array.isArray(to) ? process.env.EMAIL_NOVA_LEAD : to, // L'expéditeur dans le champ TO
        bcc: Array.isArray(to) ? to : undefined, // Les destinataires en BCC si c'est un tableau
        subject,
        html
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('E-mail envoyé avec succès à:', to);
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
        throw error;
    }
};
