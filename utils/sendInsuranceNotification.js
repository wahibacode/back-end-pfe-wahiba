const nodemailer = require('nodemailer');

const sendInsuranceNotification = async (user, state) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'kallelmir21@gmail.com',
                pass: 'azrt rxrv iyet sfny'
            }
        });

        let subject, text;

        switch (state) {
            case 'Agreement':
                subject = 'Contrat d\'assurance';
                text = `Cher/Chère ${user.firstname} ${user.lastname},\n\nVotre demande d'assurance a été approuvée. Veuillez télécharger et signer le contrat, puis le télécharger à nouveau.\n\nMerci.`;
                break;
            case 'Treatement':
                subject = 'Demande d\'assurance refusée';
                text = `Cher/Chère ${user.firstname} ${user.lastname},\n\nVotre demande d'assurance a été refusée. Veuillez soumettre une nouvelle demande avec les informations correctes.\n\nMerci.`;
                break;
            default:
                throw new Error('Invalid state');
        }

        const mailOptions = {
            from: 'kallelmir21@gmail.com',
            to: user.email,
            subject: subject,
            text: text
        };

        await transporter.sendMail(mailOptions);
        console.log(`Notification email sent successfully for state: ${state}.`);
    } catch (error) {
        console.error('Error sending notification email:', error);
    }
};

module.exports = sendInsuranceNotification;
