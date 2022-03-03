//include mongoose
const mongoose = require('mongoose');
//schema object
const Schema = mongoose.Schema;

//include type currency
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

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
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: { //currency type is used here
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default:false      
    },
    comments:[commentSchema] //array of comment schema
},{
    timestamps: true //created/updated time (automatically)
});

//create a model using the schema
var Dishes = mongoose.model('Dish', dishSchema);

//return
module.exports = Dishes;