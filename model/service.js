const shortid = require('shortid');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('we\'re connected to serviceSchema!');
});

const serviceSchema = mongoose.Schema({
    shortid: {
      type: String,
      default: shortid.generate,
      unique: true
    },
    name: String,
    title: String,
    title_SEO: String,
    time: String,
    price: String,
    duration: String,
    description: String,
    content: String,
    isEnabled: {
      type: Boolean,
      default: false
    },
    Coupon: [{isCoupon: Boolean, nameOfCoupon: String, percent: Number, expires: String }],
    icon: String,
    images: [String],
    keywords: String,
    created_at : {
      type: Date,
      default: Date.now
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
});


// create model
const service = mongoose.model('Service',serviceSchema);

module.exports = service;
