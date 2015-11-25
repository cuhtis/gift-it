var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var URLSlugs = require('mongoose-url-slugs');

var UserSchema = new mongoose.Schema({
  display_name: {type: String, required: true},
  email: {type: String, required: true},
  birthday: {type: Date, required: false},
  friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'Friend'}],
  wishlist: {type: mongoose.Schema.Types.ObjectId, ref: 'List'}
});

UserSchema.plugin(passportLocalMongoose);

mongoose.model('User', UserSchema);
