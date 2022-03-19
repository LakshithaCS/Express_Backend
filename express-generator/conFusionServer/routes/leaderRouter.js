const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//dishes model
const Leaders = require('../models/leaders');

//create an router instance
const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get((req,res,next) => {

    //find all leaders
    Leaders.find({})
    .then((leaders) => {

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);//add to all leaders to body of response

    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {

    //create & insert leaders using request body
    Leaders.create(req.body)
    .then((leader) => {
        
        console.log('Promotion Created ', leader);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);//add to perticular leader to body of response

    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})
.delete((req, res, next) => {
    //remove all
    Leaders.remove({})
    .then((resp) => {

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);//add to perticular leader to body of response

    }, (err) => next(err))
    .catch((err) => next(err));    
});


leaderRouter.route('/:leaderId')
.get((req,res,next) => {

    //find leader using id
    Leaders.findById(req.params.leaderId)
    .then((leader) => {

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);

    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /leaders/'+ req.params.leaderId);
})
.put((req, res, next) => {

    //find and update using body
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, { new: true })
    .then((leader) => {

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);

    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {

    //find and remove
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp) => {

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);

    }, (err) => next(err))
    .catch((err) => next(err));
});


//export
module.exports = leaderRouter;