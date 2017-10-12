// Library inclusions.
var fs = require('fs');
var cors = require('cors');
var express = require('express');
var busboy = require('connect-busboy');
var bodyParser = require('body-parser');
var compression = require('compression');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var crypto = require('crypto');

var getMd5 = function (dataToHash, saltString) {
    return crypto.createHash('md5').update(saltString).update(dataToHash).digest('hex');
}

// Class inclusions.
var urls = require('./server/utils/URLs');
var logger = require('./server/utils/Logger');
var config = require('./server/configs/Config');
var sTask = require('./server/utils/StartupTask');
var sdkRouter = require('./server/routers/SDKRouter');2
var userRouter = require('./server/routers/UserRouter');
var fileRouter = require('./server/routers/FileRouter');
var productRouter = require('./server/routers/ProductRouter');
var campaignRouter = require('./server/routers/CampaignRouter');
var sdkController = require('./server/controllers/SDKController');
var transactionRouter = require('./server/routers/TransactionRouter');
var notificationRouter = require('./server/routers/NotificationRouter');
var MglRouter = require('./server/routers/MglRouter');
var MglController = require('./server/controllers/MglController')
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
app.use(config.base + '/sdk', sdkRouter);
app.use(config.base + '/file', fileRouter);
app.use(config.base + '/user', userRouter);
app.use(config.base + '/product', productRouter);
app.use(config.base + '/campaign', campaignRouter);
app.use(config.base + '/ntfctn', notificationRouter);
app.use(config.base + '/txn', transactionRouter);
app.use(config.base + '/mglpay', MglRouter);
app.use(config.base + '/mgl', express.static(__dirname + urls.mglDir));
app.use(config.base + '/ppl', express.static(__dirname + urls.pplDir));
app.use(config.base + '/ngocsl', express.static(__dirname + urls.ngoDir));
app.use(config.base + '/mybiz', express.static(__dirname + urls.mybizDir));
app.use(config.base + '/lgn', express.static(__dirname + urls.loginDir));
app.use(config.base + '/assets', express.static(__dirname + urls.assetsDir));

app.post('/mglsuccess', function (req, res) {
   MglController.paymentSuccess(req, function() {
		res.sendFile(urls.mglHome, {root: __dirname });
	});
});

app.post('/mglfailure', function (req, res) {
	 MglController.paymentfailure(req, function() {
		res.sendFile(urls.mglHome, {root: __dirname });
	});
    
});
app.post('/hash', function (req, res) {
    var payloadObj = req.body;
    var inpObj = payloadObj.data;
    var merchantCode = payloadObj.merchantCode;
    var salt = payloadObj.salt;
    var headers= req.headers;
    var stringToHash = inpObj + merchantCode + salt;
    var hashData = getMd5(payloadObj.strToHash + merchantCode + salt, salt);
    res.send({ "hash": hashData });
})

app.get(config.base, function(req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, {root: __dirname });
});

app.get(config.base + '/lgn/*', function(req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, {root: __dirname });
});

app.get(config.base + '/mybiz/*', function(req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.mybizHome, {root: __dirname });
});

app.get(config.base + '/ngocsl/*', function(req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.ngoHome, {root: __dirname });
});

app.get(config.base + '/mgl/*', function(req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.mglHome, {root: __dirname });
});

app.get(config.base + '/ppl/*', function(req, res) {
	res.setHeader("X-Frame-Options", "ALLOW");
	res.sendFile(urls.pplHome, {root: __dirname });
});

app.post(config.base + '/ppl/paymentsuccess/:id/:txnid', function(req, res) {
	res.setHeader("X-Frame-Options", "ALLOW");
	sdkController.paymentSuccess(req, function() {
		res.sendFile(urls.pplHome, {root: __dirname });
	});
});

app.post(config.base + '/ppl/paymentfailure/:id/:txnid', function(req, res) {
	res.setHeader("X-Frame-Options", "ALLOW");
	sdkController.paymentFailure(req, function() {
		res.sendFile(urls.pplHome, {root: __dirname });
	});
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
