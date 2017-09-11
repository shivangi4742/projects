// Library inclusions.
var fs = require('fs');
var cors = require('cors');
var express = require('express');
var busboy = require('connect-busboy');
var bodyParser = require('body-parser');
var compression = require('compression');
var session = require('express-session');
var cookieParser = require('cookie-parser');

// Class inclusions.
var urls = require('./server/utils/URLs');
var logger = require('./server/utils/Logger');
var config = require('./server/configs/Config');
var sTask = require('./server/utils/StartupTask');
var userRouter = require('./server/routers/UserRouter');
var fileRouter = require('./server/routers/FileRouter');
var productRouter = require('./server/routers/ProductRouter');
var campaignRouter = require('./server/routers/CampaignRouter');
var notificationRouter = require('./server/routers/NotificationRouter');

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
app.use(cors());

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
app.use(config.base + '/file', fileRouter);
app.use(config.base + '/user', userRouter);
app.use(config.base + '/product', productRouter);
app.use(config.base + '/campaign', campaignRouter);
app.use(config.base + '/notification', notificationRouter);
app.use(config.base + '/login', express.static(__dirname + urls.loginDir));
app.use(config.base + '/assets', express.static(__dirname + urls.assetsDir));

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
	  console.log('started https');
      return require('https').createServer(options, app);
   }

   console.log('started http');
   return require('http').createServer(app);
}

var options = setup(config.ssl);
start(app, options).listen(config.port);

sTask.migrate();
