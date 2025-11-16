const healthInsurancemodel = require('../models/healthInsurancemodel');
const statusHttp = require('../utils/httpstatustext');
const InsuranceArchive = require('../models/archiveInsurance');
const appError = require('../utils/appError')

const UserModel = require('../models/usermodel');

const addHealthInsurance = async (req, res, next) => {
    try {
        const { email } = req.currentUser;
        console.log({ email });

        // Find user by email
        let user = await UserModel.findOne({ email });
        if (!user) {
            const error = appError.create('User not found', 404, statusHttp.ERROR);
            return next(error);
        }

        const { statut, partenaire, enfants } = req.body;

        // Ensure enfants is always an array
        const enfantsArray = Array.isArray(enfants) ? enfants : [enfants];

        // Extract photo and document information from the request
        const documents = req.files.documents ? req.files.documents.map(file => file.path) : [];

        // Map over enfants array to extract data
        const kidsData = enfantsArray.map(kid => ({
            nom: kid['nom'],
            prenom: kid['prenom'],
        }));

        const newhealthtData = {
            statut,
            partenaire,
            user: user,
            Documents: documents,
            enfants: kidsData
        };

        let newhealthInsurance = new healthInsurancemodel(newhealthtData);
        await newhealthInsurance.save();
        return res.json({ status: statusHttp.SUCCESS, data: { newhealthInsurance: newhealthInsurance } });

    } catch (error) {
        next(error);
    }
};


const archiveInsurance = async (insurance, insuranceType) => {
    const insuranceArchive = new InsuranceArchive({
        originalInsuranceId: insurance.toObject(),
        insuranceType: insuranceType,
        archivedAt: new Date()
    });

    await insuranceArchive.save();
};
const deleteHealthInsurance = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { email } = req.currentUser;
console.log(req.currentUser.id);
        const healthInsurance = await healthInsurancemodel.findById(id);

        if (!healthInsurance) {
            const error = appError.create('Insurance not found', 404, statusHttp.ERROR);
            return next(error);
        }

        // Verify that the insurance belongs to the current user
        if (healthInsurance.user._id.toString() !== req.currentUser.id) {
            const error = appError.create('Unauthorized to delete this insurance', 403, statusHttp.ERROR);
            return next(error);
        }

        // Archive the insurance
        await archiveInsurance(healthInsurance, 'HealthInsurance');

        // Delete the insurance
        await healthInsurancemodel.deleteOne({ _id: id });

        return res.json({ status: statusHttp.SUCCESS, message: 'Insurance deleted successfully and archived' });
    } catch (error) {
        next(error);
    }
};
module.exports={
    addHealthInsurance,
    deleteHealthInsurance
}