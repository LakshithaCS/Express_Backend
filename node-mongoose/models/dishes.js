//include mongoose
const mongoose = require('mongoose');
//schema object
const Schema = mongoose.Schema;

//define the schema format for comments
var commentSchema = new Schema({
    rating:  {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment:  {
        type: String,
        required: true
    },
    author:  {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


//define the schema format for dishes
const dishSchema = new Schema({
    name: { //string, unique, can required
        type: String,
        required: true, 
        unique: true
    },
    description: { // string, required
        type: String,
        required: true
    },
    comments:[commentSchema] //array of comment schema
},{
    timestamps: true //created/updated time (automatically)
});

//create a model using the schema
var Dishes = mongoose.model('Dish', dishSchema);

//return
module.exports = Dishes;