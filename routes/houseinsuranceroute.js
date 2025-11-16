const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/verifytoken');
const multer = require('multer');
const houseInsuranceController = require('../controllers/housecontroller');
const appError = require('../utils/appError');
const verifyHouseInsurance = require('../utils/verifyHouseInsurance');

// Multer disk storage configuration
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/house');
    },
    filename: function(req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const fileName = `house-${Date.now()}.${ext}`;
        cb(null, fileName);
    }
});

// Multer file filter function
const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0];
    if(imageType === 'image') {
        cb(null, true);
    } else {
        cb(appError.create('file must be an image', 400), false);
    }
};

// Multer configuration
const upload = multer({ 
    storage: diskStorage,
    fileFilter
});

// Route to add a new house insurance
router.post('/addHouseInsurance', verifyToken, verifyHouseInsurance, upload.array('housePictures', 5), houseInsuranceController.addHouseInsurance);
router.delete(
    '/deleteHouseInsurance/:id',
    verifyToken,
    houseInsuranceController.deleteHouseInsurance
);
module.exports = router;
