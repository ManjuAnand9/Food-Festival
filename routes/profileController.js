var express = require('express');
var router = express.Router();
var app = express();
var bodyparser = require('body-parser');
var obj = require('../utility/connectionDB');    //included here to use getconnections function
var UserProfileobj = require('../utility/userdb');
var UserConnectionObj = require('../utility/UserConnectionDB');
var User = require('../models/user');
var UserConnection = require('../models/userConnection');
var Connection = require('../models/Connection');
var moment = require('moment');
var crypto = require('crypto');
const { body,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var urlencoded = bodyparser.urlencoded({ extended: false });
var mongoose= require('mongoose');
mongoose.connect('mongodb://localhost/manjusha1');
mongoose.Promise=global.Promise;

router.get('/', function (req, res) {
    res.render('index',{isLoggedIn:(req.session.userId)?true:false});
    })



router.get('/index', function (req, res) {
    if (req.session.userId)
        {
          res.render('index',{isLoggedIn:true});
        }
    else
        {
              res.render('index',{isLoggedIn:false});
        }
  });

  router.get('/connections',function(req,res){
    obj.getConnections().exec(function(err,data){
        if(err) throw err
      //  console.log(data)
    obj.getCategory().exec(function(err,categoryName){
        if(err) throw err
        res.render('connections',{data:data,categoryName:categoryName,isLoggedIn:(req.session.userId)?true:false});
        })
    })
  });

  router.get('/connection/:ID',function(req,res){
    obj.getConnection(req.params.ID).exec(function(err,connection){
      //console.log(connection)
       if(err) throw err;
       if(connection!=null && req.params.ID<=1000 ){
        res.render('connectiondetail1',{result:connection, isLoggedIn: (req.session.userId)?true:false});
   }
  })
  });


router.get('/savedConnections', function (req, res) {
    if (req.session.userId) {
        UserConnectionObj.getUserConnections(req.session.userId).exec(function(err,result){
         if(err) throw err;
         res.render('savedConnections',{userConnectionList:result,isLoggedIn:true});
        })
      }
     else{
     UserProfileobj.getUser(18).exec(function(err,user){
         if(err) throw err;
         req.session.userId = user.userId;
         req.session.firstName = user.firstName;
         UserConnectionObj.getUserConnections(18).exec(function(err,result){
            res.render('savedConnections',{userConnectionList:result,isLoggedIn:true});
        });
     });     
   }
  });


router.get('/newConnection', function(req,res){
    var userProfile=req.session.userId;
    if (userProfile) {
        res.render('newConnection', { isLoggedIn: true,errrs:[] });
    }
    else {
        res.redirect('login');
    }
  });



router.post('/newConnection', urlencoded ,[

    sanitizeBody(['Name','details','Where','When']).trim(),
    body(['Name','details','Where','When']).not().isEmpty().withMessage("Fields shouldnt be empty"),
    body('When').custom(When =>{
      if(moment(When,'YYYY-MM-DD').isValid()){
        return true;
      }else{
        return Promise.reject('Invalid Date')
      }
      
    }),


], function(req,res){

    const errors = validationResult(req);
      if(!errors.isEmpty()){

        console.log(errors.errors)

        return res.render('newconnection',{isLoggedIn: true,errrs: errors.errors})

    }


    var foodId = Math.floor(Math.random()*(100-10)+10);
    var foodName = req.body.Name;
    var categoryName = req.body.category;
    var details = req.body.details;
    var dateTime = req.body.When;
    var location = req.body.Where;
    var imageURL = "../assets/host.png";

    var data = [
       {
          foodId: foodId,
          foodName: foodName,
          categoryName: categoryName,
          details: details,
          dateTime: dateTime,
          location: location,
          imageURL: imageURL
        }];

        obj.addConnection(data).then(function(connection){

            return res.redirect('/connections');
    
    
          });

    }); 


router.get('/contact', function (req, res) {
    var userProfile = req.session.UserProfile;
    if (userProfile) {
        res.render('contact', { isLoggedIn: true });
    }
    else {
        res.render('contact', { isLoggedIn: false });
    }
});



router.get('/about', function (req, res) {
    var userProfile = req.session.UserProfile;
    if (userProfile) {
        res.render('about', { isLoggedIn: true });
    }
    else {
        res.render('about', { isLoggedIn: false });
    }
});



router.get('/signin',function(req,res){
    res.redirect('/savedConnections');
});

router.get('/signout', function(req,res){
    req.session.destroy();
    res.redirect('/index')

 });

 router.post('/savedConnections', function(req,res,next){
    if (req.session.userId) {
        next();
    }else{
        UserProfileobj.getUser(18).exec(function(err,user){
            if(err) throw err;
            console.log('hjki'+user.userId);
            req.session.userId = user.userId;
            req.session.firstName = user.firstName;
            next();
        }); 
    }
});

 router.post('/savedConnections', urlencoded , function(req,res){

    var operation = req.query.action;
    var foodName = req.body.foodName;
    var categoryName = req.body.categoryName;
    var foodId = req.query.foodId;
    var rsvp = req.query.rsvp;
    var userId = req.session.userId;
    switch(operation){
          case "save":
          UserConnection.findOne({foodId: foodId, userId: userId}, function(err,doc){
            if(err) throw err;
            if(doc){
                UserConnectionObj.updateRSVP(foodId,userId,rsvp,foodName);
            }else{
                UserConnectionObj.addRSVP(foodName,rsvp,categoryName,foodId,userId);
            }

          });
         return res.redirect("/savedConnections");
         break;

      case "delete":
              UserConnection.deleteOne({foodId: foodId, userId: userId}).exec(function(err,result){
                  if(err) throw err;
              })

          res.redirect('/savedConnections')
          break;
      case "updateProfile":
        res.redirect('/connection/'+foodId);
        break;
      }
  });

  router.get('/login',function(req,res){
    res.render('login',{errrs: [], isLoggedIn: false });
  });

  router.post('/login',urlencodedParser,[

    sanitizeBody(['username','password']).trim(),
  
    body('username').custom(username =>{
      
      return UserProfileobj.getPassword(username).then(function(user){
          if(!user){
            return Promise.reject("Enter a valid username");
          }
        
      });
  
    }),body('password').custom((password, {req}) =>{
  
      return UserProfileobj.getPassword(req.body.username).then(function(user){
        if(user){
          if(!(user.password === (sha512(password,user.salt).passwordHash))){
            return Promise.reject("Enter a valid password");
          }
      }
      }) 
    }),
  ]
  
  ,function(req,res){
  
      reqBody = req.body;
      reqQuery = req.query;
  
      const errors = validationResult(req);
      if(!errors.isEmpty()){
  
        console.log(errors.errors)
  
        return res.render('login',{errrs: errors.errors,isLoggedIn: false})
  
      }
      if(reqQuery && 'action' in reqQuery){
          if(reqQuery.action === 'signIn' && 'username' in reqBody && 'password' in reqBody){
  
            return UserProfileobj.getPassword(reqBody.username).then(function(user){
  
                req.session.userId = user.userId;
  
                  res.redirect('/profile/savedconnections'); 
            });
          }else{
  
            res.redirect('/login');
          }
      }else{
        res.redirect('/login');
      } 
  });

  var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') // convert to hexadecimal format
            .slice(0,length);   // return required number of characters
  };
  
  var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); // Hashing algorithm sha512 
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
  };

module.exports = router;      //exporting Router class to use in other files.
