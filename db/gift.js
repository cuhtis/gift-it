var mongoose = require('mongoose');

var Gift = new mongoose.Schema({
  name: {type: String, required: true},
  price: {type: Number, required: false},
  url: {type: String, required: false}
});

mongoose.model('Gift', Gift);
