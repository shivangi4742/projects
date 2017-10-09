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
var sdkRouter = require('./server/routers/SDKRouter');
var userRouter = require('./server/routers/UserRouter');
var fileRouter = require('./server/routers/FileRouter');
var productRouter = require('./server/routers/ProductRouter');
var campaignRouter = require('./server/routers/CampaignRouter');
var sdkController = require('./server/controllers/SDKController');
var transactionRouter = require('./server/routers/TransactionRouter');
var notificationRouter = require('./server/routers/NotificationRouter');
var benowRouter = require('./server/routers/BenowRouter');
var benowController = require('./server/controllers/BenowController');

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
app.use(config.base + '/merchant', benowRouter);
app.use(config.base + '/file', fileRouter);
app.use(config.base + '/user', userRouter);
app.use(config.base + '/product', productRouter);
app.use(config.base + '/campaign', campaignRouter);
app.use(config.base + '/ntfctn', notificationRouter);
app.use(config.base + '/txn', transactionRouter);
app.use(config.base + '/mgl', express.static(__dirname + urls.mglDir));
app.use(config.base + '/ppl', express.static(__dirname + urls.pplDir));
app.use(config.base + '/ngocsl', express.static(__dirname + urls.ngoDir));
app.use(config.base + '/mybiz', express.static(__dirname + urls.mybizDir));
app.use(config.base + '/lgn', express.static(__dirname + urls.loginDir));
app.use(config.base + '/assets', express.static(__dirname + urls.assetsDir));

app.post(config.base + '/paysdk', function (req, res) {
	var inpObj = req.body;

	if (!inpObj.merchantCode)
		for (var key in req.body) {
			inpObj = JSON.parse(key);
			break;
		}

	var clientHash = inpObj.hash;
	var data = {
		"amount": inpObj.amount,
		"email": inpObj.email,
		"firstName": inpObj.firstName,
		"failureURL": inpObj.failureURL,
		"merchantCode": inpObj.merchantCode,
		"mccCode": inpObj.mccCode,
		"description": inpObj.description,
		"successURL": inpObj.successURL,
		"txnid": inpObj.txnid,
		"udf1": inpObj.udf1,
		"udf2": inpObj.udf2,
		"udf3": inpObj.udf3,
		"udf4": inpObj.udf4,
		"udf5": inpObj.udf5,
		"phone": inpObj.phone
	};

	var isSuccess = false;

	beNowController.validateMerchantHash(JSON.stringify(data), inpObj.merchantCode, clientHash, function (sData) {
		// res.setHeader("X-Frame-Options", "DENY");
		isSuccess = sData.responseFromAPI;

		if (isSuccess) {
			if (inpObj && inpObj.amount) {
				var b = inpObj;
				if (!b.sourceId)
					b.sourceId = 1;

				beNowController.getPaymentPageHTML(b.sourceId, b.id, b.txnid, b.merchantId, b.merchantCode, b.mtype, b.mccCode, b.merchantVpa, null, b.firstName, b.lastName,
					b.phone, b.phone, b.email, b.invoiceNumber, b.amount, b.minpanamnt, b.supportedModes, b.mode, b.vpa, null, b.title, b.description,
					b.askname, b.askemail, b.askmob, b.askadd, b.askpan, b.askresidence, b.readonlyname, b.readonlyemail, b.readonlymob, b.readonlyaddr,
					b.mndname, b.mndemail, b.mndmob, b.mndaddress, b.mndpan, b.udf1, b.udf2, b.udf3, b.udf4, b.udf5, b.successURL, b.failureURL, b.url,
					b.imageURL, res);
			}
		}
		else {
			res.redirect(config.me + '/webpaymentstatus/0/' + urlencode(inpObj.failureURL));
		}

	});

});

app.get(config.base + '/mglpayment', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.merchantRegistration, { root: __dirname });
});

app.post('/mglsuccess', function (req, res) {
    var inpObj = req.body;
    res.send('<!doctype html>'+
    ' <html>'+
    ' <head>'+
    ' <meta charset="utf-8">'+
    ' <meta name="viewport" content="width=device-width, initial-scale=1">'+
    ' <title>benow - merchant console</title>'+
    ' <base href="/">'+
    ' <link rel="icon" type="image/x-icon" href="./favicon.png">'+
    ' <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">'+
    ' <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">'+
    ' <link href="https://fonts.googleapis.com/css?family=Fjalla+One" rel="stylesheet">'+
    ' <link rel="stylesheet" href="./mrlibs.min.css" />'+
    '   <style>'+
    '     dashboard {'+
    '       display: flex;'+
    '      min-height: 96vh;'+
    '     flex-direction: column;'+
    '     }'+

    '     .tabs {'+
    '        overflow-x: hidden;'+
    '      }'+

    '  main {'+
    '     flex: 1 0 auto;'+
    '    }'+
    ' </style>'+
    ' </head>'+
    '  <body>'+
    '   <benow></benow>'+
    "     <input type='hidden' id='paymentSuccessData' value='" + JSON.stringify(inpObj) + "' />" + 
    '  <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en"></script>'+
	'        <script type="text/javascript" src="/mrapp.js"></script>' +
    ' </body>'+
    '</html>' );
});

app.post('/mglfailure', function (req, res) {
    var inpObj = req.body;
    var data = {
        "error_message": inpObj.error_message
    };
    res.send('<!doctype html>'+
    ' <html>'+
    ' <head>'+
    ' <meta charset="utf-8">'+
    ' <meta name="viewport" content="width=device-width, initial-scale=1">'+
    ' <title>benow - merchant console</title>'+
    ' <base href="/">'+
    ' <link rel="icon" type="image/x-icon" href="./favicon.png">'+
    ' <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">'+
    ' <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">'+
    ' <link href="https://fonts.googleapis.com/css?family=Fjalla+One" rel="stylesheet">'+
    ' <link rel="stylesheet" href="./mrlibs.min.css" />'+
    '   <style>'+
    '     dashboard {'+
    '       display: flex;'+
    '      min-height: 96vh;'+
    '     flex-direction: column;'+
    '     }'+

    '     .tabs {'+
    '        overflow-x: hidden;'+
    '      }'+

    '  main {'+
    '     flex: 1 0 auto;'+
    '    }'+
    ' </style>'+
    ' </head>'+
    '  <body>'+
    '   <benow></benow>'+
    "     <input type='hidden' id='paymentFailureData' value='" + JSON.stringify(data) + "' />" + 
    '  <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en"></script>'+
	'        <script type="text/javascript" src="/mrapp.js"></script>' +
    ' </body>'+
    '</html>' );
});

app.post('/hash', function (req, res) {
    var payloadObj = req.body;
    var inpObj = payloadObj.data;
    var merchantCode = payloadObj.merchantCode;
    var salt = payloadObj.salt;
    var headers= req.headers;
   // var salt = 'abcd';
    var stringToHash = inpObj + merchantCode + salt;
    var hashData = getMd5(payloadObj.strToHash + merchantCode + salt, salt)
	console.log(hashData)
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
