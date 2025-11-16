const usermodel = require('../models/usermodel');
const Sinistre = require('../models/sinistremodel');
const healthInsurancemodel = require('../models/healthInsurancemodel');
const projectInsurancemodel = require('../models/projectInsurancemodel');
const houseInsurancemodel = require('../models/houseInsurancemodel');
const carinsurancemoidel = require('../models/carinsurancemoidel');
const retraiteInsurancemodel = require('../models/retraiteInsurancemodel');

const getUserStatistics = async (req, res) => {
    try {
        const userCount = await usermodel.countDocuments();
        res.json({ userCount });
    } catch (error) {
        res.status(500).send('Server error');
    }
};

const getSinistreStatistics = async (req, res) => {
    try {
        const sinistreCount = await Sinistre.countDocuments();
        res.json({ sinistreCount });
    } catch (error) {
        res.status(500).send('Server error');
    }
};

const getHealthInsuranceStatistics = async (req, res) => {
    try {
        const healthInsuranceCount = await healthInsurancemodel.countDocuments();
        res.json({ healthInsuranceCount });
    } catch (error) {
        res.status(500).send('Server error');
    }
};

const getProjectInsuranceStatistics = async (req, res) => {
    try {
        const projectInsuranceCount = await projectInsurancemodel.countDocuments();
        res.json({ projectInsuranceCount });
    } catch (error) {
        res.status(500).send('Server error');
    }
};

const getHouseInsuranceStatistics = async (req, res) => {
    try {
        const houseInsuranceCount = await houseInsurancemodel.countDocuments();
        res.json({ houseInsuranceCount });
    } catch (error) {
        res.status(500).send('Server error');
    }
};

const getCarInsuranceStatistics = async (req, res) => {
    try {
        const carInsuranceCount = await carinsurancemoidel.countDocuments();
        res.json({ carInsuranceCount });
    } catch (error) {
        res.status(500).send('Server error');
    }
};

const getRetraiteInsuranceStatistics = async (req, res) => {
    try {
        const retraiteInsuranceCount = await retraiteInsurancemodel.countDocuments();
        res.json({ retraiteInsuranceCount });
    } catch (error) {
        res.status(500).send('Server error');
    }
};

const getLoginStatistics = async (req, res) => {
    try {
        const { period } = req.query; // day, week, or month
        let startDate;

        switch (period) {
            case 'day':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 1);
                break;
            case 'week':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
                break;
            case 'month':
                startDate = new Date();
                startDate.setMonth(startDate.getMonth() - 1);
                break;
            default:
                return res.status(400).send('Invalid period');
        }

        const loginCount = await usermodel.countDocuments({ lastLogin: { $gte: startDate } });
        res.json({ loginCount });
    } catch (error) {
        res.status(500).send('Server error');
    }
};

const getUserProjectRatio = async (req, res) => {
    try {
        const userCount = await usermodel.countDocuments();
        const projectCount = await projectInsurancemodel.countDocuments();
        const ratio = projectCount > 0 ? userCount / projectCount : 0;
        res.json({ userCount, projectCount, ratio });
    } catch (error) {
        res.status(500).send('Server error');
    }
};
const getInsuranceStatistics = async (req, res, next) => {
    try {
        const models = [
            healthInsurancemodel,
            projectInsurancemodel,
            carinsurancemoidel,
            houseInsurancemodel,
            retraiteInsurancemodel
        ];

        let totalInsurances = 0;
        let paidCount = 0;
        let notPaidCount = 0;
        let treatmentCount = 0;

        for (const model of models) {
            const insurances = await model.find({});
            totalInsurances += insurances.length;
            paidCount += insurances.filter(insurance => insurance.state === 'paid').length;
            notPaidCount += insurances.filter(insurance => insurance.state === 'Not paid').length;
            treatmentCount += insurances.filter(insurance => insurance.state === 'Treatement').length;
        }

        res.json({
            status: 'success',
            data: {
                totalInsurances,
                paidCount,
                notPaidCount,
                treatmentCount
            }
        });
    } catch (error) {
        console.error('Error in getInsuranceStatistics:', error);
        next(error);
    }
};

module.exports = {
    getUserStatistics,
    getSinistreStatistics,
    getHealthInsuranceStatistics,
    getProjectInsuranceStatistics,
    getHouseInsuranceStatistics,
    getCarInsuranceStatistics,
    getRetraiteInsuranceStatistics,
    getLoginStatistics,
    getUserProjectRatio,
    getInsuranceStatistics
};
