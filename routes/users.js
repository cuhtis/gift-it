var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = mongoose.model('User');
var Gift = mongoose.model('Gift');
var Tag = mongoose.model('Tag');

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
    var isMine = req.user ? (req.params.username == req.user.username) : false;
    res.render('user/profile', {
      title: isMine ? "My Account" : capitalize(user.first_name) + "'s Profile",
      page_title: isMine ? "My Account" : capitalize(user.first_name) + "'s Profile",
      account: user,
      myAccount: isMine,
      age: Math.floor(((new Date()) - (new Date(user.birthday)))/(1000 * 3600 * 24 * 365)),
      isFriend: req.user ? (req.user.friends.indexOf(user._id) >= 0) : false
    });
  });
});

router.get('/:username/wishlist', function(req, res, next) {
  User.findOne({'username': req.params.username}, function(err, user) {
    Gift.find({
      '_id': { $in : user.wishlist } 
    }).populate('tags').exec(function (err, gifts) {
      console.log(gifts);
      res.render('user/wishlist', {
        title: capitalize(user.first_name) + "'s Wishlist",
        page_title: capitalize(user.first_name) + "'s Wishlist",
        account: user,
        myAccount: req.user ? (req.params.username == req.user.username) : false,
        gifts: gifts.map(function (gift) {
          var priceStr = "";
          if (!gift.price) priceStr = "N/A";
          else for (var i = gift.price; i > 0; i--) priceStr = priceStr + "$";
          return {
            id: gift._id,
            name: capitalize(gift.name),
            price: priceStr,
            tags: gift.tags.map(function (tag) { return capitalize(tag.name); }).join(', ')
          };
        })
      });
    });
  });
});

router.get('/:username/wishlist/add', function(req, res, next) {
  if (!req.user) res.redirect('login');
  else {
    if (req.user.username !== req.params.username)
      res.redirect('/user/' + req.params.username);
    else {
      res.render('user/wishlist_add', {
        title: "Add to Wishlist",
        page_title: "Add to Wishlist",
        show_nav: false
      });
    }
  }
}); 

router.post('/:username/wishlist/add', function(req, res, next) {
  if (!req.user || req.user.username !== req.params.username) res.redirect('/user/' + req.params.username);
  else {
    var newGift = new Gift({
      name: capitalize(req.body.gift),
      price: parseInt(req.body.price)
    });
    newGift.is_private = (req.body.privacy === "private");
    var tags = [];
    req.body.tag.forEach(function(tag) {
      if (tag !== "") {
        tags.push({
          name: capitalize(tag),
          is_private: false
        });
      }
    });
    Tag.collection.insert(tags, function(err, t) {
      newGift.tags = t.ops.map(function(ele) { return ele._id });
      newGift.save(function() {
        if (!req.user.wishlist) req.user.wishlist = [];
        req.user.wishlist.push(newGift._id);
        req.user.save(function() {
          res.redirect('/user/' + req.params.username + '/wishlist');
        });
      });
    });
  }
});

router.get('/:username/add_friend', function(req, res, next) {
  if(!req.user) res.redirect('/login');
  else if (req.user.username === req.params.username) res.redirect('/user/' + req.params.username);
  else {
    User.findOne({
      'username': req.params.username
    }, function(err, user) {
      if (req.user.friends.indexOf(user._id) < 0) {
        req.user.friends.push(user._id);
        req.user.save(function() {
          res.redirect('/user/' + req.params.username);
        });
      } else res.redirect('/user/' + req.params.username);
    });
  }
});

function capitalize (str) {
  return str.toLowerCase().replace(/\b\w/g, function (m) {
    return m.toUpperCase();
  });
}

module.exports = router;
