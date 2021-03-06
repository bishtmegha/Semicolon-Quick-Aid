var ambulance=require('../database/ambulance.js');
var appointments=require('../database/appointments.js');
var ward=require('../database/ward.js');
var doctor=require('../database/doctor.js');
var config = require('../config/index.js');
var extend = require('util')._extend;
var MongoClient = require('mongodb').MongoClient;
var url = config.dburl;

var async = require('async');

exports.rendercasualtyDashboard = function(req,res,next){
      var dataObject = {};
     async.waterfall([              
         getCasualtyToday,
         getWardCapacity,
         getAmbulanceStatus,
         getDoctorsOnCall
           ],function(err,results){
         
         var ward = results[1];
         var ambulance = results[2];
         var doctors = results[3];
         var appoitments = [];
       
         ward.forEach(function(wobj){
           wobj.percentage = Math.floor((wobj.occupied /  wobj.total_capacity) * 100);  
         })
         
         ambulance.forEach(function(ambobj){
             ambobj.isFree = false;
             if(ambobj.status == "available"){
                    ambobj.isFree = true;
             }
           
         })
     
       /*  appoitmentsList.forEach(function(appObj){
             appoitments.push({"appDet":appObj._doc,"patDet":appObj});
         });*/
     appoitments = results[0]
     
          appoitments.forEach(function(appObj){
              appObj.isMale = true;
            if(appObj.gender == "Female"){
                appObj.isMale = false;                
            }
             appObj.validCheck = false;
              if(appObj.arrivalTime === 0){
                    appObj.validCheck = true;
             }
             
         });
            console.log(appoitments) 
//         console.log(appoitmentsList)
        res.render('casualty',{title: 'QuickBot',
        appoitments:appoitments,                    
        ward:ward,                    
        ambulance:ambulance,                    
        doctors:doctors,                    
        partials:
          {
            header: 'header',
            footer: 'footer',
          }});    
    })
      
}
//"startdate": { $gt: new Date(minDate)}, "enddate": { $lt: new Date(maxDate)}
function getCasualtyToday(callback){
     var actualDate = new Date();
    var minDate = new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate()-1);
    var maxDate = new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate()+1);
  MongoClient.connect(url, function(err, db) {
   db.collection('casualty').find({"casualty_date":{ $gt: new Date(minDate)}, "casualty_date": { $lt: new Date(maxDate)}}).toArray(function(err, data) {
        
        getPatientforAppoitments( data,0,function(data){
        
            callback(null,data)  
        })
       
    })
     db.close();
  });
    
}

function getPatientforAppoitments(appList,index,callback){
    if(index>=appList.length ){
        callback(appList)
        return;
    }
    
//    db.getCollection('patient').find({patient_id :{$eq : "1"}})
   
    MongoClient.connect(url, function(err, db) {
        db.collection('patient').find({patient_id :{$eq : appList[index].patient}}).toArray(function(err, data) {
             var obj1 = {},obj2 = {};
            obj2 = extend({}, data[0]);
            obj1 = extend({},appList[index]);
            for (var attrname in obj1) { obj2[attrname] = obj1[attrname]; }
            appList[index] = obj2;
            getPatientforAppoitments(appList,index+1,callback)
        });
        db.close();
    });
    
}

function getWardCapacity(oldData,callbackFunction){
     MongoClient.connect(url, function(err, db) {
        db.collection('ward').find({}).toArray(function(err, data) {
            callbackFunction(null,[oldData,data])
        });
        db.close();
    });
}
function getAmbulanceStatus(oldData,callbackFunction){
  MongoClient.connect(url, function(err, db) {
        db.collection('ambulance').find({}).toArray(function(err, data) {
            oldData.push(data)
            callbackFunction(null,oldData)
        });
        db.close();
    });
}

function getDoctorsOnCall(oldData,callbackFunction){
   MongoClient.connect(url, function(err, db) {
        db.collection('doctor').find({}).toArray(function(err, data) {
            oldData.push(data)
            callbackFunction(null,oldData)
        });
        db.close();
    });
}

exports.getAppoinments = function(req,res,next){
    var actualDate = new Date();
    var minDate = new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate()-1);
    var maxDate = new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate()+1);
    appointments.find({"startdate": { $gt: new Date(minDate)}, "enddate": { $lt: new Date(maxDate)}},function(err,data){
        if(err){
            res.status(500).send(err);
        }else{
            res.send(data);
        }
    })
}

exports.getWardDetails = function(req,res,next){
    MongoClient.connect(url, function(err, db) {
        db.collection('ward').find({}).toArray(function(err, data) {
            if(err){
                res.status(500).send(err);
            }else{
                res.send(data);
            }
        });
        db.close();
    });
}


exports.getDoctorInCall = function(req,res,next){
    
    MongoClient.connect(url, function(err, db) {
        db.collection('doctor').find({}).toArray(function(err, data) {
            if(err){
                res.status(500).send(err);
            }else{
                res.send(data);
            }
        });
        db.close();
    });
}

exports.ambulanceAvailable = function(req,res,next){
    MongoClient.connect(url, function(err, db) {
        db.collection('ambulance').find({}).toArray(function(err, data) {
            if(err){
                res.status(500).send(err);
            }else{
                res.send(data);
            }
        });
        db.close();
    });
}

