var mongoose = require('mongoose');

var Gift = new mongoose.Schema({
  name: {type: String, required: true},
  url: {type: String, required: false}
});

mongoose.model('Gift', Gift);
