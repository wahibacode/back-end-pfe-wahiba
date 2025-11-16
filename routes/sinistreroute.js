const express = require('express');
const router = express.Router();
const sinistreController = require('../controllers/sinistrecontroller');
const verifyToken = require('../utils/verifytoken');
const multer = require('multer');
const appError = require('../utils/appError')
const httpStatusText = require('../utils/httpstatustext')



const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/sinistre');
    },
    filename: function(req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const fileName = `sinistre-${Date.now()}.${ext}`;
        cb(null, fileName);
    }
})
const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0];
    
    if (imageType === 'image') {
        cb(null, true);
    } else {
        cb(appError.create('File must be an image', 400), false);
    }
};

const upload = multer({ 
    storage: diskStorage,
    fileFilter
 })


 router.post(
    '/addSinistre',
    verifyToken,
    upload.array('photos'),
    sinistreController.addSinistre
);
router.get(
    '/allSinistres',
    verifyToken,
    sinistreController.getAllSinistres
);
router.get(
    '/userSinistres',
    verifyToken,
    sinistreController.getUserSinistres
);

router.get(
    '/userSinistres/:id',
    verifyToken,
    sinistreController.getUserSinistreById
);



module.exports = router;
