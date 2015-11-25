var mongoose = require('mongoose');

require('./gift');
require('./list');
require('./user');
require('./friend');

mongoose.connect('mongodb://localhost/project');
