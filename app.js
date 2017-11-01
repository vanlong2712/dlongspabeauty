var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var flash = require('connect-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var toastr = require('express-toastr');
const Passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
/*connect to mongoose*/
const { mongoose } = require('./db/mongoose');

var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
var login_admin = require('./routes/login_admin');
var admin_service = require('./routes/admin_service');

// global.httpLinkAdmin = 'https://spabeauty.herokuapp.com/187_admin';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('secret'));
app.use(
  session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
  })
);
app.use(Passport.initialize());
app.use(Passport.session());
app.use(flash());
// Load express-toastr
// You can pass an object of default options to toastr(), see example/index.coffee
app.use(toastr());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/187_admin', admin);
app.use('/187_admin', login_admin);
app.use('/187_admin', admin_service);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
