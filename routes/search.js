var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = mongoose.model('User');
var Gift = mongoose.model('Gift');
var Tag = mongoose.model('Tag');
var Event = mongoose.model('Event');

router.get('/', function(req, res, next) {
  // Render page
  res.render('search/gift', {
    title: 'Search Gifts',
    page_title: 'Search Gifts'
  });
});

router.get('/gift_results', function(req, res, next) {
  // Find gifts
  Gift.find({ '$and': [ 
    { 'name': { '$regex': req.query.search_query, '$options': 'i' } },
    { 'is_private': false }
  ]}).populate('tags').exec(function (err, gifts) {
    if (err) { console.log(err); return res.send(500, 'Database error.'); }
    
    // Send AJAX response
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
  // Find tags
  Tag.find({ '$and': [
    { 'name': { '$regex': req.query.search_query, '$options': 'i' } },
    { 'is_private': false }
  ]}, function (err, tags) {
    if (err) { console.log(err); return res.send(500, 'Database error.'); }
    
    // Get tag ids
    tagIds = tags.map(function(tag) {
      return tag._id;
    });
    
    // Find gifts
    Gift.find({ '$and': [
      { 'tags': { '$in': tagIds } },
      { 'is_private': false }
    ]}).populate('tags').exec(function(err, gifts) {
      if (err) { console.log(err); return res.send(500, 'Database error.'); }

      // Send AJAX response
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
  // Find users
  User.find({ 
    'username': { '$regex': req.query.search_query, '$options': 'i' }
  }, function (err, users) {
    if (err) { console.log(err); return res.send(500, 'Database error.'); }

    // Send AJAX response
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
  // Find events
  Event.find({ '$and': [
    { 'name': { '$regex': req.query.search_query, '$options': 'i' } },
    { 'is_private': false }
  ]}).populate('tags').exec(function (err, events) {
    if (err) { console.log(err); return res.send(500, 'Database error.'); }
   
    // Send AJAX response 
    res.json(events.map(function(evt) {
      return {
        'name': capitalize(evt.name),
        'date': evt.date,
        'tags': evt.tags.map(function(tag) { return capitalize(tag.name); })
      };
    }));
  });
});

/** Helper Functions **/

function capitalize (str) {
  // Capitalize first letter, lowercase other letters
  return str.toLowerCase().replace( /\b\w/g, function (m) {
    return m.toUpperCase();
  });
}

module.exports = router;
