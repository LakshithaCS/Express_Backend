const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//dishes model
const Dishes = require('../models/dishes');

//create an router instance
const dishRouter = express.Router();

dishRouter.use(bodyParser.json());


//implementation of the router
dishRouter.route('/')
.get((req,res,next) => {

    //find all dishes
    Dishes.find({})
    .then((dishes) => {

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);//add to all dishes to body of response

    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {

    //create & insert dish using request body
    Dishes.create(req.body)
    .then((dish) => {
        
        console.log('Dish Created ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);//add to perticular dish to body of response

    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete((req, res, next) => {
    //remove all
    Dishes.remove({})
    .then((resp) => {

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);//add to perticular dish to body of response

    }, (err) => next(err))
    .catch((err) => next(err));    
});


dishRouter.route('/:dishId')
.get((req,res,next) => {

    //find dish using id
    Dishes.findById(req.params.dishId)
    .then((dish) => {

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);

    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})
.put((req, res, next) => {

    //find and update using body
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, { new: true })
    .then((dish) => {

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);

    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {

    //find and remove
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);

    }, (err) => next(err))
    .catch((err) => next(err));
});


//comments
dishRouter.route('/:dishId/comments')
.get((req,res,next) => {

    //find by id
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        //if not null
        if (dish != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);
        }
        //if null
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }

    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {

    //find by id
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        //if not null
        if (dish != null) {
            //push comment in to comments array
            dish.comments.push(req.body);
            //save dish
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);                
            }, (err) => next(err));
        }
        //null
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes/'
        + req.params.dishId + '/comments');
})
.delete((req, res, next) => {
    //find by id
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        //if dish not null
        if (dish != null) {
            //remove comments one by one
            for (var i = (dish.comments.length -1); i >= 0; i--) {
                dish.comments.id(dish.comments[i]._id).remove();
            }
            //save dish
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);                
            }, (err) => next(err));
        }
        //if null
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});



//route for a perticular comment
dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next) => {
    //find dish by the id
    Dishes.findById(req.params.dishId)
    .then((dish) => {

        //if dish not null and comment is not null
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId));
        }
        //if dish null
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        //if dish is not null but comment is null
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId
        + '/comments/' + req.params.commentId);
})
.put((req, res, next) => {
    //find dish by id
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        //if dish not null and comment is not null
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            //update ratings
            if (req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            //update comment
            if (req.body.comment) {
                dish.comments.id(req.params.commentId).comment = req.body.comment;                
            }
            //save dish
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);                
            }, (err) => next(err));
        }
        //if dish is null
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        //if dish not null but comment is null
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        //if dish not null and comment is not null
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            //remove perticular comment
            dish.comments.id(req.params.commentId).remove();
            //save dish
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);                
            }, (err) => next(err));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        //if dish not null but comment is null
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});


//export
module.exports = dishRouter;
