const {body} = require('express-validator')
const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/verifytoken');

const contactcontroller = require('../controllers/contactcontroller')
router.route('/addcontact').post(contactcontroller.addContact)
router.route('/getAllContacts').get(verifyToken,contactcontroller.getAllContacts)

module.exports = router;