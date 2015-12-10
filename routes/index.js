var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var nodemailer = require('nodemailer');
var hbs_mail = require('nodemailer-express-handlebars');

// Mongoose models
var User = mongoose.model('User');

// Nodemailer transporter, email config
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'gift.it.no.reply@gmail.com',
    pass: 'giftit12'
  }
});

// Email templates
transporter.use('compile', hbs_mail({
  viewPath: 'emails/',
  extName: '.hbs'
}));

router.get('/', function(req, res, next) {
  // Render page
  res.render('index', {
    title: 'Home',
    page_title: 'Gift It',
    main: true
  });
});

router.get('/login', function(req, res, next) {
  // Cannot be logged in
  if (req.user) res.redirect('/');
  else {
    // Display error message
    // FIXME: Move this to client-side verification
    var error = "";
    if (req.query.error === "invalid") error = "Your username or password is incorrect.";
    
    // Render page
    res.render('login', {
      title: "Login",
      page_title: "Login",
      show_nav: false,
      message: error
    });
  }
});

router.post('/login', function(req, res, next) {
  // Cannot be logged in
  if (req.user) res.redirect('/');
  else {
    // Authenticate
    passport.authenticate('local', function(err,user) {
      if(user) {
        // User found
        req.logIn(user, function(err) {
          // FIXME: Handle err
          if (err) { console.log(err); }
          res.redirect('/');
        });
      } else {
        // Cannot find user
        res.redirect('/login?error=invalid');
      }          
    })(req, res, next);
  }
});

router.get('/register', function(req, res, next) {
  // Cannot be logged in
  if (req.user) res.redirect('/');
  else {
    // Display error message
    var error = "";
    if (req.query.error === "invalid") error = error + "Your registration information is invalid. ";

    // Render page
    res.render('register', {
      title: "Register",
      page_title: "Register",
      show_nav: false,
      message: error
    });
  }
});

router.post('/register', function(req, res, next) {
  // Cannot be logged in
  if (req.user) res.redirect('/');
  else {
    // Verify input
    if(req.body.username.match(/^[a-zA-Z0-9]+$/) == null
        || req.body.password.match(/^[a-zA-Z0-9]+$/) == null
        || req.body.password !== req.body.verify_password
        || req.body.first_name.match(/^[a-zA-Z]+$/) == null
        || req.body.last_name.match(/^[a-zA-Z]+$/) == null
        || req.body.email.match(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+$/) == null
        || req.body.birthday.match == null || req.body.birthday == ""
        || new Date(req.body.birthday) > new Date()) {
      res.redirect('/register?error=invalid');
      return;
    }

    // Create user
    User.register(new User({
      username: req.body.username,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      birthday: req.body.birthday 
    }), req.body.password, function(err, user){
      // Error handling
      // FIXME: Handle err
      if (err) { console.log(err); return res.send(500, 'Database error.'); }
      
      // Login
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
    });
  }
});

router.get('/logout', function(req, res, next) {
  // Logout
  if (req.user) req.logout();
  res.redirect('/');
});

router.get('/help', function(req, res, next) {
  // Render page
  res.render('help', {
    title: "Help",
    page_title: "Help"
  });
});

router.get('/settings', function(req, res, next) {
  // Must be logged in
  if (!req.user) res.redirect('/login');
  else {
    // Render page
    res.render('settings', {
      title: "Settings",
      page_title: "Settings"
    });
  }
});

router.post('/settings', function(req, res, next) {
  // Must be logged in
  if (!req.user) res.redirect('/login');
  else {
    console.log(req.body);

    // Update user
    if (req.body.first_name) req.user.first_name = req.body.first_name;
    if (req.body.last_name) req.user.last_name = req.body.last_name;
    if (req.body.email) req.user.email = req.body.email;
    if (req.body.birthday) req.user.birthday = req.body.birthday;

    // Save user
    req.user.save(function (err, user) {
      if (err) { console.log(err); return res.send(500, 'Database error.'); }
      res.redirect('/');
    });
  }
});

router.get('/change_password', function(req, res, next) {
  // Must be logged in
  if (!req.user) res.redirect('/login');
  else {
    // Render page
    res.render('change_password', {
      title: "Change Password",
      page_title: "Change Password"
    });
  }
});

router.post('/change_password', function(req, res, next) {
  if (!req.user) res.redirect('/');
  else {
    // TODO
    
    res.redirect('/');
  }
});

module.exports = router;
