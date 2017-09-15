global.mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://d.long271293@gmail.com:025334886@ds137464.mlab.com:37464/heroku_95s7sgd9'|| 'mongodb://localhost:27017/spabeauty');

module.exports = {mongoose};
