var appointments=require('../database/appointments.js');
var ward=require('../database/ward.js');
var express = require('express');
var router = express.Router();
var BaseController = require('../controllers/BaseController')
var casualtyController = require('../controllers/casualtyController')

/* GET home page. */
router.get('/dashboard', function(req, res, next) {
    
    casualtyController.rendercasualtyDashboard(req, res, next);
 
});

router.get('/casualtyAppointment', function(req, res, next) {
    
    casualtyController.getAppoinments(req, res, next);
 
});

router.get('/wardDetails', function(req, res, next) {
    casualtyController.getWardDetails(req, res, next);
 
});

router.get('/doctorIncall', function(req, res, next) {
    
    casualtyController.getDoctorInCall(req, res, next);
 
});


router.get('/ambulanceAvailable', function(req, res, next) {
    
    casualtyController.ambulanceAvailable(req, res, next);
 
});

module.exports = router;
