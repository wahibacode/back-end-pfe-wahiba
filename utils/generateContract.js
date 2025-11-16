// utils/generateContract.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generates a contract PDF for the given insurance object.
 * @param {Object} insurance - The insurance object containing user and insurance details.
 * @returns {Promise<string>} - A promise that resolves with the file path of the generated PDF.
 */
const generateContract = async (insurance) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const filePath = path.join(__dirname, '..', 'contracts', `${insurance._id}_contract.pdf`);
        
        console.log('Generating contract at path:', filePath);
        
        const writeStream = fs.createWriteStream(filePath);
        
        writeStream.on('finish', () => {
            console.log('Contract PDF generation finished.');
            resolve(filePath);
        });

        writeStream.on('error', (err) => {
            console.error('Error generating contract PDF:', err);
            reject(err);
        });

        doc.pipe(writeStream);

        const user = insurance.user;

        // Add logo to the document
        doc.image(path.join(__dirname, '..', 'assets', 'testlog.png'), 50, 45, { width: 50 })
            .fontSize(20)
            .text('MicroSafe', 110, 57)
            .moveDown();

        // Add contract details to the document
        doc.fontSize(12)
            .text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, { align: 'right' })
            .moveDown()
            .text(`Contrat d'assurance`, { align: 'center' })
            .moveDown()
            .text(`Nom: ${user.firstname} ${user.lastname}`)
            .text(`CIN: ${user.cinnumber}`)
            .text(`Type d'assurance: ${insurance.insuranceType}`)
            .moveDown()
            .text(`Ce contrat d'assurance entre ${user.firstname} ${user.lastname}, détenteur du numéro CIN ${user.cinnumber}, résidant à ${user.address}, et la société MicroSafe, stipule que ${user.firstname} ${user.lastname} est assuré sous la police ${insurance.insuranceType}. Les termes et conditions de cette assurance couvrent les risques et événements spécifiés dans les conditions générales de la police. En souscrivant à cette assurance, ${user.firstname} ${user.lastname} accepte de se conformer aux règlements et de payer les primes spécifiées.`, {
                align: 'justify'
            })
            .moveDown()
            .text(`Signature:`, { align: 'right' })
            .moveDown()
            .text(`${user.firstname} ${user.lastname}`, { align: 'right' });

        doc.end();
    });
};

module.exports = generateContract;
