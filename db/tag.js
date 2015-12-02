var mongoose = require('mongoose');

var Tag = new mongoose.Schema({
  name: {type: String, required: true},
  type: {type: String, enum: [
    'Occasion',
    'Relationship',
    'Type',
    'User'
  ], required: true},
  is_private: {type: Boolean, default: false, required: true}
});

mongoose.model('Tag', Tag);
