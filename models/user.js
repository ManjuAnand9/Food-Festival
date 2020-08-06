
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/manjusha1');

var connectionSchema= new mongoose.Schema({
    userId: Number,
    firstName: String,
    lastName: String,
    email: String,
    salt: String,
    username: String,
    password: String
});

var userInfo = mongoose.model('userinfo', connectionSchema );
module.exports = userInfo;
