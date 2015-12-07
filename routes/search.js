var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = mongoose.model('User');
var List = mongoose.model('List');
var Gift = mongoose.model('Gift');

router.get('/', function(req, res, next) {
  if (req.user) {
    res.redirect('/search/gift');
  } else {
    res.redirect('/login');
  }
});

router.get('/gift', function(req, res, next) {
  if (req.query.item) {
    Gift.find({ 'name': { '$regex': req.query.item, '$options': 'i' } }, function (err, gifts) {
      console.log(gifts);
      res.render('search/gift', {
        title: 'Search by Gift',
        page_title: 'Search by Gift',
        account: req.user,
        results: gifts
      });
    });
  } else {
    Gift.find({}, function(err, gifts) {
      res.render('search/gift', {
        title: 'Search by Gift',
        page_title: 'Search by Gift',
        account: req.user,
        results: gifts
      });
    });
  }
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
