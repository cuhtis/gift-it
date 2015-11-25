var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');

var User = mongoose.model('User');
var List = mongoose.model('List');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/login', function(req, res, next) {
  if (req.user) res.redirect('/list');
  else res.render('login', { title: "Login" });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err,user) {
    if(user) {
      req.logIn(user, function(err) {
        res.redirect('/');
      });
    } else {
      res.render('login', { title: "Login", message:'Your login or password is incorrect.' });
    }          
  })(req, res, next);
});

router.get('/register', function(req, res, next) {
  if (req.user) res.redirect('/list');
  else res.render('register', { title: "Register" });
});

router.post('/register', function(req, res, next) {
  User.register(new User({username:req.body.username, display_name:req.body.display_name, email:req.body.email}), req.body.password, function(err, user){
    if (err) {
      console.log(err);
      res.render('register',{ title: "Register", message:'Your registration information is not valid' });
    } else {
      passport.authenticate('local')(req, res, function() {
        var wishlist = new List({
          list_owner: user._id,
          list_for: user._id,
          gifts: []
        });
        wishlist.save(function() {  
          user.wishlist = wishlist._id;      
          user.save(function() {
            res.redirect('/');
          });
        });
      });
    }      
  });
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

router.get('/settings', function(req, res, next) {
  res.render('settings', {title: "Settings"});
});

module.exports = router;
