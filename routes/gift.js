var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = mongoose.model('User');
var Gift = mongoose.model('Gift');
var Tag = mongoose.model('Tag');

router.get('/', function(req, res, next) {
  if (!req.user) res.redirect('/login');
  else {
    Gift.find({
      '_id': { $in: req.user.giftlist } 
    }).populate('tags').exec(function (err, gifts) {
      res.render('gift/gift', {
        title: "My Gifts",
        page_title: "My Gifts",
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
  }
});

router.get('/add', function(req, res, next) {
  if (!req.user) res.redirect('/login');
  else {
    res.render('gift/gift_add', {
      title: "Add Gift",
      page_title: "Add Gift",
      show_nav: false
    });
  }
});

router.post('/add', function(req, res, next) {
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
      if (!req.user.giftlist) req.user.giftlist = [];
      req.user.giftlist.push(newGift._id);
      req.user.save(function() {
        res.redirect('/gift');
      });
    });
  });
});

router.get('/info', function(req, res, next) {
  if (!req.query.id) res.redirect('/');
  else {
    Gift.findOne({ '_id': req.query.id }, function (err, gift) {
      // TODO: Catch err
      res.render('gift/gift_info', {
        title: capitalize(gift.name),
        page_title: capitalize(gift.name),
        gift: gift
      });
    });
  }
});

function capitalize (str) {
  return str.toLowerCase().replace( /\b\w/g, function (m) {
    return m.toUpperCase();
  });
}

module.exports = router;
