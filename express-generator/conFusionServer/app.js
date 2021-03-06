//libraries
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');


//models
const Dishes = require('./models/dishes');

//routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

//backend database
const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

//connect to the db
connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });


//express app
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*coockie parser with secrete key(any key to encryption)*/
app.use(cookieParser('12345-67890-09876-54321'));


/*session*/
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

//passport
app.use(passport.initialize());
app.use(passport.session());

//user can access '/' and '/users' without authentication
app.use('/', indexRouter);
app.use('/users', usersRouter);


//authentication funtion with passport
function auth (req, res, next) {
    console.log(req.user);

    if (!req.user) {
      var err = new Error('You are not authenticated!');
      err.status = 403;
      next(err);
    }
    else {
          next();
    }
}

/*
//authentication function with session
function auth (req, res, next) {
    console.log(req.session);

  //if session.user not null (logged in)
  if(!req.session.user) {
      var err = new Error('You are not authenticated!');
      err.status = 403;
      return next(err);
  }
  //otherwise
  else {
    //if user=='authenticated'
    //log in
    if (req.session.user === 'authenticated') {
      next();
    }
    //wrong
    else {
      var err = new Error('You are not authenticated!');
      err.status = 403;
      return next(err);
    }
  }
}
*/


/*
//authentication function - with cookies
function auth (req, res, next) {
  console.log(req.headers);
  
  //if user hasnt been authernticated yet
  //if (!req.signedCookies.user) {
  if (!req.session.user) {

    //authorization header
    var authHeader = req.headers.authorization;
  
    //if there is no authorization header
    //error
    if (!authHeader) {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);
      return;
    }

    //if authorization header exist

    //extract username and password by dycripting
    //exaple header => "Base asad3232s23radsrase4asea" 
  

    //split values by ' '     =>     [Base,asad3232s23radsrase4asea]
    //take second part        =>     asad3232s23radsrase4asea
    //dycrpit using base64    =>     dycrpition(asad3232s23radsrase4asea) = usename:password
    //split from ':'          =>     [username, password]
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  
    var user = auth[0];
    var pass = auth[1];
  
    if (user == 'admin' && pass == 'password') {
      // authorized
      //setup the cookie on response message
      //res.cookie('user','admin',{signed: true});
      
      req.session.user = 'admin';
      next(); 
    } else {
      //wrong information
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');      
      err.status = 401;
      next(err);
    }
  }

  //has beem autherised
  else {
      //user == admin
      //if (req.signedCookies.user === 'admin') {
      if (req.session.user === 'admin') {
          next();
      }
      //wrong user
      else {
          var err = new Error('You are not authenticated!');
          err.status = 401;
          next(err);
      }
  }
}
*/

/****authetication****/
app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));


app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
