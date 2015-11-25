var mongoose = require('mongoose');

var Gift = new mongoose.Schema({
  name: String,
  price: Number,
  url: String
});

mongoose.model('Gift', Gift);
