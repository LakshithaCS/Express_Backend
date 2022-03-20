/*schema for user*/

var passportLocalMongoose = require('passport-local-mongoose');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    
    /*
    //username and password field are automatically added by passport(passportLocalMongoose)
    username: {
        type: String,
        required: true,
        unique: true
    },
    password:  {
        type: String,
        required: true
    },
    */

    admin:   {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);