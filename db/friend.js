var mongoose = require('mongoose');

var Friend = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: false},
  birthday: {type: String, required: false},
  account: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  events: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}],
  gifts: {type: mongoose.Schema.Types.ObjectId, ref: 'List'}
});

mongoose.model('Friend', Friend);
