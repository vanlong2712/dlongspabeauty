global.mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/spabeauty'
);
// mongoose.connect('mongodb://demo:demo@ds141264.mlab.com:41264/spabeauty');
module.exports = { mongoose };
