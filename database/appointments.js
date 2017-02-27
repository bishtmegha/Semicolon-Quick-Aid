var mongoose = require('./index.js');
var Schema = mongoose.Schema;

var appointmentSchema = new Schema({
  appointment_id:String,
  patient:String,
  examinationRoom:Number,
  doc_id:Number,
  dept_name:String,
  startdate:Date,
  enddate:Date,
  disease:String,
  status:String    
});
var Appointments = mongoose.model('Appointments', appointmentSchema);
module.exports=Appointments;