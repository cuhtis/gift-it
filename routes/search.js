var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = mongoose.model('User');
var List = mongoose.model('List');
var Gift = mongoose.model('Gift');

router.get('/', function(req, res, next) {
  res.render('search/gift', {
    title: 'Search Gifts',
    page_title: 'Search Gifts'
  });
});

router.get('/gift_results', function(req, res, next) {
  Gift.find({ 
    'name': { '$regex': req.query.search_query, '$options': 'i' }
  }, function (err, gifts) {
    // TODO: Error handling
    console.log(gifts);
    res.json(gifts.map(function(gift) {
      return {
        'name': gift.name
      };
    }));
  });
});

router.get('/tag', function(req, res, next) {
  res.render('search/gift', {
    title: 'Search by Tag',
    page_title: 'Search by Tag',
    account: req.user
  });
});

router.get('/user', function(req, res, next) {
  res.render('search/gift', {
    title: 'Search by User',
    page_title: 'Search by User',
    account: req.user
  });
});

module.exports = router;
