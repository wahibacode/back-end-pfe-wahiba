const carinsurancemoidel = require('../models/carinsurancemoidel');

const appError = require('./appError');
const statusHttp = require('./httpstatustext');


const verifyCarInsurance = async (req, res, next) => {
    try {
        const { email } = req.currentUser;
        console.log({ email });

        // Find health insurance by user email
        const carInsurance = await carinsurancemoidel.findOne({ 'user.email': email });
        if (carInsurance) {
            const error = appError.create('User already has a car insurance', 400, statusHttp.ERROR);
            return next(error);
        }

        // If no health insurance found, proceed to the next middleware or route handler
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = verifyCarInsurance;