var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const ejs = require('ejs');
var index = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');
var mongoose = require('mongoose');
var app = express();
//****** PASSPORT------------------------------
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
User = require("./routes/models/user");

var mongo = require("mongodb");
//*Express- Validator---------------------------------------------------------------------

var expressValidator = require("express-validator");
var flash = require("connect-flash");
var session = require("express-session");


var users = require('./routes/users');


app.use(session({
  secret: 'dafnie',
  saveUninitialized: true,
  resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(flash());

app.use(function (req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});




//---------------------------------------------------------------------------------------
mongoose.connect('mongodb://localhost/bookie');
var db = mongoose.connection;


////////////////////////////////////////////////////////////
Genre =require('./routes/models/genre');
Book =require('./routes/models/book');


///////////////////////////////////////////////////////////
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/api', api);
//----------------------------------------------------------
//app.get('/', function(req, res) {

  //  res.render('about', { title: 'CCCCCCC' });
	//res.send('Hello');
	//res.json({});
//});
//------------------------------------------------
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
