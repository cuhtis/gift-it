var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.redirect('/user/' + user.username);
});

router.get('/:username', function(req, res, next) {
  res.render('user', {username: req.params.username});
});

router.get('/:username/wishlist', function(req, res, next) {
  res.render('wishlist');
});

module.exports = router;
