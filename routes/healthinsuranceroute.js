const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/verifytoken');
const multer = require('multer');
const healthInsuranceController = require('../controllers/healthcontroller');
const appError = require('../utils/appError');

const verifyHealthInsurance = require('../utils/verifyHealthInsurance');

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
    
            cb(null, 'uploads/health');
        
    },
    filename: function(req, file, cb) {
        const ext = file.originalname.split('.').pop(); // Extract file extension
        const fileName = `doc-${Date.now()}.${ext}`;
        cb(null, fileName);
    }
});



const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0];
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(appError.create('File must be a PDF', 400), false);
    }
};

const upload = multer({ 
    storage: diskStorage,
    fileFilter
 })

 router.post(
    '/addhealthtInsurance',
    verifyToken,
    verifyHealthInsurance,
    upload.fields([{ name: 'documents', maxCount: 10 }]),
    healthInsuranceController.addHealthInsurance
);

router.delete(
    '/deleteHealthInsurance/:id',
    verifyToken,
    healthInsuranceController.deleteHealthInsurance
);
module.exports = router;
