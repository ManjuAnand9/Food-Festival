// requiring the connectons schema
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/manjusha1');
var Connection = require('../models/Connection');
mongoose.Promise=global.Promise;

module.exports.getConnections=function(){
    var connections= Connection.find()
    return connections;
    }

module.exports.getCategory=function(){
    var category= Connection.distinct("categoryName");
    return category;
    }

module.exports.getConnection=function(id){

    var connection = Connection.find({"foodId":id});
    return connection;
    }

module.exports.getSize=function(){
    var size=Connection.count();
    return size;
    }
