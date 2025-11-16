const statusHttp = require('../utils/httpstatustext');
const HouseInsuranceModel = require('../models/houseInsurancemodel');
const UserModel = require('../models/usermodel');
const InsuranceArchive = require('../models/archiveInsurance');
const appError = require('../utils/appError');
const houseInsurancemodel = require('../models/houseInsurancemodel');

const addHouseInsurance = async (req, res, next) => {
    try {
        // Extract user email from current user
        const { email } = req.currentUser;
        console.log({ email });

        // Find user by email
        let user = await UserModel.findOne({ email });
        if (!user) {
            const error = appError.create('User not found', 404, statusHttp.ERROR);
            return next(error);
        }

        // Set default or derived values for state, price, and Paiement_rest
        const state = 'Treatement'; // Fixed value or derived from logic
        const price = 0; // Fixed value or derived from logic
        const Paiement_rest = 0; // Fixed value or derived from logic

        // Extract array of file paths from Multer
        const housePictures = req.files.map(file => file.path);
        const date = new Date(req.body.constructionYear);
        const year = date.getFullYear();
        console.log(year);
        // Create new house insurance object
        const newHouseInsurance = new HouseInsuranceModel({
     
            address: req.body.address,
            constructionYear: date.getFullYear(),
            totalArea: req.body.totalArea,
            numberOfRooms: req.body.numberOfRooms,
            housePictures: housePictures, // Assign array of file paths
            user: user, // Assign current user
            state: state, // Set state
            price: price, // Set price
            Paiement_rest: Paiement_rest // Set Paiement_rest
        });

        // Save the new house insurance
        await newHouseInsurance.save();
        return res.json({ status: statusHttp.SUCCESS, data: { houseInsurance: newHouseInsurance } });
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

const deleteHouseInsurance = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { email } = req.currentUser;
console.log(req.currentUser.id);
        const houseInsurance = await houseInsurancemodel.findById(id);

        if (!houseInsurance) {
            const error = appError.create('Insurance not found', 404, statusHttp.ERROR);
            return next(error);
        }

        // Verify that the insurance belongs to the current user
        if (houseInsurance.user._id.toString() !== req.currentUser.id) {
            const error = appError.create('Unauthorized to delete this insurance', 403, statusHttp.ERROR);
            return next(error);
        }

        // Archive the insurance
        await archiveInsurance(houseInsurance, 'HouseInsurance');

        // Delete the insurance
        await houseInsurancemodel.deleteOne({ _id: id });

        return res.json({ status: statusHttp.SUCCESS, message: 'Insurance deleted successfully and archived' });
    } catch (error) {
        next(error);
    }
};



module.exports = {
    addHouseInsurance,
    deleteHouseInsurance
};
