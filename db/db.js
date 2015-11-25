var mongoose = require('mongoose');

require('./gift');
require('./list');
require('./user');

mongoose.connect('mongodb://localhost/project');
