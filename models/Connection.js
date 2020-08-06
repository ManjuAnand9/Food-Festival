var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/manjusha1');

var connectionSchema= new mongoose.Schema({
    foodId: Number,
    foodName: String,
    categoryName: String,
    details: String,
    dateTime: String,
    location: String,
    imageURL: String},
  {versionKey: false
});

var foodDB = mongoose.model('connection', connectionSchema );
module.exports = foodDB;
