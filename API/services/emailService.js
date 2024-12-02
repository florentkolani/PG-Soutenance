const nodemailer = require('nodemailer');
const user = require ('../models/userModel')

const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
        user: process.env.EMAIL_NOVA_LEAD,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendEmail = async (to, subject, html) => {
    const mailOptions = {
        from: process.env.EMAIL_NOVA_LEAD, 
        to,                          
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
