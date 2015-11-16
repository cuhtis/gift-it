var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.redirect('/');
});

router.get('/add', function(req, res, next) {
  res.render('add_gift');
});

router.get('/search', function(req, res, next) {
  res.render('search');
});

module.exports = router;
