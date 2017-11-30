// Library inclusions.
var express = require('express');
var busboy = require('connect-busboy');
var bodyParser = require('body-parser');
var compression = require('compression');
var session = require('express-session');
var cookieParser = require('cookie-parser');

// Initializations.
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

app.get('*', function(req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.send('<!doctype html>' +
					'<html>' +
					'    <head>' +
					'        <title>Merchant Log In</title>' +
					'        <script>window.onload = function() { window.location = window.location.href.replace("http://", "https://"); return false; };</script>' +
					'    </head>' + 
					'    <body><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />' + 
					'         <div style="font-size:50px; width:100%;" align="center">&nbsp;</div>' +
					'    </body>' + 
					'</html>');
});

app.use(function(err, req, res, next) {
	console.log(err.stack);
});

function start (app) {
   return require('http').createServer(app);
}

start(app).listen('80');