//libraries
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

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
app.use(cookieParser());



function auth (req, res, next) {
  console.log(req.headers);
  
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

  /*if authorization header exist*/

  /*
  *
    extract username and password by dycripting
    exaple header => "Base asad3232s23radsrase4asea" 
  *
  */

  //split values by ' '     =>     [Base,asad3232s23radsrase4asea]
  //take second part        =>     asad3232s23radsrase4asea
  //dycrpit using base64    =>     dycrpition(asad3232s23radsrase4asea) = usename:password
  //split from ':'          =>     [username, password]
  var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  
  var user = auth[0];
  var pass = auth[1];
  
  if (user == 'admin' && pass == 'password') {
      next(); // authorized
  } else {
      //wrong information
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');      
      err.status = 401;
      next(err);
  }
}

/****authetication****/
app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
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
