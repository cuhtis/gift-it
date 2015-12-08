var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// Mongoose models
var User = mongoose.model('User');
var Gift = mongoose.model('Gift');
var Tag = mongoose.model('Tag');
var Event = mongoose.model('Event');

router.get('/', function(req, res, next) {
  // Must be logged in
  if (!req.user) res.redirect('/login');
  else {
    // Find gifts
    Gift.find({
      '_id': { $in: req.user.giftlist } 
    }).populate('tags').exec(function (err, gifts) {
      if (err) { console.log(err); return res.send(500, 'Database error.'); }

      // Find events
      Event.find({
        '_id': { $in: req.user.eventlist }
      }).populate('tags').exec(function (err, events) {
        if (err) { console.log(err); return res.send(500, 'Database error.'); }

        // Render page
        res.render('gift/gift', {
          title: "My Gifts",
          page_title: "My Gifts",
          gifts: parseGifts(gifts),
          events: parseEvents(events)
        });
      });
    });
  }
});

router.get('/add', function(req, res, next) {
  // Must be logged in
  if (!req.user) res.redirect('/login');
  else {
    // Render page
    res.render('gift/gift_add', {
      title: "Add Gift",
      page_title: "Add Gift",
      show_nav: false
    });
  }
});

router.post('/add', function(req, res, next) {
  // Must be logged in
  if (!req.user) res.redirect('/login');
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

        // Add gift to user's giftlist
        if (!req.user.giftlist) req.user.giftlist = [];
        req.user.giftlist.push(newGift._id);
        
        // Save user
        req.user.save(function(err) {
          if (err) { console.log(err); return res.send(500, 'Database error.'); }
          res.redirect('/gift');
        });
      });
    });
  }
});

router.post('/remove', function(req, res, next) {
  // Must be logged in
  if (!req.user) res.send(500, 'Error occurred: database error.');
  else {
    // Check that gift is in list
    var i = req.user.giftlist.indexOf(req.body.id);
    if (i < 0) res.send(500, 'Error occurred: database error.');

    else {
      // Remove gift from user's giftlist
      req.user.giftlist.splice(i, 1);

      // Save user
      req.user.save(function(err) {
        if (err) { console.log(err); return res.send(500, 'Database error.'); }
        res.json({ success: true });
      });
    }
  }
});

router.get('/add_event', function(req, res, next) {
  // Must be logged in
  if (!req.user) res.redirect('/login');
  else {
    // Render page
    res.render('gift/event_add', {
      title: "Add Event",
      page_title: "Add Event",
      show_nav: false
    });
  }
});

router.post('/add_event', function(req, res, next) {
  // Must be logged in
  if (!req.user) res.redirect('/login');
  else {
    // Create event
    var newEvent = new Event({
      name: capitalize(req.body.name),
      owner: req.user._id,
      date: req.body.date, //TODO: Date parsing
      is_private: (req.body.privacy === "private")
    });
    
    // Create tags
    createTags(req.body.tag, function (err, tags) {
      if (err) { console.log(err); return res.send(500, 'Database error.'); }

      // Add tags to event
      newEvent.tags = tags.ops.map(function(t) { return t._id });

      // Save event
      newEvent.save(function(err) {
        if (err) { console.log(err); return res.send(500, 'Database error.'); }

        // Add event to user's eventlist
        if (!req.user.eventlist) req.user.eventlist = [];
        req.user.eventlist.push(newEvent._id);

        // Save user
        req.user.save(function(err) {
          if (err) { console.log(err); return res.send(500, 'Database error.'); }
          res.redirect('/gift');
        });
      });
    });
  }
});

router.post('/remove_event', function(req, res, next) {
  // Must be logged in
  if (!req.user) res.send(500, 'Error occurred: database error.');
  else {
    // Check event is in eventlist
    var i = req.user.eventlist.indexOf(req.body.id);
    if (i < 0) res.send(500, 'Error occurred: database error.');
    else {
      // Remove event from eventlist
      req.user.eventlist.splice(i, 1);

      // Save user
      req.user.save(function(err) {
        if (err) { console.log(err); return res.send(500, 'Database error.'); }
        res.json({ success: true });
      });
    }
  }
});

router.get('/info', function(req, res, next) {
  // Check that a query id was passed in
  if (!req.query.id) res.redirect('/');
  else {
    // Find gift
    Gift.findOne({ '_id': req.query.id }, function (err, gift) {
      if (err) { console.log(err); return res.send(500, 'Database error.'); }
      
      // Render page
      res.render('gift/gift_info', {
        title: capitalize(gift.name),
        page_title: capitalize(gift.name),
        gift: gift
      });
    });
  }
});

/** Helper Functions **/

function getGiftList (list, callback) {
  // Find gifts
  Gift.find({
    '_id': { $in: list } 
  }).populate('tags').exec(function (err, gifts) {
    if (err) { console.log(err); return res.send(500, 'Database error.'); }
    
    // Continue calls
    callback.call(this, err, gifts);
  });
}

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

function parseEvents (events) {
  return events.map(function (evt) {
    // Return parsed event object
    return {
      id: evt._id,
      name: capitalize(evt.name),
      tags: evt.tags.map(function (tag) { return capitalize(tag.name); }).join(', ')
    };
  })
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
  // Capitalize first letter, lowercase other letters
  return str.toLowerCase().replace( /\b\w/g, function (m) {
    return m.toUpperCase();
  });
}

module.exports = router;
