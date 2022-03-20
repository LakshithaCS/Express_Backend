var express = require('express');
var router = express.Router();
var passport = require('passport');

const bodyParser = require('body-parser');
var User = require('../models/user');

router.use(bodyParser.json());

/*using passport library*/
router.post('/signup', (req, res, next) => {

  //register() built in function in "passport-local-mongoose"
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    
    //if there is error
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    //otherwise
    else {
      //authenticate() built in function in "passport"
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration Successful!'});
      });
    }
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, status: 'You are successfully logged in!'});
});


/*without passport*/
/*
//signup router
router.post('/signup', (req, res, next) => {

  //find user with given username
  User.findOne({username: req.body.username})
  .then((user) => {

    //if exits, (cant register with same username) => error
    if(user != null) {
      var err = new Error('User ' + req.body.username + ' already exists!');
      err.status = 403;
      next(err);
    }
    //otherwise create new user
    else {
      return User.create({
        username: req.body.username,
        password: req.body.password});
    }
  })
  //response
  .then((user) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({status: 'Registration Successful!', user: user});
  }, (err) => next(err))
  .catch((err) => next(err));
});


///login router
router.post('/login', (req, res, next) => {

  //check null null session user, not logged in
  if(!req.session.user) {
    var authHeader = req.headers.authorization;
    
    //empty authorization header =>error
    if (!authHeader) {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
  
    //otherwise check authentication details to be logged in
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];
  
    User.findOne({username: username})
    .then((user) => {

      //no user for given username => error
      if (user === null) {
        var err = new Error('User ' + username + ' does not exist!');
        err.status = 403;
        return next(err);
      }
      //unmatching password
      else if (user.password !== password) {
        var err = new Error('Your password is incorrect!');
        err.status = 403;
        return next(err);
      }
      //correct authernication
      else if (user.username === username && user.password === password) {
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are authenticated!')
      }
    })
    .catch((err) => next(err));
  }

  //if already logged in
  else {
    //response
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated!');
  }
})
*/

//logout router
router.get('/logout', (req, res) => {

  //if session is not null (logged in)
  if (req.session) {
    //end the session & clear cookie
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');//to home page
  }
  //not logged in
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});


module.exports = router;
