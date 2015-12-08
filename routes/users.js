var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = mongoose.model('User');
var Gift = mongoose.model('Gift');
var Tag = mongoose.model('Tag');

router.get('/', function(req, res, next) {
  // Redirect to user profile or login page
  if (req.user) {
    res.redirect('/user/' + req.user.username);
  } else {
    res.redirect('/login');
  }
});

router.get('/:username', function(req, res, next) {
  // Find user
  User.findOne({'username': req.params.username}, function(err, user) {
    if (err) next();

    // Render page
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
  // Find user
  User.findOne({'username': req.params.username}, function(err, user) {
    if (err) { console.log(err); return res.send(500, 'Database error.'); }
    
    // Find gifts
    Gift.find({
      '_id': { $in : user.wishlist } 
    }).populate('tags').exec(function (err, gifts) {
      if (err) { console.log(err); return res.send(500, 'Database error.'); }

      // Render page
      res.render('user/wishlist', {
        title: capitalize(user.first_name) + "'s Wishlist",
        page_title: capitalize(user.first_name) + "'s Wishlist",
        account: user,
        myAccount: req.user ? (req.params.username == req.user.username) : false,
        gifts: parseGifts(gifts)
      });
    });
  });
});

router.get('/:username/wishlist/add', function(req, res, next) {
  // Must be logged in
  if (!req.user) res.redirect('login');
  else {
    // Must be correct user
    if (req.user.username !== req.params.username)
      res.redirect('/user/' + req.params.username);
    else {
      // Render page
      res.render('user/wishlist_add', {
        title: "Add to Wishlist",
        page_title: "Add to Wishlist",
        show_nav: false
      });
    }
  }
}); 

router.post('/:username/wishlist/add', function(req, res, next) {
  // Must be logged in and be correct user
  if (!req.user || req.user.username !== req.params.username) res.redirect('/user/' + req.params.username);
  else {
    // Create gift
    var newGift = new Gift({
      name: capitalize(req.body.gift),
      owner: req.user._id,
      price: parseInt(req.body.price),
      is_private: (req.body.privacy === "private")
    });
    
    // Create tags
    createTags(req.body.tag, function (err, tags) {
      if (err) { console.log(err); return res.send(500, 'Database error.'); }
      
      // Add tags to gift
      newGift.tags = tags.ops.map(function(t) { return t._id });

      // Save gift
      newGift.save(function(err) {
        if (err) { console.log(err); return res.send(500, 'Database error.'); }
        
        // Add gift to user's wishlist
        if (!req.user.wishlist) req.user.wishlist = [];
        req.user.wishlist.push(newGift._id);

        // Save user
        req.user.save(function(err) {
          if (err) { console.log(err); return res.send(500, 'Database error.'); }
          res.redirect('/user/' + req.params.username + '/wishlist');
        });
      });
    });
  }
});

router.get('/:username/add_friend', function(req, res, next) {
  // Must be logged in
  if(!req.user) res.redirect('/login');
  // Must not be same user
  else if (req.user.username === req.params.username) res.redirect('/user/' + req.params.username);
  else {
    // Find user
    User.findOne({
      'username': req.params.username
    }, function(err, user) {
      if (err) { console.log(err); return res.send(500, 'Database error.'); }

      // If not already friends
      if (req.user.friends.indexOf(user._id) < 0) {
        // Add to user's friendlist
        req.user.friends.push(user._id);

        // Save user
        req.user.save(function(err) {
          if (err) { console.log(err); return res.send(500, 'Database error.'); }
          res.redirect('/user/' + req.params.username);
        });
      } else res.redirect('/user/' + req.params.username);
    });
  }
});

/** Helper Functions **/

function parseGifts (gifts) {
  return gifts.map(function (gift) {
    // Create price string
    var priceStr = "";
    if (!gift.price) priceStr = "N/A";
    else for (var i = gift.price; i > 0; i--) priceStr = priceStr + "$";

    // Return parsed gift object
    return {
      id: gift._id,
      name: capitalize(gift.name),
      price: priceStr,
      tags: gift.tags.map(function (tag) { return capitalize(tag.name); }).join(', ')
    };
  });
}

function createTags (taglist, callback) {
  var tags = [];

  // Multiple tags
  if (Array.isArray(taglist)) {
    taglist.forEach(function(tag) {
      if (tag !== "") {
        tags.push({
          name: capitalize(tag),
          is_private: false
        });
      }
    });
  // Single tag
  } else tags.push({
    name: capitalize(taglist),
    is_private: false
  });
 
  // Save all tags
  Tag.collection.insert(tags, callback);
}

function capitalize (str) {
  return str.toLowerCase().replace(/\b\w/g, function (m) {
    return m.toUpperCase();
  });
}

module.exports = router;
