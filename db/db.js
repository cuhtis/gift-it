var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var URLSlugs = require('mongoose-url-slugs');

// my schema goes here
var UserSchema = new mongoose.Schema({
  
});

UserSchema.plugin(passportLocalMongoose);

mongoose.model('User', UserSchema);

mongoose.connect('mongodb://localhost/project');
