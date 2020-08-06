var express = require('express');
var app = express();
var path = require('path');
var itemDB= require('./utility/itemDB');
var viewPath = path.join(__dirname, './views');
var session = require('express-session');
var cookieparser = require('cookie-parser');
var mongoose= require('mongoose');
mongoose.connect('mongodb://localhost/manjusha1');
var profileController = require("./routes/profileController");
app.use(cookieparser());
app.use(session({
    secret: 'fooddetails',
    proxy: true,
    resave: true,
    saveUninitialized: true
}));




app.set("views",path.join(__dirname,"views"));
app.set('view engine','ejs');

app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});

app.use('/assets',express.static('assets'));
app.use('/partials', express.static('partials'));

app.use('/',profileController);
app.use('/profile',profileController);
app.use('/connections',profileController);
app.use('/savedConnections',profileController);
app.use('/about',profileController);
app.use('/contact',profileController);
app.use('/newConnection',profileController);
app.use('/connectiondetail1',profileController);
app.use('/connectiondetail1/:ID',profileController);
app.use('/login',profileController);
app.use('/*',profileController);
app.listen(3000);
console.log("App is listening at 3000");

module.exports = app;




