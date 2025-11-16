const statusHttp = require('../utils/httpstatustext');
const projectInsurancemodel = require('../models/projectInsurancemodel');
const InsuranceArchive = require('../models/archiveInsurance');
const appError = require('../utils/appError')

const UserModel = require('../models/usermodel');

const addProjectInsurance = async (req, res, next) => {
    try {
        const { email } = req.currentUser;
        console.log({ email });

        // Find user by email
        let user = await UserModel.findOne({ email });
        if (!user) {
            const error = appError.create('User not found', 404, statusHttp.ERROR);
            return next(error);
        }

        const { nomProjet, adresse, secteurActivite, statutJuridique, dateCreation, actionnaires } = req.body;

        // Extract photo and document information from the request
        const photos = req.files.photos ? req.files.photos.map(file => file.path) : [];
        const documents = req.files.documents ? req.files.documents.map(file => file.path) : [];

        // Map over actionnaires array to extract data only if they exist
        const actionnairesData = actionnaires ? actionnaires.map(actionnaire => ({
            nom: actionnaire['nom'],
            prenom: actionnaire['prenom'],
            cin: actionnaire['cin']
        })) : [];
        
        console.log(actionnairesData);
        
        const newProjectData = {
            nomProjet,
            adresse,
            secteurActivite,
            statutJuridique,
            dateCreation,
            user: user,
            photoLocal: photos,
            Documents: documents,
            actionnaires: statutJuridique === 'collabortatif' ? actionnairesData : []
        };

        let newProjectInsurance = new projectInsurancemodel(newProjectData);
        await newProjectInsurance.save();
        return res.json({ status: statusHttp.SUCCESS, data: { projectInsurance: newProjectInsurance } });

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

const deleteProjectInsurance = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { email } = req.currentUser;

        const projectInsurance = await projectInsurancemodel.findById(id);

        if (!projectInsurance) {
            const error = appError.create('Insurance not found', 404, statusHttp.ERROR);
            return next(error);
        }

        // Verify that the insurance belongs to the current user
        if (projectInsurance.user._id.toString() !== req.currentUser.id) {
            const error = appError.create('Unauthorized to delete this insurance', 403, statusHttp.ERROR);
            return next(error);
        }

        // Archive the insurance
        await archiveInsurance(projectInsurance, 'ProjectInsurance');

        // Delete the insurance
        await projectInsurancemodel.deleteOne({ _id: id });

        return res.json({ status: statusHttp.SUCCESS, message: 'Insurance deleted successfully and archived' });
    } catch (error) {
        next(error);
    }
};


 module.exports = {
    addProjectInsurance,
    deleteProjectInsurance
};