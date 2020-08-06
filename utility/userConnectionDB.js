// requiring the userProfile schema
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/manjusha1');
var Connection = require('../models/Connection');
var UserConnection=require("../models/userConnection");

module.exports.getUserConnections=function(userid){
   return UserConnection.find({"userId":userid});
}

module.exports.addRSVP=function(foodName,rsvp,categoryName,foodId,userId){
  values=[{foodName:foodName, rsvp: rsvp, categoryName: categoryName, foodId: foodId, userId: userId}];
  return UserConnection.findOne({foodName: foodName, userId: userId}).exec(function(err,docs){
      if(err) throw err;
       if(!docs){
       UserConnection.insertMany(values,function(err,docs){
           if(err) throw err;
        })
}
});
}


module.exports.updateRSVP=function(foodId,userId,rsvp,foodName){
 return UserConnection.findOneAndUpdate({
      userId: userId,
      foodId: foodId
    },
    {
      rsvp: rsvp
    },
    {upsert: true, returnNewDocument: true}).exec(function(err,docs){
      if(err) throw err;
  });
}


module.exports.addConnection=function(data){
  Connection.insertMany(data,function(err,docs){
      if(err) throw err;
   });
 }
