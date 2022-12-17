var express = require('express');

var path = require('path');

var favicon = require('serve-favicon');
var morgan = require('morgan');

// authentication modules
var cookieParser = require('cookie-parser'); //manage cookies
var bodyParser = require('body-parser'); // manage request body
var csrf = require('csrf'); // some utility library
var session = require('express-session'); // session maintain
var passport = require('passport'); // authentication and authorization
var flash = require('connect-flash'); // some utility

var app = express(); //defining as a server

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//Reformat HTML code after renders
app.locals.pretty = true;

// set up express application
    // setup favicon
app.use(favicon(path.join(__dirname, 'public', '/img/ico/favicon.ico')));
    // log every request to the console
app.use(morgan('dev')); // for logs
    // csrf token init
var csrfProtection = csrf({ cookie: true });
    // get info from html forms
app.use(bodyParser.json()); // JSON convertor
app.use(bodyParser.urlencoded({extended: false}));
    // read cookies
app.use(cookieParser());
    // setup static directory =========================================
    //defining where your static resources will be like images, css, etc
app.use(express.static(path.join(__dirname, 'public'))); 
    // setup session secret
app.use(session({ secret: 'group8project', saveUninitialized: true, resave: true })); 
    // pass passport for configuration
require('./config/passport')(passport); //embedding passport.js into passport variable
    // init passport
app.use(passport.initialize());
    // persistent login sessions
app.use(passport.session());
    // use connect-flash for flash messages stored in session
app.use(flash());

// routes.. for api routing
var routes = require('./routes/routes');
var users = require('./routes/users')(app, passport);
var products = require('./routes/cart');
var checkout = require('./routes/checkout');
var press = require('./routes/press');
var services = require('./routes/services');
var contact = require('./routes/contact');
var admin = require('./routes/admin');
var profile = require('./routes/profile');
//require('./routes/users')(app, passport);

app.use('/', routes);
app.use('/cart', products);
app.use('/checkout', checkout);
app.use('/press', press);
app.use('/services', services);
app.use('/contact-us', contact);
app.use('/admin', admin);
app.use('/usr', profile);

// Session-persisted message middleware
app.use(function(req, res, next){
    var err = req.session.error,
        msg = req.session.notice,
        success = req.session.success;

    delete req.session.error;
    delete req.session.success;
    delete req.session.notice;

    if (err) res.locals.error = err;
    if (msg) res.locals.notice = msg;
    if (success) res.locals.success = success;

    next();
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Page under construction');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;