//include mongoose
const mongoose = require('mongoose');
//include model
const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

//connect to the db
connect.then((db) => {

    console.log('Connected correctly to server');

    //v2.0
    //create an insert both at same time
    Dishes.create({
        name: 'Uthapizza',
        description: 'Test'
    })
    .then((dish) => {
        console.log(dish); //print updated
        
        //finds using id
        //then updates the description
        return Dishes.findByIdAndUpdate(dish._id, {
            $set: { description: 'Updated test'}
        },{ 
            new: true 
        })
        .exec();
    })
    .then((dish) => {
        console.log(dish);

        //add comment into comments array in the dish
        dish.comments.push({
            rating: 5,
            comment: 'I\'m getting a sinking feeling!',
            author: 'Leonardo di Carpaccio'
        });

        return dish.save(); //save it
    })
    .then((dishes) => {
        console.log(dishes); //print removed dishes

        return Dishes.remove({}); //remove all
    })
    .then(() => {
        return mongoose.connection.close();
    })
    .catch((err) => {
        console.log(err);
    });

    /*
    //v1.0

    //create a document using the model
    var newDish = Dishes({
        name: 'Uthappizza',
        description: 'test'
    });

    //save it in db
    newDish.save()
        .then((dish) => {
            console.log(dish);

            return Dishes.find({});//return all
        })
        .then((dishes) => {
            console.log(dishes);//print all

            return Dishes.remove({});//remove
        })
        .then(() => {
            return mongoose.connection.close();//close
        })
        .catch((err) => {
            console.log(err);//if there is an error
        });

    */

});