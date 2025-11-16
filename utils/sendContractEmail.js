// utils/sendContractEmail.js
const nodemailer = require('nodemailer');
const path = require('path');

/**
 * Sends the contract PDF to the user's email.
 * @param {Object} user - The user object containing the user's email.
 * @param {string} filePath - The file path of the generated PDF.
 * @returns {Promise<void>} - A promise that resolves when the email is sent.
 */
const sendContractEmail = async (user, filePath, link) => {
    console.log('sendContractEmail function invoked.');
    
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
            subject: 'Votre contrat d\'assurance',
            text:  `Veuillez trouver ci-joint votre contrat d'assurance, Mr/Mrs ${user.firstname} ${user.lastname}. Merci de signer le contrat au municipal et de le déposer signé au ${link}.`,
            attachments: [
                {
                    filename: path.basename(filePath),
                    path: filePath
                }
            ]
        };

        console.log('Mail options set:', mailOptions);
        console.log('Sending email to:', user.email);

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error in sendContractEmail:', error);
        throw error;
    }
};

module.exports = sendContractEmail;
