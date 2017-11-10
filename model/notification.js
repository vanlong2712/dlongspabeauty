const shortid = require('shortid');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("we're connected to notificationSchema!");
});

const NotificationSchema = mongoose.Schema({
  message: String,
  type: {
    type: Number,
    default: 0 // 0 is normal
  },
  basedId: [mongoose.Schema.Types.ObjectId],
  date: {
    type: Date,
    default: Date.now
  }
});

// create model
const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;
