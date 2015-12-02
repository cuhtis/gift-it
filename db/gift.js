var mongoose = require('mongoose');

var Gift = new mongoose.Schema({
  name: {type: String, required: true},
  price: {type: Number, required: false},
  url: {type: String, required: false},
  tags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}]
});

mongoose.model('Gift', Gift);
