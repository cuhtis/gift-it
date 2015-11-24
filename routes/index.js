var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Gift It' });
});

router.get('/login', function(req, res, next) {
  if (req.user) res.redirect('/list');
  else res.render('login');
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err,user) {
    if(user) {
      req.logIn(user, function(err) {
        res.redirect('/');
      });
    } else {
      res.render('login', {message:'Your login or password is incorrect.'});
    }          
  })(req, res, next);
});

router.get('/register', function(req, res, next) {
  if (req.user) res.redirect('/list');
  else res.render('register');
});

router.post('/register', function(req, res, next) {
  User.register(new User({username:req.body.username}), req.body.password, function(err, user){
    if (err) {
      res.render('register',{message:'Your registration information is not valid'});
    } else {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/');
      });
    }      
  });
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

router.get('/settings', function(req, res, next) {
  res.render('settings');
});

module.exports = router;
