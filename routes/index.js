var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var nodemailer = require('nodemailer');
var hbs_mail = require('nodemailer-express-handlebars');

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'gift.it.no.reply@gmail.com',
    pass: 'giftit12'
  }
});

transporter.use('compile', hbs_mail({
  viewPath: 'emails/',
  extName: '.hbs'
}));

var User = mongoose.model('User');

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Home',
    page_title: 'Gift It',
    main: true
  });
});

router.get('/login', function(req, res, next) {
  if (req.user) res.redirect('/list');
  else {
    var error = "";
    if (req.query.error === "invalid") error = "Your username or password is incorrect.";
    res.render('login', {
      title: "Login",
      page_title: "Login",
      show_nav: false,
      message: error
    });
  }
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err,user) {
    if(user) {
      req.logIn(user, function(err) {
        res.redirect('/');
      });
    } else {
      res.redirect('/login?error=invalid');
    }          
  })(req, res, next);
});

router.get('/register', function(req, res, next) {
  if (req.user) res.redirect('/list');
  else {
    var error = "";
    if (req.query.error === "verify_pw") error = error + "Passwords must match. ";
    if (req.query.error === "invalid") error = error + "Your registration information is invalid. ";
    res.render('register', {
      title: "Register",
      page_title: "Register",
      show_nav: false,
      message: error
    });
  }
});

router.post('/register', function(req, res, next) {
  if (req.body.password !== req.body.verify_password) {
    res.redirect('/register?error=verify_pw');
    return;
  }
  User.register(new User({
    username: req.body.username,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    birthday: req.body.birthday 
  }), req.body.password, function(err, user){
    if (err) {
      console.log(err);
      res.redirect('/register?error=invalid');
    } else {
      passport.authenticate('local')(req, res, function() {
        transporter.sendMail({
          from: 'gift.it.no.reply@gmail.com',
          to: user.email,
          subject: 'Welcome to Gift It!',
          template: 'first_join',
          context: {
            name: user.first_name
          }
        }, function (err, info) {
          if (err) return console.log(error); 
          console.log('Message sent', info.response);
        });
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
  if (!req.user) res.redirect('/login');
  else {
    res.render('settings', {
      title: "Settings",
      page_title: "Settings"
    });
  }
});

router.post('/settings', function(req, res, next) {
  console.log(req.body.birthday);
  User.findOneAndUpdate({ 'username': req.user.username }, {
    'first_name': req.body.first_name,
    'last_name': req.body.last_name,
    'email': req.body.email,
    'birthday': req.body.birthday
  }, function (err, user) {
    console.log(user);
    res.redirect('/');
  });
});

router.get('/change_password', function(req, res, next) {
  if (!req.user) res.redirect('/login');
  else {
    res.render('change_password', {
      title: "Change Password",
      page_title: "Change Password"
    });
  }
});

router.post('/change_password', function(req, res, next) {
  // TODO
  res.redirect('/');
});

module.exports = router;
