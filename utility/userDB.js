var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/manjusha1');
mongoose.Promise=global.Promise;

var UserConnection=require("../models/userConnection");
var Connection=require("../models/Connection");
var User=require("../models/user");

module.exports.getUserConnections=function(){
    var useritems=UserConnection.find();
    return useritems;
}

module.exports.getUser=function(userid){
    var connectionnames=User.findOne({userId:userid});
    return connectionnames;
}

module.exports.getUseDetails=function(){
    var username=User.find();
    return username;
}

module.exports.getPassword = function(username){

    return User.findOne({username: username}).exec();

  };
