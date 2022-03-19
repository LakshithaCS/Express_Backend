const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//dishes model
const Promotions = require('../models/promotions');

//create an router instance
const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.get((req,res,next) => {

    //find all promotions
    Promotions.find({})
    .then((promos) => {

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promos);//add to all promotions to body of response

    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {

    //create & insert promotions using request body
    Promotions.create(req.body)
    .then((promo) => {
        
        console.log('Promotion Created ', promo);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);//add to perticular promotion to body of response

    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotion');
})
.delete((req, res, next) => {
    //remove all
    Promotions.remove({})
    .then((resp) => {

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);//add to perticular prmotion to body of response

    }, (err) => next(err))
    .catch((err) => next(err));    
});

promoRouter.route('/:promoId')
.get((req,res,next) => {

    //find promotion using id
    Promotions.findById(req.params.promoId)
    .then((promo) => {

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);

    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /promotion/'+ req.params.promoId);
})
.put((req, res, next) => {

    //find and update using body
    Promotions.findByIdAndUpdate(req.params.promoId, {
        $set: req.body
    }, { new: true })
    .then((promo) => {

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);

    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {

    //find and remove
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((resp) => {

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);

    }, (err) => next(err))
    .catch((err) => next(err));
});


//export
module.exports = promoRouter;