const {body} = require('express-validator')
const express = require('express');
const allowedTo = require('../utils/allowedTo')
const router = express.Router();
const usercontroller = require('../controllers/usercontroller')
const verifyToken = require('../utils/verifytoken');
const userRoles = require('../utils/userRoles');
const appError = require('../utils/appError')
const httpStatusText = require('../utils/httpstatustext')
const multer  = require('multer')
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/avatar');
    },
    filename: function(req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const fileName = `user-${Date.now()}.${ext}`;
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

// Multer setup for contract uploads
const contractStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/contrat/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploadContract = multer({ storage: contractStorage });


router.route('/register').post(upload.single('avatar'),usercontroller.register)
router.route('/login').post(usercontroller.login)
router.route('/').get(verifyToken, usercontroller.getallusers)
router.route('/request-reset-password').post(usercontroller.requestPasswordReset);
router.post('/reset-password/:token', usercontroller.resetPassword);
router.get('/user-profile', verifyToken, usercontroller.getUserProfile);
//router.put('/update-account-info', verifyToken, usercontroller.updateAccountInfo);
router.route('/update-account-info').put(verifyToken, upload.single('avatar'),usercontroller.updateAccountInfo);
router.route('/getUserInsurances').get(verifyToken,usercontroller.getUserInsurances);
router.route('/insurance/:id').get(verifyToken,usercontroller.getInsuranceById);
router.route('/Delete-insurance/:id').delete(verifyToken,usercontroller.deleteInsuranceById);
router.route('/getAllInsurances').get(verifyToken,usercontroller.getAllInsurances);
router.route('/AdminGetInsuranceById/:id').get(verifyToken,usercontroller.AdminGetInsuranceById);
router.route('/getSinistreById/:id').get(verifyToken,usercontroller.getSinistreById);
router.route('/getTicketById/:id').get(usercontroller.getTicketById);
router.route('/initial-accept-insurance/:id').put(verifyToken, usercontroller.updateInsuranceToAgreement); 
router.route('/update-contract/:id').put(verifyToken, uploadContract.single('contract'), usercontroller.updateInsuranceContract);
router.route('/update-state-not-paid/:id').put(verifyToken,usercontroller.updateInsuranceStateToNotPaid)
router.route('/update-state-refused/:id').put(verifyToken, usercontroller.updateInsuranceStateToRefused); // New route
router.route('/update-insurance-price/:id').put(verifyToken, usercontroller.updateInsurancePrice);
router.route('/update-insurance-resting-payment/:id').put(verifyToken, usercontroller.updateInsurancePayment);
router.put('/update-solde-delete-sinistre/:userId/:sinistreId', verifyToken, usercontroller.updateSoldeAndDeleteSinistre);
router.put('/refuse-sinistre/:userId/:sinistreId', verifyToken, usercontroller.updateSinistreToRefused);
router.get('/user/:id', verifyToken, usercontroller.getUserById);
router.route('/addMessageToContact/:id').post(verifyToken,usercontroller.addMessageToContact);
router.route('/addMessageToContactAsUser/:id').post(usercontroller.addMessageToContactAsUser);
router.put('/updateTicketState/:id', usercontroller.updateTicketState);


module.exports = router;
