const carInsurancecontroller = require('../controllers/carcontroller')
const verifyCarInsurance = require('../utils/verifyCarInsurance')
const {body} = require('express-validator')
const express = require('express');
const allowedTo = require('../utils/allowedTo')
const router = express.Router();
const appError = require('../utils/appError')
const verifyToken = require('../utils/verifytoken');

const httpStatusText = require('../utils/httpstatustext')
const multer  = require('multer')
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/car');
    },
    filename: function(req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const fileName = `car-${Date.now()}.${ext}`;
        cb(null, fileName);
    }
})

const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0];
    
    if(imageType === 'image') {
        return cb(null, true)
    } else {
        return cb(appError.create('file must be an image', 400), false)
    }
}
const upload = multer({ 
    storage: diskStorage,
    fileFilter
 })


 router.route('/addCarInsurance').post(verifyToken,verifyCarInsurance,upload.array('car',8),carInsurancecontroller.addCarInsurance);
 router.delete(
    '/deleteCarInsurance/:id',
    verifyToken,
    carInsurancecontroller.deleteCarInsurance
);
 module.exports = router;
