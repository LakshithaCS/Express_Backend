//include mongoose
const mongoose = require('mongoose');
//schema object
const Schema = mongoose.Schema;

//include type currency
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

var promoSchema = new Schema({
     name: {
          type: String,
          required: true,
          unique: true
     },
     image: {
          type: String,
          required: true
     },
     label: {
          type: String,
          default: ''
     },
     price: {
          type: Currency,
          required: true,
          min: 0
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
var Promotions = mongoose.model('Promo', promoSchema);

//return
module.exports = Promotions;