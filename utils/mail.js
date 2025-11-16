const nodemailer = require('nodemailer');

/**
 * Sends a reimbursement notification email to the user.
 * @param {Object} user - The user object containing the user's email.
 * @param {number} amount - The reimbursement amount.
 * @returns {Promise<void>} - A promise that resolves when the email is sent.
 */
const sendReimbursementEmail = async (user, amount) => {
    console.log('sendReimbursementEmail function invoked.');
    
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
            subject: 'Remboursement de Sinistre Accepté',
            text: `Bonjour ${user.firstname} ${user.lastname},

Votre sinistre a été accepté et vous avez reçu un remboursement de ${amount} DT.

Merci pour votre patience.

Cordialement,
Votre Compagnie d'Assurance`
        };

        console.log('Mail options set:', mailOptions);
        console.log('Sending email to:', user.email);

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error in sendReimbursementEmail:', error);
        throw error;
    }
};

module.exports = sendReimbursementEmail;
