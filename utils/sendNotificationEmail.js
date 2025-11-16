const nodemailer = require('nodemailer');

const sendNotificationEmail = async (email, subject, message, sender, lien) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'kallelmir21@gmail.com', // replace with your email
            pass: 'azrt rxrv iyet sfny' // replace with your email password
        }
    });

    const mailOptions = {
        from: 'kallelmir21@gmail.com', // replace with your email
        to: email,
        subject: subject,
        text: `Vous avez un nouveau message sur votre ticket:\n\n${message} \n\n lien: ${lien} \n\nDe: ${sender}\nDate: ${new Date().toLocaleString()}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Notification email sent successfully');
    } catch (error) {
        console.error('Error sending notification email:', error);
    }
};

module.exports = sendNotificationEmail;
