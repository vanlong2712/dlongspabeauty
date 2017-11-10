const shortid = require('shortid');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("we're connected to categorySchema!");
});

const CategorySchema = mongoose.Schema({
  shortid: {
    type: String,
    default: shortid.generate,
    unique: true
  },
  name_vn: String,
  name_en: String,
  parent: Boolean,
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }
  ],
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
const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
