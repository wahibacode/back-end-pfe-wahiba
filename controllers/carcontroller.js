const statusHttp = require('../utils/httpstatustext')
const carinsurancemoidel = require('../models/carinsurancemoidel')

const usermodel = require('../models/usermodel');
const InsuranceArchive = require('../models/archiveInsurance');
const appError = require('../utils/appError')
const addCarInsurance = async (req, res, next) => {
    try {
        const { email } = req.currentUser;
        console.log({ email });

        // Find user by email
        let user = await usermodel.findOne({ email });
        if (!user) {
            const error = appError.create('User not found', 404, statusHttp.ERROR);
            return next(error);
        }

        // Set fixed or derived values for state, price, and Paiement_rest
        const state = 'Treatement'; // Fixed value or derived from logic
        const price = 0; // Fixed value or derived from logic
        const Paiement_rest = 0; // Fixed value or derived from logic
        const car = req.files.map(file => file.path);

        // Create new car insurance object
        const newcarInsurance = new carinsurancemoidel({
            marque: req.body.marque,
            model: req.body.model,
            numeroImmatriculation: req.body.numeroImmatriculation,
            numeroChassis: req.body.numeroChassis,
            valeurEstime: req.body.valeurEstime,
            useCase: req.body.useCase,
            photo: car,
            user: user, // Assign current user
            state: state, // Set state
            price: price, // Set price
            Paiement_rest: Paiement_rest // Set Paiement_rest
        });

        // Save the new car insurance
        await newcarInsurance.save();
        return res.json({ status: statusHttp.SUCCESS, data: { carInsurance: newcarInsurance } });
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

const deleteCarInsurance = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { email } = req.currentUser;

        const CarInsurance = await carinsurancemoidel.findById(id);

        if (!CarInsurance) {
            const error = appError.create('Insurance not found', 404, statusHttp.ERROR);
            return next(error);
        }

        // Verify that the insurance belongs to the current user
        if (CarInsurance.user._id.toString() !== req.currentUser.id) {
            const error = appError.create('Unauthorized to delete this insurance', 403, statusHttp.ERROR);
            return next(error);
        }

        // Archive the insurance
        await archiveInsurance(CarInsurance, 'CarInsurance');

        // Delete the insurance
        await carinsurancemoidel.deleteOne({ _id: id });

        return res.json({ status: statusHttp.SUCCESS, message: 'Insurance deleted successfully and archived' });
    } catch (error) {
        next(error);
    }
};


    module.exports={
        addCarInsurance,
        deleteCarInsurance
    }