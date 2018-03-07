// Library inclusions.
var express = require('express');
var busboy = require('connect-busboy');
var bodyParser = require('body-parser');
var compression = require('compression');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var io = require('socket.io');
var crypto = require('crypto');
var urlencode = require('urlencode');
var cors = require('cors');

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
var MglRouter = require('./server/routers/MglRouter');
var MglController = require('./server/controllers/MglController');
var ZgRouter = require('./server/routers/ZgRouter');
var ZgController = require('./server/controllers/ZgController');
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

app.use(bodyParser.text());

app.use(busboy());

// Persistent login sessions.
app.use(session({
	secret: 'let me be secret',
	resave: false,
	saveUninitialized: false,
	cookie: { secure: false }
}));

app.get(config.base + '/mglpay/mglsuccess', function (req, res) {
	res.sendFile(urls.norefreshLink, { root: __dirname });
});

app.get(config.base + '/mglpay/mglfailure', function (req, res) {
	res.sendFile(urls.norefreshLink, { root: __dirname });
});

app.get(config.base + '/waitingforpayment/:p1/:p2/:p3/:p4/:p5/:p6', function (req, res) {
	res.sendFile(urls.norefreshLink, { root: __dirname });
});

app.post(config.base + 'waitingforpayment/:id/:mode/:source/:merchantcode/:txnNo/:amount', function (req, res) {
	res.sendFile(urls.norefreshLink, { root: __dirname });
});

app.get(config.base + '/pgsdk/:p1', function (req, res) {
	res.sendFile(urls.norefreshLink, { root: __dirname });
});

app.get(config.base + '/paysdk', function (req, res) {
	res.sendFile(urls.norefreshLink, { root: __dirname });
});

app.get(config.base + '/paysdk/:p1', function (req, res) {
	res.sendFile(urls.norefreshLink, { root: __dirname });
});

// Routing settings.
app.use(config.base, express.static(__dirname + urls.distDir));
app.use(config.base + '/register/images', express.static(__dirname + urls.regImagesDir));
app.use(config.base + '/merchantverify/images', express.static(__dirname + urls.merVerImagesDir));
app.use(config.base + '/images', express.static(__dirname + urls.regImagesDir));
app.use(config.base + '/logos', express.static(__dirname + urls.logosDir));
app.use(config.base + '/qrs', express.static(__dirname + urls.qrsDir));
app.use(config.base + '/uploads', express.static(__dirname + urls.uploadsDir));
app.use(config.base + '/dist', express.static(__dirname + urls.distDir));
app.use(config.base + '/node_modules', express.static(__dirname + urls.extLibsDir));
app.use(config.base + '/i18n', express.static(__dirname + urls.translationDir));
app.use(config.base + '/fav', express.static(__dirname + urls.favicon))
app.use(config.base + '/sdk', sdkRouter);
app.use(config.base + '/file', fileRouter);
app.use(config.base + '/user', userRouter);
app.use(config.base + '/help', helpRouter);
app.use(config.base + '/product', productRouter);
app.use(config.base + '/campaign', campaignRouter);
app.use(config.base + '/ntfctn', notificationRouter);
app.use(config.base + '/txn', transactionRouter);
app.use(config.base + '/mglpay', MglRouter);
app.use(config.base + '/zgsvc', ZgRouter);
app.use(config.base + '/mgl', express.static(__dirname + urls.mglDir));
app.use(config.base + '/buy', express.static(__dirname + urls.buyDir));
app.use(config.base + '/zg', express.static(__dirname + urls.zgDir));
app.use(config.base + '/ppl', express.static(__dirname + urls.pplDir));
app.use(config.base + '/ngocsl', express.static(__dirname + urls.ngoDir));
app.use(config.base + '/mybiz', express.static(__dirname + urls.mybizDir));
app.use(config.base + '/newbiz', express.static(__dirname + urls.newbizDir));
app.use(config.base + '/lgn', express.static(__dirname + urls.loginDir));
app.use(config.base + '/assets', express.static(__dirname + urls.assetsDir));
app.use(config.base + '/admin', express.static(__dirname + urls.finmoDir));

app.get(config.base + '/admin/*', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.finmoPortal, { root: __dirname });
});

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

app.get(config.base + '/u/:id', function (req, res) {
	res.setHeader("X-Frame-Options", "ALLOW");
	beNowController.getUPILinkDetails(req.params.id, req.headers, function (data) {
		if (data && data.desc1) {
			res.send('<!doctype html>' +
				'<html>' +
				'    <head>' +
				'        <meta charset="utf-8">' +
				'        <meta name="viewport" content="width=device-width, initial-scale=1">' +
				'        <title>Benow - UPI Link</title>' +
				'        <meta property="og:title" content="Benow - Pay Safer" />' +
				'        <meta property="og:description" content="Benow UPI Payment Link" />' +
				'        <meta property="og:url" content="https://merchant.benow.in" />' +
				'        <meta property="og:image" content="https://merchant.benow.in/mgl/assets/mgl/images/safer.png" />' +
				'        <meta property="og:image:secure_url" content="https://merchant.benow.in/mgl/assets/mgl/images/safer.png" />' +
				'        <script>window.onload = function() { window.location = "' + data.desc1 + '"; return false; };</script>' +
				'    </head>' +
				'    <body><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />' +
				'         <div style="font-size:50px; width:100%;" align="center">&nbsp;</div>' +
				'    </body>' +
				'</html>'
			);
		}
		else
			res.sendFile(urls.invlidLink, { root: __dirname });
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
			res.sendFile(urls.invlidLink, { root: __dirname });
	});
});


app.get(config.base + '/lgn/*', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/ngocsl/*', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.ngoHome, { root: __dirname });
});

app.get(config.base + '/zg/*', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.zgHome, { root: __dirname });
});

app.get(config.base + '/mgl/*', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.mglHome, { root: __dirname });
});

app.get(config.base + '/mybiz/*', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.mybizHome, { root: __dirname });
});

app.get(config.base + '/newbiz/*', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.newbizHome, { root: __dirname });
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

app.post(config.base + '/ppl/donationsuccess/:id/:txnid/:fund', function (req, res) {
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

app.get(config.base, function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/nfc/:data', function (req, res) {
	nfcController.takeRequest(req.params.data);
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.nfc, { root: __dirname });
});

app.get(config.base + '/paymentlink', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/mrfailure', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.merchantRegistration, { root: __dirname })
});

/*app.get(config.base + '/thanks', function(req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, {root: __dirname })
});*/

app.get(config.base + '/tilconsole', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/profile', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/accountdetails', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});
app.get(config.base + '/thanksforaccount', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});
app.get(config.base + '/thanksforRegistration', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/bnadmin', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/waitingforpayment/:id/:mode/:merchantcode/:tr/:amount', function (req, res) {
	res.setHeader("X-Frame-Options", "ALLOW");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/pg/:id', function (req, res) {
	res.redirect(config.me + '/pay/' + req.params.id);
});

app.get(config.base + '/register', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.registration, { root: __dirname });
});

app.get(config.base + '/register/:source', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.registration, { root: __dirname });
});

app.get(config.base + '/notification/:page/:id', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

/*
app.get('/temp', function(req, res) {
	res.send('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' + 
		'<title>benow - payment link</title><meta property="og:title" content="Benow+Merchant" /><meta property="og:description" content="desc" />' + 
		'<meta property="og:url" content="undefined" /><meta property="og:image" content="NA" /><meta property="og:image:secure_url" content="NA" />' + 
		'<base href="/"><link rel="icon" type="image/x-icon" href="./favicon.png">' + 
		'<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">' + 
		'<link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">' + 
		'<link href="https://fonts.googleapis.com/css?family=Fjalla+One" rel="stylesheet"><link rel="stylesheet" href="./libs.min.css" /><style>' +
		' pay, paymentsuccess, paymentfailure, waitingforpayment { display: flex; min-height: 104vh; flex-direction: column; }' +
		' main { flex: 1 0 auto; } </style></head><body><benow></benow><input type="hidden" id="paymentPageData" value=\'{"language":0,"sourceId":1,"amount":"10","modes":{"CC":"NA","DC":"NA","UPI":"NA","SODEXO":"NA","UPICOLLECT":"NA"},"mode":"NA","id":"NA","txnid":"NA","merchantId":"NA","email":"merchant%40benow.in","merchantCode":"AA3Q7","merchantVpa":"AA3Q7%40upi","mccCode":"5812","vpa":"NA","firstName":"Merchant","askname":true,"askemail":true,"askmob":true,"askadd":false,"readonlyname":true,"readonlyemail":true,"readonlymob":true,"readonlyaddr":true,"mndname":true,"mndemail":true,"mndmob":true,"mndaddress":true,"phone":"9767843495","mobileNo":"9767843495","imageURL":"NA","title":"Benow+Merchant","description":"desc","invoiceNumber":"1","expiryDate":null,"url":null,"successURL":"NA","failureURL":"NA","udf1":"NA","udf2":"NA","udf3":"NA","udf4":"NA","udf5":"NA"}\' />' + 
		'<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en"></script><script type="text/javascript" src="/app.js"></script></body></html>');
});
*/

app.post(config.base + '/ppl/paytmresponse/:id/:txnid', function (req, res) {
	var inpObj = req.body;
	var paymentMode = '';

	if (inpObj.PAYMENTMODE == 'CC') {
		paymentMode = 'CREDIT_CARD';
	}
	else if (inpObj.PAYMENTMODE == 'DC') {
		paymentMode = 'DEBIT_CARD';
	}
	else if (inpObj.PAYMENTMODE == 'NB') {
		paymentMode = 'NET_BANKING';
	}

	var transactionData = {
		"mId": inpObj.MID,
		"paymentMethod": paymentMode,
		"txnId": inpObj.TXNID,
		"orderId": inpObj.ORDERID,
		"bankTxnId": inpObj.BANKTXNID,
		"amount": inpObj.TXNAMOUNT,
		"currency": inpObj.CURRENCY,
		"status": inpObj.STATUS,
		"respCode": inpObj.RESPCODE,
		"respMsg": inpObj.RESPMSG,
		"txnDate": inpObj.TXNDATE,
		"gatewayName": inpObj.GATEWAYNAME,
		"bankName": inpObj.BANKNAME,
		"paymentMode": inpObj.PAYMENTMODE,
		"promoCampId": inpObj.PROMO_CAMP_ID,
		"promoStatus": inpObj.PROMO_STATUS,
		"promoResponse": inpObj.PROMO_RESPCODE,
		"checksumHash": inpObj.CHECKSUMHASH,
		"bank_ref_num": inpObj.BANKTXNID,
		"cardnum": inpObj.TXNID,
		"cardCategory": 'PAYTM-' + inpObj.PAYMENTMODE
	};

	sdkController.validatePaytmChecksumPOST(req, transactionData, function (data) {
		if (data && data.responseFromAPI == true) {
			res.setHeader("X-Frame-Options", "ALLOW");
			sdkController.paytmSuccess(req, transactionData, function () {
				res.sendFile(urls.pplHome, { root: __dirname });
			});
		}
		else {
			sdkController.paytmFailure(req, transactionData, function () {
				res.sendFile(urls.pplHome, { root: __dirname });
			});
		}
	});
});

app.post(config.base + '/addsodexo', function (req, res) {
	var inpObj = req.body;

	if (!inpObj.mobile) {
		// redirect to failure page
	}
	else {

		var mobileNo = inpObj.mobile;
		var deviceId = inpObj.deviceId;

		res.send('<!doctype html>' +
			'<html>' +
			'    <head>' +
			'        <meta charset="utf-8">' +
			'        <meta name="viewport" content="width=device-width, initial-scale=1">' +
			'        <title>benow - payment link</title>' +
			'        <base href="/">' +
			'        <link rel="icon" type="image/x-icon" href="./favicon.png">' +
			'        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">' +
			'        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">' +
			'        <link href="https://fonts.googleapis.com/css?family=Fjalla+One" rel="stylesheet">' +
			'        <link rel="stylesheet" href="./libs.min.css" />' +
			'        <style>' +
			'            pay, paymentsuccess, paymentfailure, waitingforpayment {' +
			'                display: flex;' +
			'                min-height: 104vh;' +
			'                flex-direction: column;' +
			'            }' +
			'            main {' +
			'                flex: 1 0 auto;' +
			'            }' +
			'        </style>' +
			'    </head>' +
			'    <body>' +
			'        <benow></benow>' +
			"        <input type='hidden' id='mobileNo' value='" + mobileNo + "' />" +
			"        <input type='hidden' id='deviceId' value='" + deviceId + "' />" +
			'        <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en"></script>' +
			'        <script type="text/javascript" src="/app.js"></script>' +
			'    </body>' +
			'</html>');

	}
});

app.post(config.base + '/mysodexo', function (req, res) {
	var inpObj = req.body;

	if (!inpObj.mobile) {
		// redirect to failure page
	}
	else {

		var mobileNo = inpObj.mobile;
		var deviceId = inpObj.deviceId;

		res.send('<!doctype html>' +
			'<html>' +
			'    <head>' +
			'        <meta charset="utf-8">' +
			'        <meta name="viewport" content="width=device-width, initial-scale=1">' +
			'        <title>benow - payment link</title>' +
			'        <base href="/">' +
			'        <link rel="icon" type="image/x-icon" href="./favicon.png">' +
			'        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">' +
			'        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">' +
			'        <link href="https://fonts.googleapis.com/css?family=Fjalla+One" rel="stylesheet">' +
			'        <link rel="stylesheet" href="./libs.min.css" />' +
			'        <style>' +
			'            pay, paymentsuccess, paymentfailure, waitingforpayment {' +
			'                display: flex;' +
			'                min-height: 104vh;' +
			'                flex-direction: column;' +
			'            }' +
			'            main {' +
			'                flex: 1 0 auto;' +
			'            }' +
			'        </style>' +
			'    </head>' +
			'    <body>' +
			'        <benow></benow>' +
			"        <input type='hidden' id='mobileNo' value='" + mobileNo + "' />" +
			"        <input type='hidden' id='deviceId' value='" + deviceId + "' />" +
			'        <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en"></script>' +
			'        <script type="text/javascript" src="/app.js"></script>' +
			'    </body>' +
			'</html>');

		// beNowController.getSodexoAccounts(inpObj.mobile, function (data) {
		// 	console.log('Sodexo resp', data);
		// });
	}
});

app.post(config.base + '/paysdk', function (req, res) {
	var inpObj = req.body;

	if (!inpObj.merchantCode)
		for (var key in req.body) {
			inpObj = JSON.parse(key);
			break;
		}

	var clientHash = inpObj.hash;

	if (clientHash && clientHash.length > 0) {
		var data = {
			"amount": inpObj.amount,
			"email": inpObj.email,
			"imageURL": inpObj.imageURL ? config.me + inpObj.imageURL : '',
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
	}
	else {
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

});

function gotoPay(req, res) {
	beNowController.getPaymentLinkData(req.params.id, function (payData) {
		if (payData && payData.merchantCode) {
			beNowController.downloadIfNotPresent(payData.fileUrl, 15, function (fileUrl) {
				if (!fileUrl)
					fileUrl = config.me + '/paym.png';

				if (payData.fileUrl && payData.fileUrl.indexOf(' ') > 0) {
					var newFileUrl = payData.fileUrl.replace(/ /g, '');
					if (!fs.existsSync('uploads/' + newFileUrl) && fs.existsSync('uploads/' + payData.fileUrl))
						fs.createReadStream('uploads/' + payData.fileUrl).pipe(fs.createWriteStream('uploads/' + newFileUrl));
				}

				var expDt = new Date(payData.expiryDate);
				var expDtStr = expDt.getDate().toString();
				if (expDt.getDate() < 10)
					expDtStr = '0' + expDtStr;

				var mon = expDt.getMonth() + 1;
				if (mon < 10)
					expDtStr += '-0' + mon + '-' + expDt.getFullYear();
				else
					expDtStr += '-' + mon + '-' + expDt.getFullYear();

				if (payData) {
					var mVPA = payData.merchantCode + "@yesbank";
					var mtype = 1;
					var modes = new Array();
					if (payData.merchantUser) {
						if (payData.merchantUser.defaultAcc && payData.merchantUser.defaultAcc.virtualAddress)
							mVPA = payData.merchantUser.defaultAcc.virtualAddress;

						if (payData.merchantUser.mccCode && payData.merchantUser.mccCode.toString() == '8398')
							mtype = 2;

						if (payData.merchantUser.businessLob && payData.merchantUser.businessLob.trim().toUpperCase() == 'HB')
							mtype = 3;

						if (payData.merchantUser.acceptedPaymentMethods && payData.merchantUser.acceptedPaymentMethods.length > 0) {
							payData.merchantUser.acceptedPaymentMethods.forEach(function (m) {
								if (m && m.paymentMethod) {
									if ((m.paymentMethod == 'UPI_OTHER_APP' || m.paymentMethod == 'UPI') && modes.indexOf('UPI') < 0)
										modes.push('UPI');
									else if ((m.paymentMethod == 'CREDIT_CARD' || m.paymentMethod == 'CC') && modes.indexOf('CC') < 0)
										modes.push('CC');
									else if ((m.paymentMethod == 'DEBIT_CARD' || m.paymentMethod == 'DC') && modes.indexOf('DC') < 0)
										modes.push('DC');
									else if ((m.paymentMethod == 'NET_BANKING' || m.paymentMethod == 'NB') && modes.indexOf('NB') < 0)
										modes.push('NB');
									else if ((m.paymentMethod == 'MEAL_COUPON' || m.paymentMethod == 'SODEXO') && modes.indexOf('SODEXO') < 0)
										modes.push('SODEXO');
								}
							});
						}
					}

					if (modes.length <= 0)
						modes.push('UPI');

					if (payData.merchantCode === 'AL7D6' || payData.merchantCode === 'ADCT7' || payData.merchantCode === 'AA8A0' ||
						payData.merchantCode === 'AF4V6' || payData.merchantCode === 'ADJ69' || payData.merchantCode === 'AACH5' ||
						payData.merchantCode === 'AL7I2' || payData.merchantCode === 'ALA73')
						mtype = 3;

					beNowController.getPaymentPageHTML(0, payData.id, null, payData.merchantUser.id, payData.merchantCode, mtype,
						payData.merchantUser.mccCode, mVPA, payData.till, null, null, payData.mobileNumber, null, null, payData.invoiceNumber, payData.invoiceAmount,
						payData.minpanamnt, modes, null, null, expDtStr, payData.merchantUser ? payData.merchantUser.businessName : 'benow payment link',
						payData.description, payData.askname, payData.askemail, payData.askmob, payData.askadd, payData.panaccepted, payData.askresidence,
						null, null, null, null, payData.mndname, payData.mndemail, payData.mndmob, payData.mndaddress, payData.mndpan, null, null, null,
						null, null, payData.surl, payData.furl, config.me + '/pay/' + req.params.id, fileUrl, res);
				}
			});
		}
		else {
			res.setHeader("X-Frame-Options", "ALLOW");
			res.sendFile(urls.invalidLink, { root: __dirname });
		}
	});
};

app.get(config.base + '/pay/:id/:prefills', function (req, res) {
	gotoPay(req, res);
});

app.get(config.base + '/pay/:id', function (req, res) {
	gotoPay(req, res);
});

app.get(config.base + '/pay/:id/:prefills/:paymentMode', function (req, res) {
	gotoPay(req, res);
});

app.get(config.base + '/test', function (req, res) {
	res.send('test');
});

app.get(config.base + '/restart/:key', function (req, res) {
	if (req.params.key == 'Y@7!$h')
		process.exit();
});

app.get(config.base + '/mrlogin/:status/:campaignId', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.merchantRegistration, { root: __dirname });
});

app.post(config.base + '/paymentsuccess/:id', function (req, res) {
	beNowController.getWebCalculatedHash(req, function (data) {
		res.setHeader("X-Frame-Options", "ALLOW");
		if (data) {
			if (data.isVerified) {
				beNowController.savePaymentSuccess(req, function (sData) {
					res.setHeader("X-Frame-Options", "ALLOW");
					var paymentSuccessData = {
						title: req.body.productinfo,
						amount: req.body.amount,
						mode: req.body.mode,
						id: req.body.mihpayid,
						txnid: req.body.txnid
					};

					var errorTamperedData = {
						isSecurityError: false
					};

					res.send('<!doctype html>' +
						'<html>' +
						'    <head>' +
						'        <meta charset="utf-8">' +
						'        <meta name="viewport" content="width=device-width, initial-scale=1">' +
						'        <title>benow - payment link</title>' +
						'        <base href="/">' +
						'        <link rel="icon" type="image/x-icon" href="./favicon.png">' +
						'        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">' +
						'        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">' +
						'        <link href="https://fonts.googleapis.com/css?family=Fjalla+One" rel="stylesheet">' +
						'        <link rel="stylesheet" href="./libs.min.css" />' +
						'        <style>' +
						'            pay, paymentsuccess, paymentfailure, waitingforpayment {' +
						'                display: flex;' +
						'                min-height: 104vh;' +
						'                flex-direction: column;' +
						'            }' +
						'            main {' +
						'                flex: 1 0 auto;' +
						'            }' +
						'        </style>' +
						'    </head>' +
						'    <body>' +
						'        <benow></benow>' +
						"        <input type='hidden' id='paymentSuccessData' value='" + JSON.stringify(paymentSuccessData) + "' />" +
						"        <input type='hidden' id='errorTamperedData' value='" + JSON.stringify(errorTamperedData) + "' />" +
						'        <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en"></script>' +
						'        <script type="text/javascript" src="/app.js"></script>' +
						'    </body>' +
						'</html>');
				});
			}
			else {
				res.setHeader("X-Frame-Options", "ALLOW");
				var errorTamperedData = {
					isSecurityError: true,
					title: 'Security Breach',
					message: 'Sorry we cannot process this payment for security reasons,<br>please contact our customer support if your payment has not been reversed'
				}

				var paymentSuccessData = {};

				res.send('<!doctype html>' +
					'<html>' +
					'    <head>' +
					'        <meta charset="utf-8">' +
					'        <meta name="viewport" content="width=device-width, initial-scale=1">' +
					'        <title>benow - payment link</title>' +
					'        <base href="/">' +
					'        <link rel="icon" type="image/x-icon" href="./favicon.png">' +
					'        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">' +
					'        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">' +
					'        <link href="https://fonts.googleapis.com/css?family=Fjalla+One" rel="stylesheet">' +
					'        <link rel="stylesheet" href="./libs.min.css" />' +
					'        <style>' +
					'            pay, paymentsuccess, paymentfailure, waitingforpayment {' +
					'                display: flex;' +
					'                min-height: 104vh;' +
					'                flex-direction: column;' +
					'            }' +
					'            main {' +
					'                flex: 1 0 auto;' +
					'            }' +
					'        </style>' +
					'    </head>' +
					'    <body>' +
					'        <benow></benow>' +
					"        <input type='hidden' id='paymentSuccessData' value='" + JSON.stringify(paymentSuccessData) + "' />" +
					"        <input type='hidden' id='errorTamperedData' value='" + JSON.stringify(errorTamperedData) + "' />" +
					'        <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en"></script>' +
					'        <script type="text/javascript" src="/app.js"></script>' +
					'    </body>' +
					'</html>');
			}
		}
		else {
			res.setHeader("X-Frame-Options", "DENY");
			res.redirect(config.me + '/paymentfailure/' + req.params.id);
		}
	});

});

app.get(config.base + '/paymentfailure/:id', function (req, res) {
	res.setHeader("X-Frame-Options", "ALLOW");
	var paymentFailureData = {
		title: '',
		error: 'Server re-direct, page refreshed!',
		id: '',
		txnid: ''
	}

	var errorTamperedData = {
		isSecurityError: false
	};

	res.send('<!doctype html>' +
		'<html>' +
		'    <head>' +
		'        <meta charset="utf-8">' +
		'        <meta name="viewport" content="width=device-width, initial-scale=1">' +
		'        <title>benow - payment link</title>' +
		'        <base href="/">' +
		'        <link rel="icon" type="image/x-icon" href="./favicon.png">' +
		'        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">' +
		'        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">' +
		'        <link href="https://fonts.googleapis.com/css?family=Fjalla+One" rel="stylesheet">' +
		'        <link rel="stylesheet" href="./libs.min.css" />' +
		'        <style>' +
		'            pay, paymentsuccess, paymentfailure, waitingforpayment {' +
		'                display: flex;' +
		'                min-height: 104vh;' +
		'                flex-direction: column;' +
		'            }' +
		'            main {' +
		'                flex: 1 0 auto;' +
		'            }' +
		'        </style>' +
		'    </head>' +
		'    <body>' +
		'        <benow></benow>' +
		"        <input type='hidden' id='paymentFailureData' value='" + JSON.stringify(paymentFailureData) + "' />" +
		"        <input type='hidden' id='errorTamperedData' value='" + JSON.stringify(errorTamperedData) + "' />" +
		'        <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en"></script>' +
		'        <script type="text/javascript" src="/app.js"></script>' +
		'    </body>' +
		'</html>');
});

app.get(config.base + '/paymentfailure/:id/:dataTampered', function (req, res) {
	res.setHeader("X-Frame-Options", "ALLOW");
	var errorTamperedData = {
		isSecurityError: true,
		title: 'Security Breach',
		message: 'Sorry we cannot process this transaction for security reasons'
	}

	var paymentFailureData = {};

	res.send('<!doctype html>' +
		'<html>' +
		'    <head>' +
		'        <meta charset="utf-8">' +
		'        <meta name="viewport" content="width=device-width, initial-scale=1">' +
		'        <title>benow - payment link</title>' +
		'        <base href="/">' +
		'        <link rel="icon" type="image/x-icon" href="./favicon.png">' +
		'        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">' +
		'        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">' +
		'        <link href="https://fonts.googleapis.com/css?family=Fjalla+One" rel="stylesheet">' +
		'        <link rel="stylesheet" href="./libs.min.css" />' +
		'        <style>' +
		'            pay, paymentsuccess, paymentfailure, waitingforpayment {' +
		'                display: flex;' +
		'                min-height: 104vh;' +
		'                flex-direction: column;' +
		'            }' +
		'            main {' +
		'                flex: 1 0 auto;' +
		'            }' +
		'        </style>' +
		'    </head>' +
		'    <body>' +
		'        <benow></benow>' +
		"        <input type='hidden' id='paymentFailureData' value='" + JSON.stringify(paymentFailureData) + "' />" +
		"        <input type='hidden' id='errorTamperedData' value='" + JSON.stringify(errorTamperedData) + "' />" +
		'        <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en"></script>' +
		'        <script type="text/javascript" src="/app.js"></script>' +
		'    </body>' +
		'</html>');
});

app.post(config.base + '/paymentfailure/:id', function (req, res) {
	beNowController.getWebCalculatedHash(req, function (data) {
		res.setHeader("X-Frame-Options", "ALLOW");
		if (data) {
			if (data.isVerified) {
				beNowController.savePaymentFailure(req, function (sData) {
					res.setHeader("X-Frame-Options", "ALLOW");
					var paymentFailureData = {
						title: req.body.productinfo,
						error: req.body.error_Message,
						id: req.body.mihpayid,
						txnid: req.body.txnid
					}

					var errorTamperedData = {
						isSecurityError: false
					};

					res.send('<!doctype html>' +
						'<html>' +
						'    <head>' +
						'        <meta charset="utf-8">' +
						'        <meta name="viewport" content="width=device-width, initial-scale=1">' +
						'        <title>benow - payment link</title>' +
						'        <base href="/">' +
						'        <link rel="icon" type="image/x-icon" href="./favicon.png">' +
						'        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">' +
						'        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">' +
						'        <link href="https://fonts.googleapis.com/css?family=Fjalla+One" rel="stylesheet">' +
						'        <link rel="stylesheet" href="./libs.min.css" />' +
						'        <style>' +
						'            pay, paymentsuccess, paymentfailure, waitingforpayment {' +
						'                display: flex;' +
						'                min-height: 104vh;' +
						'                flex-direction: column;' +
						'            }' +
						'            main {' +
						'                flex: 1 0 auto;' +
						'            }' +
						'        </style>' +
						'    </head>' +
						'    <body>' +
						'        <benow></benow>' +
						"        <input type='hidden' id='paymentFailureData' value='" + JSON.stringify(paymentFailureData) + "' />" +
						"        <input type='hidden' id='errorTamperedData' value='" + JSON.stringify(errorTamperedData) + "' />" +
						'        <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en"></script>' +
						'        <script type="text/javascript" src="/app.js"></script>' +
						'    </body>' +
						'</html>');
				});
			}
			else {
				res.setHeader("X-Frame-Options", "ALLOW");
				var errorTamperedData = {
					isSecurityError: true,
					title: 'Security Breach',
					message: 'Sorry we cannot process this payment for security reasons,<br>please contact our customer support if your payment has not been reversed'
				}

				var paymentFailureData = {}

				res.send('<!doctype html>' +
					'<html>' +
					'    <head>' +
					'        <meta charset="utf-8">' +
					'        <meta name="viewport" content="width=device-width, initial-scale=1">' +
					'        <title>benow - payment link</title>' +
					'        <base href="/">' +
					'        <link rel="icon" type="image/x-icon" href="./favicon.png">' +
					'        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">' +
					'        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">' +
					'        <link href="https://fonts.googleapis.com/css?family=Fjalla+One" rel="stylesheet">' +
					'        <link rel="stylesheet" href="./libs.min.css" />' +
					'        <style>' +
					'            pay, paymentsuccess, paymentfailure, waitingforpayment {' +
					'                display: flex;' +
					'                min-height: 104vh;' +
					'                flex-direction: column;' +
					'            }' +
					'            main {' +
					'                flex: 1 0 auto;' +
					'            }' +
					'        </style>' +
					'    </head>' +
					'    <body>' +
					'        <benow></benow>' +
					"        <input type='hidden' id='errorTamperedData' value='" + JSON.stringify(errorTamperedData) + "' />" +
					"        <input type='hidden' id='paymentFailureData' value='" + JSON.stringify(paymentFailureData) + "' />" +
					'        <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en"></script>' +
					'        <script type="text/javascript" src="/app.js"></script>' +
					'    </body>' +
					'</html>');
			}
		}
		else {
			res.setHeader("X-Frame-Options", "DENY");
			res.redirect(config.me + '/paymentfailure/' + req.params.id);
		}
	});
});

app.get(config.base + '/home', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/mrhome', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.merchantRegistration, { root: __dirname });
});

app.get(config.base + '/mrpayment', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.merchantRegistration, { root: __dirname });
});

app.get(config.base + '/paymentlink', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/ngo', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.post('/mrsuccess', function (req, res) {
	var inpObj = req.body;
	res.send('<!doctype html>' +
		' <html>' +
		' <head>' +
		' <meta charset="utf-8">' +
		' <meta name="viewport" content="width=device-width, initial-scale=1">' +
		' <title>benow - merchant console</title>' +
		' <base href="/">' +
		' <link rel="icon" type="image/x-icon" href="./favicon.png">' +
		' <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">' +
		' <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">' +
		' <link href="https://fonts.googleapis.com/css?family=Fjalla+One" rel="stylesheet">' +
		' <link rel="stylesheet" href="./mrlibs.min.css" />' +
		'   <style>' +
		'     dashboard {' +
		'       display: flex;' +
		'      min-height: 96vh;' +
		'     flex-direction: column;' +
		'     }' +

		'     .tabs {' +
		'        overflow-x: hidden;' +
		'      }' +

		'  main {' +
		'     flex: 1 0 auto;' +
		'    }' +
		' </style>' +
		' </head>' +
		'  <body>' +
		'   <benow></benow>' +
		"     <input type='hidden' id='paymentSuccessData' value='" + JSON.stringify(inpObj) + "' />" +
		'  <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en"></script>' +
		'        <script type="text/javascript" src="/mrapp.js"></script>' +
		' </body>' +
		'</html>');
});

app.post('/mrfailure', function (req, res) {
	var inpObj = req.body;
	var data = {
		"error_message": inpObj.error_message
	};
	res.send('<!doctype html>' +
		' <html>' +
		' <head>' +
		' <meta charset="utf-8">' +
		' <meta name="viewport" content="width=device-width, initial-scale=1">' +
		' <title>benow - merchant console</title>' +
		' <base href="/">' +
		' <link rel="icon" type="image/x-icon" href="./favicon.png">' +
		' <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">' +
		' <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">' +
		' <link href="https://fonts.googleapis.com/css?family=Fjalla+One" rel="stylesheet">' +
		' <link rel="stylesheet" href="./mrlibs.min.css" />' +
		'   <style>' +
		'     dashboard {' +
		'       display: flex;' +
		'      min-height: 96vh;' +
		'     flex-direction: column;' +
		'     }' +

		'     .tabs {' +
		'        overflow-x: hidden;' +
		'      }' +

		'  main {' +
		'     flex: 1 0 auto;' +
		'    }' +
		' </style>' +
		' </head>' +
		'  <body>' +
		'   <benow></benow>' +
		"     <input type='hidden' id='paymentFailureData' value='" + JSON.stringify(data) + "' />" +
		'  <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en"></script>' +
		'        <script type="text/javascript" src="/mrapp.js"></script>' +
		' </body>' +
		'</html>');
});

app.post('/hash', function (req, res) {
	var payloadObj = req.body;
	var inpObj = payloadObj.data;
	var merchantCode = payloadObj.merchantCode;
	var salt = payloadObj.salt;
	var headers = req.headers;
	var salt = 'abcd';
	var stringToHash = inpObj + merchantCode + salt;
	var hashData = getMd5(payloadObj.strToHash + merchantCode + salt, salt)
	res.send({ "hash": hashData });
})

app.get(config.base + '/issuepayment/:mChequeNumber', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/dashboard', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/registration', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/newdashboard', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/mrdashboard', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.merchantRegistration, { root: __dirname });
});

app.get(config.base + '/newdashboard', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/invoices', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/logout', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/logout/:status', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/mrlogout', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.merchantRegistration, { root: __dirname });
});

app.get(config.base + '/mrlogout/:status', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.merchantRegistration, { root: __dirname });
});

app.get(config.base + '/login/:status', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/autologin/:creds', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/mrlogin/:status', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.merchantRegistration, { root: __dirname });
});

app.get(config.base + '/pwdchanged/:status', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/changepwd/:status', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/emailed/:status', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.post(config.base + '/jiofailure', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.json({ "failureReceived": true });
})

app.post(config.base + '/jiosuccess', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.json({ "successReceived": true });
})

app.get(config.base + '/verify/:status', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/mrverify/:status', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.merchantRegistration, { root: __dirname });
});

app.get(config.base + '/qrprint/:url', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/paymentsummary/:params', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/historyprint/:params', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/superhistoryprint/:params', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/summaryprint/:params', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.post(config.base + '/paymentreceived', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	try {
		var b = crypto.createHash('sha256').update(config.decryptionKey).digest('hex').toLowerCase();
		var c = crypto.createHash('md5').update(b).digest('hex').toLowerCase();
		if (c && c.length > 16)
			c = c.substring(0, 16);

		var iv = new Buffer('xxxxyyyyzzzzwwww');
		var cipher = crypto.createDecipheriv('aes-128-cbc', new Buffer(c), iv);
		var d = cipher.update(req.body, 'base64', 'utf8') + cipher.final('utf8');
		var data = JSON.parse(d);
		if (data && data.merchantCode) {
			var room = data.merchantCode;
			if (data.till && data.till.trim().length > 0)
				room += '|' + data.till;

			ioi.sockets.in(room).emit('paymentreceived', {
				amount: data.amount,
				id: data.txnId,
				tr: data.refNumber,
				mode: data.paymentMethod,
				vpa: data.payerName,
				till: data.till,
				dt: data.transactionDate
			});
		}

		res.json(data);
	}
	catch (err) {
		res.json(null);
	}
});

app.get(config.base + '/history/:params', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/tilassign', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/superconsole/:params', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.home, { root: __dirname });
});

app.get(config.base + '/mrfetchverified/:status', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.merchantRegistration, { root: __dirname });
});

app.get(config.base + '/merchantverify', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.merchantVerification, { root: __dirname });
});

app.get(config.base + '/retaillogin/:status', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile(urls.merchantRegistration, { root: __dirname });
});

app.get(config.base + '/mglshare', function (req, res) {
	res.send('<!doctype html>' +
		'<html>' +
		'    <head>' +
		'        <meta charset="utf-8">' +
		'        <meta name="viewport" content="width=device-width, initial-scale=1">' +
		'        <title>Benow - Mahanagar Gas Bill</title>' +
		'        <meta property="og:title" content="Get ₹ 50 Cashback on paying MGL Gas Bill. I did." />' +
		'        <meta property="og:description" content="Click the link below to pay. T&C apply." />' +
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

app.get(config.base + '/redirect/:url', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.send('<!doctype html>' +
		'<html>' +
		'    <head>' +
		'        <meta charset="utf-8">' +
		'        <title>benow - payment link</title>' +
		'    </head>' +
		'    <body>' +
		'		 <script type="text/javascript">' +
		'			(function () {' +
		'				window.location.assign("' + decodeURIComponent(req.params.url) + '");' +
		'		    })()' +
		'		</script>' +
		'    </body>' +
		'</html>');
});

app.post(config.base + '/paymentstatus/:id', function (req, res) {
	beNowController.savePaymentSuccess(req, function (sData) {
		var paymentStatusData = {
			addedon: req.body.addedon,
			address1: req.body.address1,
			address2: req.body.address2,
			amount: req.body.amount,
			bank_ref_num: req.body.bank_ref_num,
			bankcode: req.body.bankcode,
			cardCategory: req.body.cardCategory,
			cardnum: req.body.cardnum,
			city: req.body.city,
			country: req.body.country,
			discount: req.body.discount,
			email: req.body.email,
			error: req.body.error,
			error_Message: req.body.error_Message,
			field1: req.body.field1,
			field2: req.body.field2,
			field3: req.body.field3,
			field4: req.body.field4,
			field5: req.body.field5,
			field6: req.body.field6,
			field7: req.body.field7,
			field8: req.body.field8,
			field9: req.body.field9,
			firstname: req.body.firstName,
			id: req.body.id,
			lastname: req.body.lastName,
			mihpayid: req.body.mihpayid,
			mode: req.body.mode,
			name_on_card: req.body.name_on_card,
			net_amount_debit: req.body.net_amount_debit,
			payment_source: req.body.payment_source,
			PG_TYPE: req.body.PG_TYPE,
			phone: req.body.phone,
			productinfo: req.body.productinfo,
			state: req.body.state,
			status: req.body.status,
			txnid: req.body.txnid,
			udf1: req.body.udf1,
			udf2: req.body.udf2,
			udf3: req.body.udf3,
			udf4: req.body.udf4,
			udf5: req.body.udf5,
			udf6: req.body.udf6,
			udf7: req.body.udf7,
			udf8: req.body.udf8,
			udf9: req.body.udf9,
			udf10: req.body.udf10,
			unmappedstatus: req.body.unmappedstatus,
			zipcode: req.body.zipcode
		}

		res.send('<!doctype html>' +
			'<html>' +
			'    <head>' +
			'        <meta charset="utf-8">' +
			'        <title>benow - payment link</title>' +
			'    </head>' +
			'    <body>' +
			"        <input type='hidden' id='paymentSuccessData' value='" + JSON.stringify(paymentStatusData).replace(/'/g, "") + "' />" +
			'		 <script type="text/javascript">' +
			'			(function (toast) {' +
			'				Android.setJson(document.getElementById("paymentSuccessData").value);' +
			'		    })()' +
			'		</script>' +
			'    </body>' +
			'</html>');
	});
});

app.get(config.base + '/webpaymentstatus/:id/:url', function (req, res) {

	var id = req.params.id; // $_GET["id"]
	var url = urlencode.decode(req.params.url, 'gbk');

	if (id == 0) {
		var errorObject = {
			'error_message': 'Hash does not match',
			'isSuccess': false,
			'id': id,
			'url': url
		};

		res.send('<!doctype html>' +
			'<html>' +
			'    <head>' +
			'        <meta charset="utf-8">' +
			'        <title>benow - payment link</title>' +
			'<base href="/">' +
			'    </head>' +
			'    <body>' +
			'	<benow></benow>' +
			"        <input type='hidden' id='hashErrorObject' value='" + JSON.stringify(errorObject) + "' />" +
			'        <script type="text/javascript" src="/app.js"></script>' +
			'    </body>' +
			'</html>');
	}
	else {
		beNowController.savePaymentSuccess(req, function (sData) {
			var paymentStatusData = {
				addedon: req.body.addedon,
				address1: req.body.address1,
				address2: req.body.address2,
				amount: req.body.amount,
				bank_ref_num: req.body.bank_ref_num,
				bankcode: req.body.bankcode,
				cardCategory: req.body.cardCategory,
				cardnum: req.body.cardnum,
				city: req.body.city,
				country: req.body.country,
				discount: req.body.discount,
				email: req.body.email,
				error: req.body.error,
				error_Message: req.body.error_Message,
				field1: req.body.field1,
				field2: req.body.field2,
				field3: req.body.field3,
				field4: req.body.field4,
				field5: req.body.field5,
				field6: req.body.field6,
				field7: req.body.field7,
				field8: req.body.field8,
				field9: req.body.field9,
				firstname: req.body.firstName,
				id: req.body.id,
				lastname: req.body.lastName,
				mihpayid: req.body.mihpayid,
				mode: req.body.mode,
				name_on_card: req.body.name_on_card,
				net_amount_debit: req.body.net_amount_debit,
				payment_source: req.body.payment_source,
				PG_TYPE: req.body.PG_TYPE,
				phone: req.body.phone,
				productinfo: req.body.productinfo,
				state: req.body.state,
				status: req.body.status,
				txnid: req.body.txnid,
				udf1: req.body.udf1,
				udf2: req.body.udf2,
				udf3: req.body.udf3,
				udf4: req.body.udf4,
				udf5: req.body.udf5,
				udf6: req.body.udf6,
				udf7: req.body.udf7,
				udf8: req.body.udf8,
				udf9: req.body.udf9,
				udf10: req.body.udf10,
				unmappedstatus: req.body.unmappedstatus,
				zipcode: req.body.zipcode
			}
		});
		res.send('<!doctype html>' +
			'<html>' +
			'    <head>' +
			'        <meta charset="utf-8">' +
			'        <title>benow - payment link</title>' +
			'    </head>' +
			'    <body>' +
			"        <input type='hidden' id='paymentSuccessData' value='" + JSON.stringify(paymentStatusData).replace(/'/g, "") + "' />" +
			'		 <script type="text/javascript">' +
			'			(function (toast) {' +
			'				Android.setJson(document.getElementById("paymentSuccessData").value);' +
			'		    })()' +
			'		</script>' +
			'    </body>' +
			'</html>');
	}
});

app.use(function (err, req, res, next) {
	console.log(err.stack);
	/*
	cUtils.sendErrEmail(req.headers.host + req.url + '\n\n\n' + err.message + '\n\n\n' + err.stack);
	res.status(500).json({
		success:false, 
		data: msgs.internalSvrErr
	});
	*/
});

function start(app, options) {
	if (options) {
		console.log('starting https');
		return require('https').createServer(options, app);
	}

	console.log('starting http');
	return require('http').createServer(app);
}

var options = setup(config.ssl);
const svr = start(app, options).listen(config.port);
var ioi = io.listen(svr);
ioi.sockets.on('connection', function (socket) {
	socket.on('merchantroom', function (room) {
		if (room && room.room) {
			socket.join(room.room);
		}
	});

	socket.on('possession', function (room) {
		if (room && room.room) {
			socket.join(room.room);
		}
	});
});

app.post(config.base + '/merchantotpverified/:mcode', function (req, res) {
	ioi.sockets.in(req.params.mcode).emit('merchantonboarded', {
		mcode: req.params.mcode
	});

	res.send('emitted');
});

sTask.migrate();
