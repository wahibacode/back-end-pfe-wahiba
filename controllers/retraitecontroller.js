const retraiteInsurancemodel = require('../models/retraiteInsurancemodel');
const statusHttp = require('../utils/httpstatustext');
const appError = require('../utils/appError');
const UserModel = require('../models/usermodel');

const addretraiteInsurance = async (req, res, next) => {
    try {
        const { email } = req.currentUser;

        // Find user by email
        let user = await UserModel.findOne({ email });
        if (!user) {
            const error = appError.create('User not found', 404, statusHttp.ERROR);
            return next(error);
        }

        const { revenuesMensuel, sommeADeposer } = req.body;

        // Get file paths from multer upload
        const { extraitDeNaissance, preuveDActivite, cin } = req.files;

        const newRetraiteData = {
            revenuesMensuel,
            sommeADeposer,
            user: user,
            extraitDeNaissance: extraitDeNaissance[0].path,
            preuveDActivite: preuveDActivite[0].path,
            cin: cin[0].path
        };

        let newRetraite = new retraiteInsurancemodel(newRetraiteData);
        await newRetraite.save();

        return res.json({ status: statusHttp.SUCCESS, data: { newRetraite: newRetraite } });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    addretraiteInsurance
};
