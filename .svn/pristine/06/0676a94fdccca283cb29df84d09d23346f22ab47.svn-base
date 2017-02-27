var mongoose = require('./index.js');
var Schema = mongoose.Schema;

var wardSchema = new Schema({
    ward_id : Number,
    ward_number : Number,
    ward_name : String,
    total_capacity : Number,
    occupied : Number    
});
var ward = mongoose.model('ward', wardSchema);
module.exports=ward;