var mongoose = require('mongoose');
var config=require('../config')
mongoose.connect('mongodb://'+config.dbHost+":"+config.dbPort+'/'+config.dbName);
module.exports=mongoose;