var config = require('../config/index.js');
var ambulance = require('../database/ambulance.js');
var appointments = require('../database/appointments.js');
var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var url = config.dburl;

exports.renderOpdDashboard = function (req, res, next) {

  var data = {}
  data.totalPatients = 3000;
  data.totalMales = 2000;
  data.totalFemales = 1000;
  data.cancellations = 50;
  var deptName = req.params.deptType;
  var dateApp = req.params.aptDate;
  var actualDate = new Date();
  var minDate = new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate() - 1);
  var maxDate = new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate() + 1);

  var countPatients = function (callback) {
    appointments.find({
      "startdate": {
        $gt: new Date(minDate)
      },
      "enddate": {
        $lt: new Date(maxDate)
      },
    }, function (err, data) {
      if (err) {
        res.status(500).send(err);
      } else {
        callback(null, data);
      }
    })
  }

  var countMales = function (callback) {

  }
  var countFemales = function (callback) {

  }
  var countCancellation = function (callback) {

  }
  async.waterfall([
    countPatients,
    countMales,
    countFemales,
    countCancellation
  ], function (err, results) {

  })

  res.render('opd', {
    data: data,
    title: 'QuickBot',
    partials: {
      header: 'header',
      footer: 'footer',
    }
  });
}

exports.getAppoinments = function (req, res, next) {

  /*var deptName = req.params.deptType;
  var dateApp = req.params.aptDate;
  var actualDate = new Date();
  var minDate = new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate() - 1);
  var maxDate = new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate() + 1);
  appointments.find({
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
  */


  var actualDate = new Date();
  var minDate = new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate() - 1);
  var maxDate = new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate() + 1);
  var finalResult;
  var getPatients = function (callback1) {
    MongoClient.connect(url, function (err, db) {
      // db.collection('patient').find({},function (err, result) {
      db.collection('patient').find({}).toArray(function (err, result) {
        //db.collection('ambulance').insert(document, function(err, records) {
        if (err) {
          res.status(500).send(err);
        } else {
          console.log(result);
          callback1(null, result);
        }
      });

      db.close();
    });
  }

  var getApts = function (oldData, callback) {
    appointments.find({
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
        callback(null, [oldData, data]);
      }
    });
  }

  async.waterfall([
    getPatients,
    getApts,
  ], function (err, results) {
    console.log("hi")
    var patients = results[0];
    var appointments = results[1];
    for (var i = 0; i < patients.length; i++) {

      for (var j = 0; j < appointments.length; j++) {
        //console.log(appointments[i].patient + ":" + patients[j].patient_id);
        if (appointments[j].patient && patients[i].patient_id && appointments[j].patient && appointments[j].patient === patients[i].patient_id) {
          console.log(appointments[j].patient + ":" + patients[i].patient_id);
          appointments[j].patient = patients[i].firstname + " " + patients[i].lastname;
          appointments[j].age = patients[i].age;
          appointments[j].gender = patients[i].gender;
          console.log(appointments[j].gender);
        }
      }
    }
    res.json(appointments);
  })
  /*
  appointments.find({
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
      //res.send(data);
    
      MongoClient.connect(url, function (err, db) {
        data.forEach(function (apt) {
          console.dir(apt);
          db.collection('patient').find({
            'patient_id': apt.patient
          }, function (err, result) {

            //db.collection('ambulance').insert(document, function(err, records) {
            if (err) {
              res.status(500).send(err);
            } else {
              //if everything is fine
              result.forEach(function (patient) {
                console.dir(patient);
                apt.patient = patient.firstname + " " + patient.lastname;
                apt.age = patient.age;
                apt.gender = patient.gender;
              })
              res.send(data);
            }
          }); 
     
        db.close();
      });


    }
  })*/

}