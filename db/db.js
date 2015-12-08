var mongoose = require('mongoose');

require('./gift');
require('./user');
require('./tag');

mongoose.connect('mongodb://curtis:curtis@ds063134.mongolab.com:63134/heroku_qvj3wtvf');
