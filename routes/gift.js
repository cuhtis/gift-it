var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = mongoose.model('User');
var List = mongoose.model('List');
var Gift = mongoose.model('Gift');
var Tag = mongoose.model('Tag');

router.get('/', function(req, res, next) {
  if (!req.user) res.redirect('/login');
  else {
    User.findOne({ 'username': req.user.username }, function (err, user) {
      if (user.giftList) {
        List.findOne({ '_id': user.giftlist }, function (err, giftList) {
          var idList = giftList.gifts.map(function (ele) {
            return ele.gift;
          });
          Gift.find({ '_id': { $in: idlist } }, function (err, gifts) {
            res.render('gift/gift', {
              title: "My Gifts",
              page_title: "My Gifts",
              gifts: gifts
            });
          });
        });
      } else {
        var list = new List({
          list_name: "Public List",
          list_owner: user._id,
          gifts: []
        });
        list.save(function() {
          res.render('gift/gift', {
            title: "My Gifts",
            page_title: "My Gifts",
            gifts: []
          });
        });
      }
    });
  }
});

router.get('/add', function(req, res, next) {
  if (!req.user) res.redirect('/login');
  else {
    res.render('gift/gift_add', {
      title: "Add Gift",
      page_title: "Add Gift"
    });
  }
});

router.post('/add', function(req, res, next) {
  var newGift = new Gift({
    name: req.body.gift,
    price: parseInt(req.body.price)
  });
  newGift.is_private = (req.body.privacy === "private");
  var tags = [];
  req.body.tag.forEach(function(tag) {
    tags.push({
      name: tag,
      is_private: false
    });
  });
  Tag.collection.insert(tags, function(err, t) {
    newGift.tags = t.ops.map(function(ele) { return ele._id });
    newGift.save(function() {
      res.redirect('/gift');
    });
  });
});

router.get('/info', function(req, res, next) {
  if (!req.query.id) res.redirect('/');
  else {
    Gift.findOne({ '_id': req.query.id }, function (err, gift) {
      // TODO: Catch err
      res.render('gift/gift_info', {
        title: "Gift Information",
        page_title: "Gift Information",
        gift: gift
      });
    });
  }
});

module.exports = router;
