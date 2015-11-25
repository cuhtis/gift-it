var mongoose = require('mongoose');

var List = new mongoose.Schema({
  list_owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  list_for: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  gifts: [{
    gift: {type: mongoose.Schema.Types.ObjectId, ref: 'Gift'},
    reason: String,
    date: Date
  }]
});

mongoose.model('List', List);
