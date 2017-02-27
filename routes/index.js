var express = require('express');
var router = express.Router();
var BaseController = require('../controllers/BaseController')
var app = express();
var users = require('../routes/users');
var casualty = require('../routes/casualty');
var opd = require('../routes/opd');
var analytics = require('../routes/analytics');
var ward=require('../database/ward.js');

router.use('/users', users);
router.use('/casualty', casualty);
router.use('/opd', opd);
router.use('/analytics', analytics);
router.use('/conversejs', require('../routes/conversation'));
router.use('/api/speech-to-text/', require('../routes/stt-token'));
router.use('/api/text-to-speech/', require('../routes/tts-token'));

router.get('/appointment/:deptType/:aptDate', function(req, res, next) {
    
    BaseController.getAppoinments(req, res, next);
 
});

router.post('/addAppointment', function(req, res, next) {
    
    var obj = {
        appointment_id : req.body.appointment_id,
        patient : req.body.patient,
        startdate : new Date(),
        enddate : new Date(),
        examinationRoom : "",
        disease:"fever",
        status:"Booked",
        doc_id:1,
        dept_name:"General"}
    req.body.appObj = obj;
    BaseController.addppoinments(req, res, next);
 
});

router.post('/bookambulance', function(req, res, next) {
    BaseController.bookambulance(req, res, next);
 
});


module.exports = router;
