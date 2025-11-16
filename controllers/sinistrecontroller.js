const Sinistre = require('../models/sinistremodel');
const ProjectInsurance = require('../models/projectInsurancemodel');
const HealthInsurance = require('../models/healthInsurancemodel');
const CarInsurance = require('../models/carinsurancemoidel');
const HouseInsurance = require('../models/houseInsurancemodel');
const appError = require('../utils/appError');
const statusHttp = require('../utils/httpstatustext');

const addSinistre = async (req, res, next) => {
    try {
        const { assuranceType, date, description } = req.body;
        const { email } = req.currentUser;

        let insuranceModel;

        switch (assuranceType) {
            case 'ProjectInsurance':
                insuranceModel = ProjectInsurance;
                break;
            case 'HealthInsurance':
                insuranceModel = HealthInsurance;
                break;
            case 'CarInsurance':
                insuranceModel = CarInsurance;
                break;
            case 'HouseInsurance':
                insuranceModel = HouseInsurance;
                break;
            default:
                const error = appError.create('Invalid insurance type', 400, statusHttp.ERROR);
                return next(error);
        }

        const insurance = await insuranceModel.findOne({ 'user.email': email });

        if (!insurance) {
            const error = appError.create(`No active '${assuranceType}' policy found for this user.`, 404, statusHttp.ERROR);
            return next(error);
        }

        const photos = req.files.map(file => file.path);

        const newSinistre = new Sinistre({
            assuranceType,
            date,
            description,
            photos,
            user: insurance.user,  // Use the entire user object
            Insurance: insurance
        });

        await newSinistre.save();

        res.status(201).json({ message: 'Sinistre added successfully', sinistre: newSinistre });
    } catch (error) {
        next(error);
    }
};
const getAllSinistres = async (req, res, next) => {
    try {
        const sinistres = await Sinistre.find();
        res.status(200).json({ status: statusHttp.SUCCESS, data: sinistres });
    } catch (error) {
        next(error);
    }
};

const getUserSinistres = async (req, res, next) => {
    try {
        const { email } = req.currentUser;
        const userSinistres = await Sinistre.find({ 'user.email': email });
        res.status(200).json({ status: statusHttp.SUCCESS, data: userSinistres });
    } catch (error) {
        next(error);
    }
};


const getUserSinistreById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { email } = req.currentUser;

        const sinistre = await Sinistre.findOne({ _id: id, 'user.email': email });

        if (!sinistre) {
            const error = appError.create('Sinistre not found or you do not have access to this sinistre', 404, statusHttp.ERROR);
            return next(error);
        }

        res.status(200).json({ status: statusHttp.SUCCESS, data: sinistre });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addSinistre,
    getAllSinistres,
    getUserSinistres,
    getUserSinistreById
};