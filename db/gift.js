var mongoose = require('mongoose');

var Gift = new mongoose.Schema({
  name: {type: String, required: true},
  price: {type: Number, required: false},
  tags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}],
  is_private: {type: Boolean, default: false, required: true}
});

mongoose.model('Gift', Gift);
