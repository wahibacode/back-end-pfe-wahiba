const sendContractEmail = require('./utils/sendContractEmail');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Function to create a test PDF
const createTestPDF = () => {
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, 'contracts', 'testfile.pdf');
    
    // Ensure the contracts directory exists
    if (!fs.existsSync(path.join(__dirname, 'contracts'))) {
        fs.mkdirSync(path.join(__dirname, 'contracts'));
    }
    
    doc.pipe(fs.createWriteStream(filePath));
    doc.text('This is a test PDF file.');
    doc.end();
    return filePath;
};

// Function to send the contract email
const sendTestEmail = async () => {
    const user = {
        email: 'azizsmati44@gmail.com' // Replace with the actual recipient email
    };

    const filePath = createTestPDF();
    await sendContractEmail(user, filePath);
};

sendTestEmail().then(() => {
    console.log('Test email sent successfully.');
}).catch(error => {
    console.error('Error sending test email:', error);
});
