var mongoose = require('mongoose');

var Event = new mongoose.Schema({
  name: {type: String, required: true},
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  date: {type: Date, required: true},
  tags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}],
  is_private: {type: Boolean, default: false, required: true},
  giftlist: [{type: mongoose.Schema.Types.ObjectId, ref: 'Gift'}]
});

mongoose.model('Event', Event);
