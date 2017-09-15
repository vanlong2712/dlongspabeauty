const bcrypt = require('bcryptjs');
const shortid = require('shortid');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('we\'re connected to userSchema!');
});

const UserSchema = mongoose.Schema({
  shortid: {
    type: String,
    default: shortid.generate,
    unique: true
  },
  email: {
    type: String,
    trim: true,
    unique: true
  },
  password: {
  type: String,
  trim: true
  },
  firstName: {
  type: String,
  trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  sex: {
    type: Number,
    trim: true
  },
  birthdate: {
    date: {
      type: Number,
    },
    month: {
      type: Number,
    },
    year: {
      type: Number,
    }

  },
  phone_number: {
    type: String,
    trim: true
  },
  role: {
    type: Number,
    default: 2,
    trim: true
  },
  isPriviledge: [String],
  created: {
    type : Date,
    default: Date.now
  },
  saved_product: [{
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product'
  }],
  CMND: String
});

// Methods

UserSchema.pre('save', function (next) {
  var user = this;

  if(user.isModified('password')) { // chỉ khi password bị chỉnh sửa thì mới hash password.
                                    // nếu ko sẽ phát sinh ra lỗi khi mỗi lần gọi save function
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      })
    })
  } else {
    next();
  }
});


// create model
const service = mongoose.model('User',UserSchema);

module.exports = service;
