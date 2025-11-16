const HealthInsurance = require('../models/healthInsurancemodel');
const appError = require('./appError');
const statusHttp = require('./httpstatustext');


const verifyHealthInsurance = async (req, res, next) => {
    try {
        const { email } = req.currentUser;
        console.log({ email });

        // Find health insurance by user email
        const healthInsurance = await HealthInsurance.findOne({ 'user.email': email });
        if (healthInsurance) {
            const error = appError.create('User already has a health insurance', 400, statusHttp.ERROR);
            return next(error);
        }

        // If no health insurance found, proceed to the next middleware or route handler
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = verifyHealthInsurance;