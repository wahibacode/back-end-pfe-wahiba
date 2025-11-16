const projectInsurancemodel = require('../models/projectInsurancemodel');
const appError = require('./appError');
const statusHttp = require('../utils/httpstatustext');

const verifyProjectInsurance = async (req, res, next) => {
    try {
        const { email } = req.currentUser;
        console.log('Current user email:', email);

        const projectInsurance = await projectInsurancemodel.findOne({ 'user.email': email });
        if (projectInsurance) {
            console.log('Project insurance already exists');
            const error = appError.create('User already has a project insurance', 400, statusHttp.ERROR);
            return next(error);
        }

        // If no project insurance found, proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Error in verifyProjectInsurance:', error);
        next(error);
    }
};

module.exports = verifyProjectInsurance;
