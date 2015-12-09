var mongoose = require('mongoose');

var Tag = new mongoose.Schema({
  name: {type: String, required: true},
  is_private: {type: Boolean, default: false, required: true},
  type: {type: String, enum: [
    'Person', 'Category', 'Event', 'Description', 'Other'
  ], default: 'Other'}
});

mongoose.model('Tag', Tag);
