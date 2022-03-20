var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

//verify username and password 
//authenticate() => built in fuction in passportmongoose to verify username and password
exports.local = passport.use(new LocalStrategy(User.authenticate()));

//serializing 
passport.serializeUser(User.serializeUser());

//deserializing
passport.deserializeUser(User.deserializeUser());