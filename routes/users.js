var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = mongoose.model('User');
var List = mongoose.model('List');
var Gift = mongoose.model('Gift');

router.get('/', function(req, res, next) {
  if (req.user) {
    res.redirect('/user/' + req.user.username);
  } else {
    res.redirect('/login');
  }
});

router.get('/:username', function(req, res, next) {
  User.findOne({'username': req.params.username}, function(err, user) {
    res.render('user/profile', { title: user.display_name + "'s Profile", account: user });
  });
});

router.get('/:username/wishlist', function(req, res, next) {
  User.findOne({'username': req.params.username}, function(err, user) {
    var isMine = (req.params.username == user.username);
    List.findOne({ _id: user.wishlist }, function(err, list) {
      var giftList = list.gifts.map(function(item) {
        
      });
      res.render('user/wishlist', { title: user.display_name + "'s Wishlist", account: user, myAccount: isMine, gifts: giftList });
    });
  });
});

router.get('/:username/wishlist/add', function(req, res, next) {
  res.render('user/wishlist_add', { title: "Add to Wishlist" });
});

router.post('/:username/wishlist/add', function(req, res, next) {
  User.findOne({'username': req.params.username}, function(err, user) {
    var gift = new Gift({ name: req.body.gift, url: req.body.link });
    gift.save(function(){
      List.findOneAndUpdate({_id: user.wishlist}, {$push: {gifts: {gift: gift}}}, function() {
        res.redirect('/user/' + req.params.username + '/wishlist');
      });
    });
  });
});

module.exports = router;
