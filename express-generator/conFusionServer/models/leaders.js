//include mongoose
const mongoose = require('mongoose');
//schema object
const Schema = mongoose.Schema;

//include type currency
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

var leaderSchema = new Schema({
     name: {
          type: String,
          required: true,
          unique: true
     },
     image: {
          type: String,
          required: true
     },
     designation: {
          type: String,
          required: true
     },
     abbr: {
          type: String,
          required: true
     },
     description: {
          type: String,
          required: true
     },
     featured:{
          type: Boolean,
          required: true
     }
},{
    timestamps: true //created/updated time (automatically)
}); 

//create a model using the schema
var Leaders = mongoose.model('Leader', leaderSchema);

//return
module.exports = Leaders;