const retraiteInsurancemodel = require('../models/retraiteInsurancemodel');
const appError = require('./appError');
const statusHttp = require('./httpstatustext');

const verifyRetraiteInsurance = async (req, res, next) => {
    try {
        const { email } = req.currentUser;
        console.log({ email });

        // Find retraite insurance by user email
        const retraiteInsurance = await retraiteInsurancemodel.findOne({ 'user.email': email });
        if (retraiteInsurance) {
            const error = appError.create('User already has a retraite insurance', 400, statusHttp.ERROR);
            return next(error);
        }

        // If no retraite insurance found, proceed to the next middleware or route handler
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = verifyRetraiteInsurance;
