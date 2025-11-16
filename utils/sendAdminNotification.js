const nodemailer = require('nodemailer');
const path = require('path');

/**
 * Envoie un email de notification à l'administrateur.
 * @param {Object} user - L'objet utilisateur contenant les informations de l'utilisateur.
 * @param {string} insuranceId - L'ID de l'assurance pour laquelle le contrat a été téléchargé.
 * @param {string} filePath - Le chemin du fichier du contrat téléchargé.
 * @returns {Promise<void>} - Une promesse qui se résout lorsque l'email est envoyé.
 */
const sendAdminNotification = async (user, insuranceId, filePath) => {
    console.log('sendAdminNotification fonction invoquée.');
    
    try {
        console.log('Création du transporteur...');
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'kallelmir21@gmail.com',
                pass: 'azrt rxrv iyet sfny'
            }
        });

        console.log('Vérification du transporteur...');
        const success = await transporter.verify();
        console.log('Le serveur est prêt à envoyer nos messages:', success);

        console.log('Transporteur créé.');

        const mailOptions = {
            from: 'kallelmir21@gmail.com',
            to: 'kallelmir21@gmail.com', // Remplacez par l'email réel de l'administrateur
            subject: 'Notification : Contrat signé téléchargé',
            text: `L'utilisateur ${user.firstname} ${user.lastname} a téléchargé son contrat signé pour l'assurance ID : ${insuranceId}.`,
            attachments: [
                {
                    filename: path.basename(filePath),
                    path: filePath
                }
            ]
        };

        console.log('Options de l\'email définies:', mailOptions);
        console.log('Envoi de l\'email à l\'administrateur...');

        const info = await transporter.sendMail(mailOptions);
        console.log('Email envoyé à l\'administrateur:', info.response);
    } catch (error) {
        console.error('Erreur dans sendAdminNotification:', error);
        throw error;
    }
};

module.exports = sendAdminNotification;
