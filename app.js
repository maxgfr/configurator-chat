var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var cfenv = require("cfenv");



/***** IBM part *****/
var vcapLocal; // load local VCAP configuration  and service credentials
try {
  vcapLocal = require('./vcap-local.json');
  //console.log("Loaded local VCAP", vcapLocal);
} catch (e) { }

const appEnvOpts = vcapLocal ? { vcap: vcapLocal} : {}

const appEnv = cfenv.getAppEnv(appEnvOpts);

if (appEnv.services['conversation']) {
  // Load the Watson Conversation library.
  var ConversationV1 = require('watson-developer-cloud/conversation/v1');
  // Initialize database with credentials
  conversation = new ConversationV1({
    username: appEnv.services['conversation'][0].credentials.username,
    password: appEnv.services['conversation'][0].credentials.password,
    version_date: ConversationV1.VERSION_DATE_2017_05_26
  });
  //console.log(conversation);
}
/***** IBM part *****/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
