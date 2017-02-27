var mongoose = require('./index.js');
var Schema = mongoose.Schema;

var rolesSchema = new Schema({
  name:String,
  description:String,
  appInstances:[String],
  entitlements:[String],
  creator:String,
  date:Date,
  roleKey:Number
 
    
});
var Roles = mongoose.model('Roles', rolesSchema);
module.exports=Roles;