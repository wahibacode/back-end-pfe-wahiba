const HouseInsurance = require('../models/houseInsurancemodel');
const appError = require('./appError');
const statusHttp = require('./httpstatustext');


const verifyHouseInsurance = async (req, res, next) => {
    try {
        const { email } = req.currentUser;
        console.log({ email });

        // Find health insurance by user email
        const houseInsurance = await HouseInsurance.findOne({ 'user.email': email });
        if (houseInsurance) {
            const error = appError.create('User already has a health insurance', 400, statusHttp.ERROR);
            return next(error);
        }

        // If no health insurance found, proceed to the next middleware or route handler
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = verifyHouseInsurance;