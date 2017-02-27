var config = require('../config/index.js');
var ambulance = require('../database/ambulance.js');
var appointments = require('../database/appointments.js');
var MongoClient = require('mongodb').MongoClient;
var url = config.dburl;

exports.renderHomePage = function (req, res, next) {
    res.render('index', {
        title: 'QuickBot',
        partials: {
            header: 'header',
            footer: 'footer',
        }
    });
}

exports.getAppoinments = function (req, res, next) {
    var deptName = req.params.deptType;
    var dateApp = req.params.aptDate;
    var actualDate = new Date(dateApp);
    var minDate = new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate() - 1);
    var maxDate = new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate() + 1);
    appointments.find({
        "dept_name": deptName,
        "startdate": {
            $gt: new Date(minDate)
        },
        "enddate": {
            $lt: new Date(maxDate)
        }
    }, function (err, data) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(data);
        }
    })

}

exports.addppoinments = function (req, res, next) {
    var appointment = new appointments(req.body.appObj);
    appointment.save(function (err, data) {
        console.log(data)
        if (err) {
            res.status(500).send(err);
        } else {
            globalIO.emit('newApt', req.body.appObj);
            res.send("success");
        }
    })
}

var ObjectID = require('mongodb').ObjectID;
exports.bookambulance = function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        var ambulanceDataObj = {};
        ambulanceDataObj.patient = req.body.user_id; 
        ambulanceDataObj.examinationRoom=3;
        ambulanceDataObj.doc_id=4;
        ambulanceDataObj.dept_name="Cardiology";
        ambulanceDataObj.casualty_date=new Date();
        ambulanceDataObj.disease="Heart Attack";
        ambulanceDataObj.status="valid";
        ambulanceDataObj.arrivalTime=10;
        
        db.collection('casualty').insert(ambulanceDataObj, function(err, records) {
            if(err){
                res.status(500).send(err);
            }else{
               var ObjectID = require('mongodb').ObjectID; 
        db.collection('ambulance').update({'_id':ObjectID("58b158c5d9180a83a2df4480")}, {$set: {status : "booked"}}, {w:1}, function(err, result){
            if(err){
                res.status(500).send(err);
            }else{
				
                res.send(result);
            }
        });
            }
        });
       


    });
}