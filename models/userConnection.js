var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/manjusha1');

var connectionSchema= new mongoose.Schema({
  foodName: String,
  rsvp: String,
  categoryName:String,
  foodId:Number,
  userId: Number
});

var userConnection = mongoose.model('userconnection', connectionSchema );
module.exports = userConnection;
