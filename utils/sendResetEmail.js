
const nodemailer = require('nodemailer');

const sendResetEmail = async (email, resetUrl) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'kallelmir21@gmail.com',
           pass: 'azrt rxrv iyet sfny'

            // Use environment variables for security
        }
    });

    const mailOptions = {
        from: 'kallelmir21@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: `Please click on the following link to reset your password: ${resetUrl}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendResetEmail;
