var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = mongoose.model('User');
var Gift = mongoose.model('Gift');
var Tag = mongoose.model('Tag');

router.get('/', function(req, res, next) {
  res.render('search/gift', {
    title: 'Search Gifts',
    page_title: 'Search Gifts'
  });
});

router.get('/gift_results', function(req, res, next) {
  Gift.find({ '$and': [ 
    { 'name': { '$regex': req.query.search_query, '$options': 'i' } },
    { 'is_private': false }
  ]}).populate('tags').exec(function (err, gifts) {
    // TODO: Error handling
    res.json(gifts.map(function(gift) {
      return {
        'id': gift._id,
        'name': capitalize(gift.name),
        'price': gift.price,
        'tags': gift.tags.map(function(tag) { return capitalize(tag.name); })
      };
    }));
  });
});

router.get('/tag_results', function(req, res, next) {
  Tag.find({ '$and': [
    { 'name': { '$regex': req.query.search_query, '$options': 'i' } },
    { 'is_private': false }
  ]}, function (err, tags) {
    // TODO: Error handling
    tagIds = tags.map(function(tag) {
      return tag._id;
    });
    Gift.find({ '$and': [
      { 'tags': { '$in': tagIds } },
      { 'is_private': false }
    ]}).populate('tags').exec(function(err, gifts) {
      // TODO: Error handling
      res.json(gifts.map(function(gift) {
        return {
          'id': gift._id,
          'name': capitalize(gift.name),
          'price': gift.price,
          'tags': gift.tags.map(function(tag) { return capitalize(tag.name); }) 
        };
      }));
    });
  });
});

router.get('/user_results', function(req, res, next) {
  User.find({ 
    'username': { '$regex': req.query.search_query, '$options': 'i' }
  }, function (err, users) {
    // TODO: Error handling
    res.json(users.map(function(user) {
      return {
        'username': user.username,
        'name': capitalize(user.first_name) + ' ' + capitalize(user.last_name),
        'email': user.email
      };
    }));
  });
});

router.get('/event_results', function(req, res, next) {
  Gift.find({ 
    'name': { '$regex': req.query.search_query, '$options': 'i' }
  }, function (err, gifts) {
    // TODO: Error handling
    console.log(gifts);
    res.json(gifts.map(function(gift) {
      return {
        'name': capitalize(gift.name)
      };
    }));
  });
});

function capitalize (str) {
  return str.toLowerCase().replace( /\b\w/g, function (m) {
    return m.toUpperCase();
  });
}

module.exports = router;
