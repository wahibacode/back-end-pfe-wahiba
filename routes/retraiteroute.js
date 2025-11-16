const express = require('express');
const router = express.Router();
const retraitecontroller = require('../controllers/retraitecontroller');
const appError = require('../utils/appError');
const verifyToken = require('../utils/verifytoken');
const verifyretraiteInsurance = require('../utils/verifyRetraiteInsurance');
const multer = require('multer');

// Multer configuration
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'extraitDeNaissance') {
            cb(null, 'uploads/retraite/extraitDeNaissance');
        } else if (file.fieldname === 'preuveDActivite') {
            cb(null, 'uploads/retraite/preuveDActivite');
        } else if (file.fieldname === 'cin') {
            cb(null, 'uploads/retraite/cin');
        } else {
            cb(appError.create('Unknown fieldname'), false);
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
    if (file.fieldname === 'extraitDeNaissance' || file.fieldname === 'preuveDActivite' || file.fieldname === 'cin') {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(appError.create('File must be a PDF', 400), false);
        }
    } else {
        cb(appError.create('Unknown fieldname'), false);
    }
};

// Multer configuration
const upload = multer({ 
    storage: diskStorage,
    fileFilter
});

// Route to handle retirement insurance creation with file uploads
router.post(
    '/addRetraiteInsurance',
    verifyToken,
    (req, res, next) => {
        console.log('verifyRetraiteInsurance middleware called');
        next();
    },
    verifyretraiteInsurance,
    upload.fields([
        { name: 'extraitDeNaissance', maxCount: 1 },
        { name: 'preuveDActivite', maxCount: 1 },
        { name: 'cin', maxCount: 1 }
    ]),
    retraitecontroller.addretraiteInsurance
);

module.exports = router;
