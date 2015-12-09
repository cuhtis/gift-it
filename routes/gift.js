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
    getGiftList (req.user.giftlist, true, function (err, gifts) {
      if (err) { console.log(err); return res.send(500, 'Database error.'); }

      // Find events
      getEventList (req.user.eventlist, true, function (err, events) {
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
    getEventList(req.user.eventlist, false, function (err, events) {
      if (err) { console.log(err); return res.send(500, 'Database error.'); }
    
      // Render page
      res.render('gift/gift_add', {
        title: "Add Gift",
        page_title: "Add Gift",
        show_nav: false,
        events: parseEvents(events, true)
      });
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
     
      // Generate Event Ids array
      var event_ids = [];
      if (Array.isArray(req.body.evt)) {
        req.body.evt.forEach(function(evt) {
          if (evt !== "") event_ids.push(evt);
        });
      } else if (req.body.evt !== "") event_ids.push(req.body.evt);

      // Find and update events
      Event.update({
        '_id': { '$in' : event_ids }
      }, {
        '$push': { 'giftlist' : newGift._id }
      }, { 'multi': true }, function (err) {
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
    getGiftList(req.user.giftlist, false, function (err, gifts) {
      if (err) { console.log(err); return res.send(500, 'Database error.'); }

      // Render page
      res.render('gift/event_add', {
        title: "Add Event",
        page_title: "Add Event",
        show_nav: false,
        gifts: parseGifts(gifts, true)
      });
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

      // Add gifts to event
      newEvent.giftlist = [];
      if (Array.isArray(req.body.gift)) {
        req.body.gift.forEach(function(g) {
          if (g !== "") newEvent.giftlist.push(g);
        });
      } else if (req.body.gift !== "") newEvent.giftlist.push(req.body.gift);

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
    Gift.findOne({
      '_id': req.query.id 
    }).populate('tags').exec(function (err, gift) {
      if (err) { console.log(err); return res.send(500, 'Database error.'); }
      
      // Render page
      res.render('gift/gift_info', {
        title: capitalize(gift.name),
        page_title: capitalize(gift.name),
        gift: {
          'id': gift._id,
          'name': capitalize(gift.name),
          'price': toDollars(gift.price),
          'tags': gift.tags.map(function (tag) { return tag.name; }).join(', ')
        }
      });
    });
  }
});

router.get('/event_info', function(req, res, next) {
  // Check that a query id was passed in
  if (!req.query.id) res.redirect('/');
  else {
    // Find event
    Event.findOne({ 
      '_id': req.query.id 
    }).populate('tags').populate('giftlist').exec(function (err, evt) {
      if (err) { console.log(err); return res.send(500, 'Database error.'); }
     
      Tag.populate(evt.giftlist, { 'path': 'tags' }, function (err) {
        if (err) { console.log(err); return res.send(500, 'Database error.'); }

        // Render page
        res.render('gift/event_info', {
          title: capitalize(evt.name),
          page_title: capitalize(evt.name),
          evt: {
            'name': capitalize(evt.name),
            'date': evt.date,
            'tags': evt.tags.map(function (tag) { return tag.name; }).join(', '),
          },
          gift: parseGifts(evt.giftlist)
        });
      });
    });
  }
});

/** Helper Functions **/

function getGiftList (list, tags, callback) {
  // Find gifts
  var query = Gift.find({
    '_id': { $in: list } 
  });
  
  // Optionally populate tags
  if (tags) query.populate('tags');
    
  // Run query
  query.exec(function (err, gifts) {
    if (err) { console.log(err); return res.send(500, 'Database error.'); }
    
    // Continue calls
    callback.call(this, err, gifts);
  });
}

function getEventList (list, tags, callback) {
  // Find gifts
  var query = Event.find({
    '_id': { $in: list } 
  });
  
  // Optionally populate tags
  if (tags) query.populate('tags');
  
  // Run query
  query.exec(function (err, evts) {
    if (err) { console.log(err); return res.send(500, 'Database error.'); }
    
    // Continue calls
    callback.call(this, err, evts);
  });
}

function parseGifts (gifts, id) {
  return gifts.map(function (gift) {
    // Return parsed gift object
    return {
      id: gift._id,
      name: capitalize(gift.name),
      price: toDollars(gift.price),
      tags: gift.tags.map(function (tag) { 
        return id ? tag : capitalize(tag.name); 
      }).join(', ')
    };
  });
}

function parseEvents (events, id) {
  return events.map(function (evt) {
    // Return parsed event object
    return {
      id: evt._id,
      name: capitalize(evt.name),
      date: evt.date,
      tags: evt.tags.map(function (tag) { 
        return id ? tag : capitalize(tag.name); 
      }).join(', ')
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

function toDollars (price) {
  var priceStr = "";
  if (!price) priceStr = "N/A";
  else for (var i = price; i > 0; i--) priceStr = priceStr + "$";
  return priceStr;
}
module.exports = router;
