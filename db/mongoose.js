global.mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/spabeauty');
mongoose.connect('mongodb://demospabeauty:demospabeauty123@ds141024.mlab.com:41024/heroku_fq5r90hd');
module.exports = {mongoose};
