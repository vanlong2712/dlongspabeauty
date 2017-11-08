const shortid = require('shortid');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("we're connected to serviceSchema!");
});

const serviceSchema = mongoose.Schema({
  shortid: {
    type: String,
    default: shortid.generate,
    unique: true
  },
  name_url: String,
  title_SEO: String,
  content_vn: {
    name: String,
    title: String,
    time: String,
    price: String,
    duration: String,
    description: String,
    content: String,
    keywords: String,
  },
  content_en: {
    name: String,
    title: String,
    time: String,
    price: String,
    duration: String,
    description: String,
    content: String,
    keywords: String,
  },
  isEnabled: {
    type: Boolean,
    default: false
  },
  Coupon: [
    {
      isCoupon: Boolean,
      nameOfCoupon: String,
      percent: Number,
      expires: String
    }
  ],
  icon: String,
  images: [String],
  created_at: {
    type: Date,
    default: Date.now
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// create model
const service = mongoose.model('Service', serviceSchema);

module.exports = service;
