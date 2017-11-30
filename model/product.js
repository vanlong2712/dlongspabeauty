const shortid = require('shortid');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("we're connected to productSchema!");
});

const ProductSchema = mongoose.Schema({
  shortid: {
    type: String,
    default: shortid.generate,
    unique: true
  },
  content_vn: {
    name: String,
    title: String,
    description: String,
    review: String
  },
  content_en: {
    name: String,
    title: String,
    description: String,
    review: String
  },
  tag: [String],
  ProductId: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
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
const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
