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
    if (err) next();
    var isMine = (req.params.username == user.username);
    res.render('user/profile', {
      title: isMine ? "My Account" : user.first_name + "'s Profile",
      page_title: isMine ? "My Account" : user.first_name + "'s Profile",
      account: user,
      myAccount: isMine,
      age: Math.floor(((new Date()) - (new Date(user.birthday)))/(1000 * 3600 * 24 * 365))
    });
  });
});

router.get('/:username/wishlist', function(req, res, next) {
  User.findOne({'username': req.params.username}, function(err, user) {
    if (user.wishlist) {
      List.findOne({ '_id': user.wishlist }, function(err, wishlist) {
        var idList = wishlist.gifts.map(function(item) {
          return item.gift;
        });
        Gift.find({ '_id': { $in : idList } }, function(err, giftList) {
          res.render('user/wishlist', {
            title: user.first_name + "'s Wishlist",
            page_title: user.first_name + "'s Wishlist",
            account: user,
            myAccount: (req.params.username == user.username),
            results: giftList
          });
        });
      });
    } else {
      var wishlist = new List({
        list_owner: user._id,
        gifts: []
      });
      wishlist.save(function() {
        res.render('user/wishlist', {
          title: user.first_name + "'s Wishlist",
          page_title: user.first_name + "'s Wishlist",
          account: user,
          myAccount: (req.params.username == user.username),
          results: []
        });
      });
    }
  });
});

router.get('/:username/wishlist/add', function(req, res, next) {
  if (!req.user) res.redirect('login');
  else {
    if (req.user.username != req.params.username)
      res.redirect('/unauth');
    res.render('user/wishlist_add', {
      title: "Add to Wishlist",
      page_title: "Add to Wishlist",
      show_nav: false
    });
  }
}); 

router.post('/:username/wishlist/add', function(req, res, next) {
  // TODO: Error catching/bad input
  
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
