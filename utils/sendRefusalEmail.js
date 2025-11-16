const nodemailer = require('nodemailer');

/**
 * Sends a refusal notification email to the user.
 * @param {Object} user - The user object containing the user's email.
 * @returns {Promise<void>} - A promise that resolves when the email is sent.
 */
const sendRefusalEmail = async (user) => {
    console.log('sendRefusalEmail function invoked.');
    
    try {
        console.log('Creating transporter...');
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'kallelmir21@gmail.com',
                pass: 'azrt rxrv iyet sfny'
            }
        });

        console.log('Verifying transporter...');
        const success = await transporter.verify();
        console.log('Server is ready to take our messages:', success);

        console.log('Transporter created.');
        
        const mailOptions = {
            from: 'kallelmir21@gmail.com',
            to: user.email,
            subject: 'Refus de Sinistre',
            text: `Bonjour ${user.firstname} ${user.lastname},

Nous regrettons de vous informer que votre sinistre a été refusé.

Merci de votre compréhension.

Cordialement,
Votre Compagnie d'Assurance`
        };

        console.log('Mail options set:', mailOptions);
        console.log('Sending email to:', user.email);

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error in sendRefusalEmail:', error);
        throw error;
    }
};

module.exports = sendRefusalEmail;
