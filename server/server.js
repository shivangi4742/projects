// Library inclusions.
var express = require('express');
var busboy = require('connect-busboy');
var bodyParser = require('body-parser');
var compression = require('compression');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var fs = require('fs');

// Class inclusions.
var urls = require('./server/utils/URLs');
var logger = require('./server/utils/Logger');
var config = require('./server/configs/Config');
var sTask = require('./server/utils/StartupTask');
var adminRouter = require('./server/routers/AdminRouter');
var benowRouter = require('./server/routers/BenowRouter');
var beNowController = require('./server/controllers/BeNowController');

function setup (ssl) {
   if (ssl && ssl.active) {
      return {
         key  : fs.readFileSync(ssl.key),
         cert : fs.readFileSync(ssl.certificate),
		 ca : fs.readFileSync(ssl.ca)
      };
   }
}

// Initializations.
var env = config.env;
var app = new express();

// Communication settings.
app.use(compression({
	threshold: 0
}));

app.use(cookieParser());
app.use(bodyParser.json({
	limit: '50mb'
}));

app.use(bodyParser.urlencoded({
	limit: '50mb',
	extended: true
}));

app.use(busboy());

// Persistent login sessions.
app.use(session({ 
	secret: 'let me be secret now',
	resave: false,
	saveUninitialized: false,
	cookie: { secure: false } 
}));

// Routing settings.
app.use(config.base + '/login/dist', express.static(__dirname + urls.loginDistDir));
app.use(config.base + '/assets', express.static(__dirname + urls.assetsDir));
app.use(config.base + '/i18n', express.static(__dirname + urls.translationDir));
app.use(config.base + '/fav',express.static(__dirname + urls.favicon))

app.get(config.base, function(req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, {root: __dirname });
});

app.get(config.base + '/login/*', function(req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, {root: __dirname });
});

app.use(function(err, req, res, next) {
	console.log(err.stack);
});

function start (app, options) {
   if (options) {
	  console.log('starting https');
      return require('https').createServer(options, app);
   }

   console.log('starting http');
   return require('http').createServer(app);
}

var options = setup(config.ssl);
start(app, options).listen(config.port);

sTask.migrate();
