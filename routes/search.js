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
  res.render('search/gift', {
    title: 'Search by Gift',
    page_title: 'Search by Gift',
    account: user
  });
});

module.exports = router;
