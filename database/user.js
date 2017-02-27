var mongoose = require('./index.js');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username:String
 
    
});
var User = mongoose.model('User', userSchema);
module.exports=User;