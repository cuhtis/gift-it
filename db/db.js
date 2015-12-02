var mongoose = require('mongoose');

require('./gift');
require('./list');
require('./user');
require('./friend');
require('./tag');

mongoose.connect('mongodb://localhost/project');
