var express=require('express'); //loading express module
var router=express.Router();
var controller= express();
var itemDB= require('../utility/itemDB');  //using itemDB.js

router.get('/',function(req,res){
    res.render('index');
});
router.get('/home',function(req,res){
  res.render('index');
});
router.get('/index', function(req, res) {
  res.render('index');
});

router.get('/newConnection', function(req, res) {
  if(req.session.theUser){
    res.render('newconnection');
  }else{
    res.redirect('/profile/savedConnections');
  }
});


router.get('/connections', function (req, res) {
  var category = req.query._categoryName;
  console.log("category");
  var allItems = itemDB.getItems();
  if(category !== undefined && (category === "Indian Food" || category === "Italian Food")){

    res.render('connections',{category: category,data:itemDB.getConnections()});
  }else if(category !== undefined){
    res.send("No information available");
  }else{
    res.render('connections',{category: category,data:itemDB.getItems()});
  }
  });


  router.get('/about',function(req,res){
    res.render('about');
  });
  router.get('/contact',function(req,res){
    res.render('contact');
  });

router.get('/connectiondetail1',function(req,res){
  var ItemCode= req.query._foodId;
  var category = req.query._categoryName;
  var result=itemDB.getItem(ItemCode);
  if(Object.keys(req.query._foodId).length ===0){
    res.render('categories',{category: category,data:itemDB.getItems()});
  }
  else if (result == undefined){
    res.send('no item available');
  }

  else{
  res.render('connectiondetail1',{result:result});
}
});

//exporting router
module.exports=router;
