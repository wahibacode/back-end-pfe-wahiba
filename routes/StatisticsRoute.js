const express = require('express');
const router = express.Router();
const StatisticsController = require('../controllers/StatisticsController');

// Define routes for statistics
router.get('/users', StatisticsController.getUserStatistics);
router.get('/sinistres', StatisticsController.getSinistreStatistics);
router.get('/health-insurances', StatisticsController.getHealthInsuranceStatistics);
router.get('/project-insurances', StatisticsController.getProjectInsuranceStatistics);
router.get('/house-insurances', StatisticsController.getHouseInsuranceStatistics);
router.get('/car-insurances', StatisticsController.getCarInsuranceStatistics);
router.get('/retraite-insurances', StatisticsController.getRetraiteInsuranceStatistics);
router.get('/logins', StatisticsController.getLoginStatistics);
router.get('/user-project-ratio', StatisticsController.getUserProjectRatio);
router.get('/insuranceStatistics', StatisticsController.getInsuranceStatistics);

module.exports = router;
