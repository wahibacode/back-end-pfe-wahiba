const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/verifytoken');
const multer = require('multer');
const projectInsuranceController = require('../controllers/projectcontroller');
const appError = require('../utils/appError');
const verifyProjectInsurance = require('../utils/verifyProjectInsurance');

// Multer disk storage configuration
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, 'uploads/projet/photo');
        } else if (file.mimetype === 'application/pdf') {
            cb(null, 'uploads/projet/document');
        }
    },
    filename: function(req, file, cb) {
        const ext = file.originalname.split('.').pop(); // Extract file extension
        const fileName = `file-${Date.now()}.${ext}`;
        cb(null, fileName);
    }
});

// Multer file filter function
const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0];
    if (imageType === 'image' || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(appError.create('File must be an image or a PDF', 400), false);
    }
};

// Multer configuration
const upload = multer({ 
    storage: diskStorage,
    fileFilter
});

// Route to handle project insurance creation with file uploads
router.post(
    '/addProjectInsurance',
    verifyToken,
    (req, res, next) => {
        console.log('verifyProjectInsurance middleware called');
        next();
    },
    verifyProjectInsurance ,
    upload.fields([{ name: 'photos', maxCount: 10 }, { name: 'documents', maxCount: 10 }]),
    projectInsuranceController.addProjectInsurance
);


router.delete(
    '/deleteProjectInsurance/:id',
    verifyToken,
    projectInsuranceController.deleteProjectInsurance
);

module.exports = router;
