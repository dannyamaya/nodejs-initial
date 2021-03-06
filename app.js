/**
 * Module dependencies.
 */
var express = require('express'),
    compression = require('compression'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    oauth2 = require('./config/oauth2'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session  = require('express-session'),
    mongoStore = require('connect-mongo')(session),
    fileUpload = require('express-fileupload');

//Configuration file
var config = require('./config/config.json');

var session  = require('express-session');
var mongoStore = require('connect-mongo')(session);


// -----------------------------------------------------------------
// Database
// -----------------------------------------------------------------
mongoose.Promise = global.Promise;

mongoose.connect(config.production.db,{useMongoClient: true}, function(err, res) {
  if(err) {
    console.log('DBMongo: ¡¡ ERROR !!' + err);
  } else {
    console.log('DBMongo: OK');
  }
});

// -----------------------------------------------------------------
// Express configuration
// -----------------------------------------------------------------

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: config.cookie_secret,
    proxy: true,
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({
        url: config.production.db,
        collection : 'sessions'
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(compression({
  threshold: 512
}));
app.use(express.static(path.join(__dirname, 'public')));
app.disable('x-powered-by');

//file uploads
app.use(fileUpload());



// Passport configuration
//require('./config/auth');

require(__dirname + '/config/passport.js')(passport, config);

// Routes
var index = require('./routes/index');
var users = require('./routes/users');

app.use('/', index);
app.use('/api/users', users);


// -----------------------------------------------------------------
// Error handling
// -----------------------------------------------------------------

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in production
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'production' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// -----------------------------------------------------------------
// Start app
// -----------------------------------------------------------------

app.set('port', process.env.PORT || 3000);

var http = require('http'),
    server = http.createServer(app);

server.listen(app.get('port'), function(){
  console.log("Aplicacion ejecutandose en el puerto " + app.get('port'));
});

// -----------------------------------------------------------------
// Socket.io
// -----------------------------------------------------------------
var io = require('socket.io').listen(server);

var nsp = io.of('/superadmin');
var opmanager = io.of('/opmanager');

nsp.on('connection', function(socket){
  socket.on('new-ticket', function (data){
      nsp.emit('new-ticket', {ticket: data.ticket});
  });
});



