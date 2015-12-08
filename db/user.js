var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var URLSlugs = require('mongoose-url-slugs');

var UserSchema = new mongoose.Schema({
  first_name: {type: String, required: true},
  last_name: {type: String, required: false},
  email: {type: String, required: true},
  birthday: {type: String, required: true},
  friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'Friend'}],
  giftlist: [{type: mongoose.Schema.Types.ObjectId, ref: 'Gift'}],
  wishlist: [{type: mongoose.Schema.Types.ObjectId, ref: 'Gift'}],
  options: {
    notify_me: {type: Boolean, default: true},
    notify_time: {type: Number, default: 3}
  }
});

UserSchema.plugin(passportLocalMongoose);

mongoose.model('User', UserSchema);
