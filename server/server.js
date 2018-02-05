// Library inclusions.
var fs = require('fs');
var cors = require('cors');
var uuid = require('uuid');
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
var helpRouter = require('./server/routers/HelpRouter');
var fileRouter = require('./server/routers/FileRouter');
var productRouter = require('./server/routers/ProductRouter');
var campaignRouter = require('./server/routers/CampaignRouter');
var sdkController = require('./server/controllers/SDKController');
var transactionRouter = require('./server/routers/TransactionRouter');
var notificationRouter = require('./server/routers/NotificationRouter');
var ZgRouter = require('./server/routers/ZgRouter');
var ZgController = require('./server/controllers/ZgController')
var MglRouter = require('./server/routers/MglRouter');
var MglController = require('./server/controllers/MglController')
function setup(ssl) {
	if (ssl && ssl.active) {
		return {
			key: fs.readFileSync(ssl.key),
			cert: fs.readFileSync(ssl.certificate),
			ca: fs.readFileSync(ssl.ca)
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
app.use(config.base + '/help', helpRouter);
app.use(config.base + '/product', productRouter);
app.use(config.base + '/campaign', campaignRouter);
app.use(config.base + '/ntfctn', notificationRouter);
app.use(config.base + '/txn', transactionRouter);
app.use(config.base + '/zgsvc', ZgRouter);
app.use(config.base + '/mglpay', MglRouter);
app.use(config.base + '/payments', MglRouter);
app.use(config.base + '/zg', express.static(__dirname + urls.zgDir));
app.use(config.base + '/mgl', express.static(__dirname + urls.mglDir));
app.use(config.base + '/ppl', express.static(__dirname + urls.pplDir));
app.use(config.base + '/ngocsl', express.static(__dirname + urls.ngoDir));
app.use(config.base + '/mybiz', express.static(__dirname + urls.mybizDir));
app.use(config.base + '/lgn', express.static(__dirname + urls.loginDir));
app.use(config.base + '/qrs', express.static(__dirname + urls.qrDir));
app.use(config.base + '/assets', express.static(__dirname + urls.assetsDir));

app.post('/mglsuccess', function (req, res) {
	MglController.paymentSuccess(req, function () {
		res.sendFile(urls.mglHome, { root: __dirname });
	});
});

app.post('/mglfailure', function (req, res) {
	MglController.paymentfailure(req, function () {
		res.sendFile(urls.mglHome, { root: __dirname });
	});

});
app.post('/hash', function (req, res) {
	var payloadObj = req.body;
	var inpObj = payloadObj.data;
	var merchantCode = payloadObj.merchantCode;
	var salt = payloadObj.salt;
	var headers = req.headers;
	var stringToHash = inpObj + merchantCode + salt;
	var hashData = getMd5(payloadObj.strToHash + merchantCode + salt, salt);
	res.send({ "hash": hashData });
})

app.get(config.base, function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/lgn/*', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/mybiz/*', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.mybizHome, { root: __dirname });
});

app.get(config.base + '/ngocsl/*', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.ngoHome, { root: __dirname });
});

app.get(config.base + '/mgl/*', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.mglHome, { root: __dirname });
});

app.get(config.base + '/zg/*', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.zgHome, { root: __dirname });
});

app.get(config.base + '/ppl/*', function (req, res) {
	res.setHeader("X-Frame-Options", "ALLOW");
	res.sendFile(urls.pplHome, { root: __dirname });
});

app.post(config.base + '/ppl/paymentsuccess/:id/:txnid', function (req, res) {
	res.setHeader("X-Frame-Options", "ALLOW");
	sdkController.paymentSuccess(req, function () {
		res.sendFile(urls.pplHome, { root: __dirname });
	});
});

app.post(config.base + '/ppl/donationsuccess/:id/:txnid', function (req, res) {
	res.setHeader("X-Frame-Options", "ALLOW");
	sdkController.paymentSuccess(req, function () {
		res.sendFile(urls.pplHome, { root: __dirname });
	});
});

app.post(config.base + '/ppl/donationsuccess/:id/:txnid/:fund', function (req, res) {
	res.setHeader("X-Frame-Options", "ALLOW");
	sdkController.paymentSuccess(req, function () {
		res.sendFile(urls.pplHome, { root: __dirname });
	});
});

app.post(config.base + '/ppl/paymentfailure/:id/:txnid', function (req, res) {
	res.setHeader("X-Frame-Options", "ALLOW");
	sdkController.paymentFailure(req, function () {
		res.sendFile(urls.pplHome, { root: __dirname });
	});
});

app.post(config.base + '/ppl/donationfailure/:id/:txnid', function (req, res) {
	res.setHeader("X-Frame-Options", "ALLOW");
	sdkController.paymentFailure(req, function () {
		res.sendFile(urls.pplHome, { root: __dirname });
	});
});

app.get(config.base + '/r/:mid/:link', function (req, res) {
	res.setHeader("X-Frame-Options", "ALLOW");
	sdkController.getCampaignLinkDetails(req.params.mid, req.params.link, req.headers, function (data) {
		if (data && data.desc1) {
			var nImg = data.desc3;
			if (!nImg)
				nImg = config.me + '/ppl/assets/shared/images/paym.png';

			nImg = nImg.replace(/ /g, '');
			var title = '';
			var description = '';
			var expdt = false;
			if (data.desc2) {
				var d2arr = data.desc2.split('|||');
				if (d2arr && d2arr.length > 0) {
					title = d2arr[0];
					if (d2arr.length > 1)
						description = d2arr[1];

					var curDt = new Date();
					if (d2arr.length > 2 && d2arr[2]) {
						var dtarr = d2arr[2].split('-');
						if (dtarr && dtarr.length > 2) {
							var y = parseInt(dtarr[2]);
							if (!isNaN(y)) {
								var cy = parseInt(curDt.getFullYear());
								if (y < cy)
									expdt = true;
								else if (y == cy) {
									var m = parseInt(dtarr[1]);
									if (!isNaN(m)) {
										var cm = parseInt(curDt.getMonth()) + 1;
										if (m < cm)
											expdt = true;
										else if (m == cm) {
											var nd = parseInt(dtarr[0]);
											if (!isNaN(nd)) {
												var cnd = parseInt(curDt.getDate());
												if (nd < cnd)
													expdt = true;
											}
										}
									}
								}
							}
						}
					}
				}
			}

			if (expdt == true)
				res.sendFile(urls.expdLink, { root: __dirname });
			else {
				nImg = config.uploadsURL + nImg;
				res.send('<!doctype html>' +
					'<html>' +
					'    <head>' +
					'        <meta charset="utf-8">' +
					'        <meta name="viewport" content="width=device-width, initial-scale=1">' +
					'        <title>benow - payment link</title>' +
					'        <meta property="og:title" content="' + title + '" />' +
					'        <meta property="og:description" content="' + description + '" />' +
					'        <meta property="og:url" content="' + data.desc1 + '" />' +
					'        <meta property="og:image" content="' + nImg + '" />' +
					'        <meta property="og:image:secure_url" content="' + nImg + '" />' +
					'        <script>window.onload = function() { window.location = "' + data.desc1 + '"; return false; };</script>' +
					'    </head>' +
					'    <body><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />' +
					'         <div style="font-size:50px; width:100%;" align="center">&nbsp;</div>' +
					'    </body>' +
					'</html>'
				);
			}
		}
		else
			res.sendFile(urls.invalidLink, { root: __dirname });
	});
});

app.get(config.base + '/mglshare', function (req, res) {
	res.send('<!doctype html>' +
		'<html>' +
		'    <head>' +
		'        <meta charset="utf-8">' +
		'        <meta name="viewport" content="width=device-width, initial-scale=1">' +
		'        <title>Benow - Mahanagar Gas Bill</title>' +
		'        <meta property="og:title" content="Get ₹ 50 Cashback" />' +
		'        <meta property="og:description" content="I just paid my Mahanagar Gas bill successfully. Get ₹ 50 cashback by paying your bill with this link. *T&C apply." />' +
		'        <meta property="og:url" content="https://merchant.benow.in/mglshare" />' +
		'        <meta property="og:image" content="https://merchant.benow.in/assets/mgl/images/axisbenow.png" />' +
		'        <meta property="og:image:secure_url" content="https://merchant.benow.in/assets/mgl/images/axisbenow.png" />' +
		'        <script>window.onload = function() { window.location = "https://merchant.benow.in/mgl"; return false; };</script>' +
		'    </head>' +
		'    <body><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />' +
		'         <div style="font-size:50px; width:100%;" align="center">&nbsp;</div>' +
		'    </body>' +
		'</html>'
	);

});

app.post(config.base + '/paysdk', function (req, res) {
	res.setHeader("X-Frame-Options", "ALLOW");
	var headers = {
		'X-AUTHORIZATION': config.defaultToken,
		'Content-Type': 'application/json'
	};
	var inpObj = req.body;
	sdkController.saveLogs(inpObj, headers, function (data) {
		if (data && data.id) {
			res.send('<!doctype html>' +
				'<html>' +
				'    <head>' +
				'        <meta charset="utf-8">' +
				'        <meta name="viewport" content="width=device-width, initial-scale=1">' +
				'        <title>benow - payment link</title>' +
				'        <script>window.onload = function() { window.location = "' + 'http://localhost:4200' + '/pay/' + data.id + '/SDK/' + data.id + '"; return false; };</script>' +
				'    </head>' +
				'    <body><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />' +
				'         <div style="font-size:50px; width:100%;" align="center">&nbsp;</div>' +
				'    </body>' +
				'</html>'
			);
		}
		else
			res.sendFile(urls.invalidLink, { root: __dirname });
	});
});

app.use(function (err, req, res, next) {
	console.log(err.stack);
});

function start(app, options) {
	if (options) {
		console.log('started https');
		return require('https').createServer(options, app);
	}

	console.log('started http');
	return require('http').createServer(app);
}

var options = setup(config.ssl);
const svr = start(app, options).listen(config.port);
var io = require('socket.io').listen(svr);
io.sockets.on('connection', function (socket) {
	socket.on('merchantroom', function (room) {
		socket.join(room.room);
	});
});

app.get(config.base + '/test/:mcode', function (req, res) {
	io.sockets.in(req.params.mcode).emit('paymentreceived', {
		amount: 10,
		id: uuid.v1(),
		tr: uuid.v1(),
		mode: 'UPI',
		vpa: 'Yatish',
		till: '001',
		dt: new Date()
	});
	res.send('emitted');
});

sTask.migrate();
